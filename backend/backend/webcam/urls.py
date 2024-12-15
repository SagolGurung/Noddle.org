from django.urls import path
from .views import FaceDetectionView

urlpatterns = [
    path('webcam/', FaceDetectionView.as_view(), name='face-detection'),
]
