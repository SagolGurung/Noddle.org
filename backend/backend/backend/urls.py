from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('rest_framework.urls')),
    path('dataapi/', include('quiz.urls')),
    path('api/', include('accounts.urls')),
    path('api/', include('webcam.urls')),

    
]