from djongo import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = (
        ('recruiter','Recruiter'),
        ('candidate','Candidate'),
    )
    role = models.CharField(max_length=20,choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"
    
class Job(models.Model):
    id = models.ObjectIdField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20,default='open')
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs',null=True,blank=True)

    def __str__(self):
        return self.title
    

class Application(models.Model):
    STATUS_CHOICES = (
        ('Applied', 'Applied'),
        ('Interviewed', 'Interviewed'),
        ('Selected', 'Selected'),
        ('Rejected', 'Rejected'),
        ('On Hold', 'On Hold'),
    )
    candidate = models.ForeignKey(User,on_delete=models.CASCADE,related_name='applications')
    job = models.ForeignKey(Job,on_delete=models.CASCADE,related_name='applications')
    resumeUrl = models.URLField()
    parsed_fields = models.TextField(null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Applied')

    def __str__(self):
        return f"Application by {self.candidate.username} for {self.job.title}"