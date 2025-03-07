from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import RegisterView,JobViewSet,ApplicationCreateView,RecruiterApplicationListView,ApplicationScoreView
from .views import MyTokenObtainPairView
from .views_candidate import CandidateApplicationListView
from .views_status import ApplicationStatusUpdateView


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from .views import RegisterView

router = DefaultRouter()
router.register('jobs',JobViewSet,basename='job')


urlpatterns = [
    path('auth/register/',RegisterView.as_view(),name='auth-register'),
    path('auth/login/',MyTokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('auth/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('applications/', ApplicationCreateView.as_view(), name='application-create'),
    path('applications/<int:pk>/score/', ApplicationScoreView.as_view(), name='application-score'),
    path('applications/<int:pk>/status/', ApplicationStatusUpdateView.as_view(), name='application-status-update'),
    path('recruiter/applications/', RecruiterApplicationListView.as_view(), name='recruiter-applications'),
    path('candidate/applications/', CandidateApplicationListView.as_view(), name='candidate-applications'),
    path('',include(router.urls)),

]