from rest_framework import permissions

class IsRecruiter(permissions.BasePermission):
    """
    Custom permission to only allow recruiters to access the view.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and is a recruiter
        return request.user and request.user.is_authenticated and request.user.role == 'recruiter'

class IsCandidate(permissions.BasePermission):
    """
    Custom permission to only allow candidates to access the view.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and is a candidate
        return request.user and request.user.is_authenticated and request.user.role == 'candidate'

class IsOwnerOrRecruiter(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or recruiters to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Check if user is a recruiter
        if request.user.role == 'recruiter':
            # For jobs, check if the recruiter is the one who posted it
            if hasattr(obj, 'posted_by'):
                return obj.posted_by == request.user
            # For applications, check if the recruiter posted the related job
            elif hasattr(obj, 'job') and hasattr(obj.job, 'posted_by'):
                return obj.job.posted_by == request.user
            return False
        
        # Check if user is the owner of the application
        elif request.user.role == 'candidate':
            if hasattr(obj, 'candidate'):
                return obj.candidate == request.user
            return False
        
        return False