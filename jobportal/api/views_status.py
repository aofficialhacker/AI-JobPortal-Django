from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Application
from .permissions import IsRecruiter
from django.shortcuts import get_object_or_404

class ApplicationStatusUpdateView(APIView):
    """View for updating the status of an application."""
    permission_classes = [IsAuthenticated, IsRecruiter]
    
    def patch(self, request, pk):
        # Get the application or return 404
        application = get_object_or_404(Application, pk=pk)
        
        # Check if the job was posted by the current recruiter
        if application.job.posted_by != request.user:
            return Response(
                {"error": "You do not have permission to update this application's status."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get the new status from the request data
        new_status = request.data.get('status')
        
        # Validate the status
        valid_statuses = [status[0] for status in Application.STATUS_CHOICES]
        if not new_status or new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the application status
        application.status = new_status
        application.save()
        
        return Response(
            {"message": "Application status updated successfully", "status": new_status},
            status=status.HTTP_200_OK
        )