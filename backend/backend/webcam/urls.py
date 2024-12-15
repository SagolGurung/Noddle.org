from django.urls import path
from .views import FaceAndPhoneDetectionView

urlpatterns = [
    path('webcam/', FaceAndPhoneDetectionView.as_view(), name='face-detection'),
]
