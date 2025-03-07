from django.shortcuts import render
from rest_framework import generics,viewsets
from rest_framework.permissions import AllowAny,IsAuthenticated
from .serializers import RegisterSerializer,JobSerializer
from .models import Job
from rest_framework.views import APIView
from .serializers import ApplicationSerializer
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import requests
from rest_framework.response import Response
from rest_framework import status
from .models import Application
import PyPDF2
from google import genai
from google.genai import types
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404
import re
from .permissions import IsRecruiter, IsCandidate, IsOwnerOrRecruiter
# Create your views here.

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get_permissions(self):
        """Return different permissions depending on the action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only recruiters can create, update, or delete jobs
            permission_classes = [IsAuthenticated, IsRecruiter]
        else:
            # Anyone authenticated can view jobs
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Set posted_by to the logged-in user (if any)
        serializer.save(posted_by=self.request.user)

    def get_queryset(self):
        # If user is a recruiter, only show their jobs
        if self.request.user.role == 'recruiter':
            return Job.objects.filter(posted_by=self.request.user)
        # Otherwise show all jobs
        return Job.objects.all()

class ApplicationCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            job_instance = serializer.validated_data.get('job')
            resume_file = serializer.validated_data.get('resume')
            candidate = request.user

            # Save the resume file locally
            file_path = default_storage.save('resumes/' + resume_file.name, ContentFile(resume_file.read()))
            resume_url = request.build_absolute_uri(default_storage.url(file_path))

            # Extract text from the PDF using PyPDF2
            extracted_text = ""
            with default_storage.open(file_path, 'rb') as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                for page in pdf_reader.pages:
                    extracted_text += page.extract_text() or ""

            prompt = (
                "You are a resume parser designed to extract only the essential information required by a job recruiter. "
                "Analyze the resume text below and provide concise bullet points summarizing the candidate's education, skills, "
                "work experience, certifications, and any relevant achievements. Do not include any extraneous details.\n\n"
                "Resume Text:\n" + extracted_text
            )
            
            # Initialize the Gemini client
            client = genai.Client(api_key="AIzaSyBFG53Rk7yDAIu44-Hb1E5qPNk8gFgIrFI")  # Replace with your Gemini API key

            # Call the Gemini API to analyze the extracted text.
            # Here we use the generate_content method as described in the Gemini API docs.
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[prompt],
                config=types.GenerateContentConfig(
                    max_output_tokens=500,
                    temperature=0.1
                )
            )
            
            # Get the generated text from Gemini as the parsed details
            parsed_details = response.text

            # Create the application record with the parsed details from Gemini
            application = Application.objects.create(
                candidate=candidate,
                job=job_instance,
                resumeUrl=resume_url,
                parsed_fields=parsed_details,
            )
            return Response({
                "message": "Application submitted successfully",
                "application_id": application.id,
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ApplicationScoreView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrRecruiter]

    def get(self, request, pk, format=None):
        # Retrieve the application; return 404 if not found.
        application = get_object_or_404(Application, pk=pk)
        
        # Check object-level permissions
        self.check_object_permissions(request, application)
        
        # Extract job description from the application's job object.
        job_description = application.job.description if application.job and application.job.description else ""
        # Extract candidate's parsed resume details. We assume parsed_fields is either a string 
        # or an object with a 'parsed_summary' key.
        if isinstance(application.parsed_fields, dict):
            parsed_details = application.parsed_fields.get('parsed_summary', "")
        else:
            parsed_details = application.parsed_fields or ""
        
        if not job_description or not parsed_details:
            return Response(
                {"error": "Missing job description or parsed resume details"},
                status=400
            )
        
        # Build the prompt to instruct Gemini to return only a single integer rating.
        prompt = (
            f"You are an HR expert. Evaluate the candidate's fit for the job based on the following information.\n\n"
            f"Job Description: \"{job_description}\"\n"
            f"Candidate Resume Details: \"{parsed_details}\"\n\n"
            "Provide a single integer rating between 1 and 10 (inclusive) that represents how well the candidate fits this job. "
            "Return only the number."
        )
        print(prompt)

        # Initialize the Gemini client
        client = genai.Client(api_key="AIzaSyBFG53Rk7yDAIu44-Hb1E5qPNk8gFgIrFI") 
        
        # Call the Gemini API with a deterministic configuration (temperature 0.0 for predictable output)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt],
            config=types.GenerateContentConfig(
                max_output_tokens=20,
                temperature=0.0
            )
        )
        score_text = response.text.strip()
        # Extract a single integer from the response using regex (only allow full integer)
        match = re.match(r'^(\d+)$', score_text)
        if match:
            score = match.group(1)
        else:
            score = "N/A"
        
        return Response({"application_id": pk, "score": f"{score}/10"})


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
            

class RecruiterApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        user = self.request.user
        # Return applications only for jobs posted by the logged-in recruiter.
        return Application.objects.filter(job__posted_by=user)
