from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import cv2
import numpy as np
import base64
import os
from rest_framework.permissions import IsAuthenticated, AllowAny

# Adjust the path to the Haar cascade file
CASCADE_PATH = os.path.join(os.path.dirname(__file__), 'haarcascade_frontalface_default.xml')
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

class FaceDetectionView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        image_data = request.data.get('image', None)
        if image_data is None:
            return Response({"error": "No image data provided."}, status=status.HTTP_400_BAD_REQUEST)

        # If dataURL, strip the prefix
        if image_data.startswith("data:image"):
            image_data = image_data.split(",")[1]

        img_binary = base64.b64decode(image_data)
        np_arr = np.frombuffer(img_binary, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30,30))

        if len(faces) > 0:
            return Response({"status": "normal"}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "suspicious"}, status=status.HTTP_200_OK)
