from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Application
from .serializers import ApplicationSerializer

class CandidateApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Return only applications submitted by the logged-in candidate
        return Application.objects.filter(candidate=user)