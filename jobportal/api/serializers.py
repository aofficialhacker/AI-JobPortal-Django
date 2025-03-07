from rest_framework import serializers
from .models import User,Job,Application
from bson import ObjectId
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True, min_length=6)

    class Meta:
        model = User
        fields = ['username','email','password','role']

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data['username'],
            email = validated_data['email'],
            password= validated_data['password'],
            role = validated_data['role']
        )
        return user

class ObjectIdStringField(serializers.Field):
    """Converts ObjectId to string and back (if needed)."""
    def to_representation(self, value):
        return str(value)
    def to_internal_value(self, data):
        return data  # Typically you'd validate here if needed

class JobSerializer(serializers.ModelSerializer):
    id = ObjectIdStringField(read_only=True)
    posted_by = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'status', 'posted_by']

class ObjectIdRelatedField(serializers.RelatedField):
    """Converts a string ObjectId to a Job object."""
    queryset = Job.objects.all()

    def to_internal_value(self, data):
        # Validate that 'data' is a valid ObjectId
        try:
            obj_id = ObjectId(data)
        except Exception:
            raise serializers.ValidationError("Invalid ObjectId format.")

        # Manually look up the Job
        try:
            return self.queryset.get(pk=obj_id)
        except Job.DoesNotExist:
            raise serializers.ValidationError("Job does not exist.")

    def to_representation(self, value):
        # Convert the Job object's PK (ObjectId) to string
        return str(value.pk)

class IntegerPKRelatedField(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, data):
        try:
            # Convert the incoming value to an integer
            data = int(data)
        except (TypeError, ValueError):
            self.fail('incorrect_type', data_type=type(data).__name__)
        return super().to_internal_value(data)

class ApplicationSerializer(serializers.ModelSerializer):
    job = IntegerPKRelatedField(queryset=Job.objects.all())
    resume = serializers.FileField(write_only=True, required=False)
    job_title = serializers.SerializerMethodField()
    candidate_username = serializers.SerializerMethodField()
    
    def get_job_title(self, obj):
        return obj.job.title if obj.job else None
    
    def get_candidate_username(self, obj):
        return obj.candidate.username if obj.candidate else None
    
    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'candidate_username', 'resume', 'resumeUrl', 'parsed_fields', 'applied_at', 'status']
        read_only_fields = ['id', 'resumeUrl', 'parsed_fields', 'applied_at', 'job_title', 'candidate_username']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role  # Assumes your User model has a 'role' field
        return token