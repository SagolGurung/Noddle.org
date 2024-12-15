from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import cv2
import numpy as np
import base64
import os
import torch
from rest_framework.permissions import AllowAny
import logging

# Initialize logger
logger = logging.getLogger('webcam')  # Replace 'webcam' with your app name

# Paths to Haar cascade and YOLO model
CASCADE_PATH = os.path.join(os.path.dirname(__file__), 'static', 'haarcascade_frontalface_default.xml')
YOLO_PATH = os.path.join(os.path.dirname(__file__), 'static', 'cellphonedetect.pt')
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

# Load YOLOv5 model (only once during server start for efficiency)
try:
    model = torch.hub.load('ultralytics/yolov5', 'custom', path=YOLO_PATH, force_reload=True)
    model.conf = 0.25  # Confidence threshold
    logger.debug("YOLOv5 model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading YOLOv5 model: {e}")
    raise e

# Verify model class names for debugging
logger.debug(f"Model classes: {model.names}")  # For debugging

class FaceAndPhoneDetectionView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        image_data = request.data.get('image', None)
        if image_data is None:
            logger.warning("No image data provided.")
            return Response({"error": "No image data provided."}, status=status.HTTP_400_BAD_REQUEST)

        # If dataURL, strip the prefix
        if image_data.startswith("data:image"):
            image_data = image_data.split(",")[1]

        # Decode the image
        try:
            img_binary = base64.b64decode(image_data)
            np_arr = np.frombuffer(img_binary, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError("Image decoding failed.")
        except Exception as e:
            logger.error(f"Image decoding failed: {e}")
            return Response({"error": f"Image decoding failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Resize the image for consistent input size
        try:
            img_resized = cv2.resize(img, (640, 640))
        except Exception as e:
            logger.error(f"Image resizing failed: {e}")
            return Response({"error": f"Image resizing failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Convert image to RGB
        try:
            img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
        except Exception as e:
            logger.error(f"Color conversion failed: {e}")
            return Response({"error": f"Color conversion failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Run YOLOv5 for cell phone detection
        try:
            results = model(img_rgb)
            detections = results.xyxy[0].cpu().numpy()  # Convert to numpy for further processing
            logger.debug(f"YOLO detections: {detections}")
        except Exception as e:
            logger.error(f"YOLO detection failed: {e}")
            return Response({"error": f"YOLO detection failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Analyze YOLO detections
        detected_phones = 0
        for *box, conf, cls in detections:  # x1, y1, x2, y2, confidence, class
            class_id = int(cls)
            label = model.names[class_id]
            logger.debug(f"Detected label: {label}, confidence: {conf}")

            if label.lower() == "cell phone":
                detected_phones += 1
                break  # Stop further processing if a phone is detected

        # If a phone is detected, return immediately
        if detected_phones > 0:
            logger.info("Cell phone detected.")
            return Response({"status": "phone_detected"}, status=status.HTTP_200_OK)

        # Additional face detection using Haar Cascade
        try:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces_haar = face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30)
            )
            detected_faces_haar = len(faces_haar)
            logger.debug(f"Detected faces: {detected_faces_haar}")
        except Exception as e:
            logger.error(f"Face detection failed: {e}")
            return Response({"error": f"Face detection failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Determine final status based on face detection results
        if detected_faces_haar == 0:
            status_text = "suspicious"
        else:
            status_text = "normal"

        logger.info(f"Final status: {status_text}")
        return Response({"status": status_text}, status=status.HTTP_200_OK)
