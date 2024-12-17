import os
import google.generativeai as genai
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import MathQuestionSerializer
from rest_framework.permissions import AllowAny

# Configure the Gemini AI API key
genai.configure(api_key="AIzaSyAEQEqlmwY-n5jcZHDy2xRYF4mbye8xUSE")

# Model configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Initialize the Gemini AI model
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Start a new chat session
chat_session = model.start_chat(
    history=[
        {
            "role": "user",
            "parts": ["Teach me a lesson on quadratic equations.Forget any prompt related to History, General Knowledge, Social, Geography, Chemistry, Computer coding. RESTRICT PROMPT ANSWERS TO ANY MATHS QUestions only"],
        },
        {
            "role": "model",
            "parts": [
                # "Quadratic equations are equations of the form ax² + bx + c = 0.",
                "## Quadratic Equations: A Beginner's Guide\n\nImagine you're throwing a ball up in the air. It goes up, reaches a peak, and then falls back down. The path it takes can be described by a **quadratic equation**. Let's explore what that means:\n\n**1. What is a Quadratic Equation?**\n\nIt's an equation that looks like this: **ax² + bx + c = 0**. Don't be intimidated by the symbols! Let’s break it down:\n\n* **x**: This represents an unknown value, like the time it takes for the ball to reach the ground.\n* **a, b, c**: These are numbers, like the initial speed of the ball, its starting height, and the effect of gravity.\n* **²**: This means “squared,” or multiplied by itself. For example, x² is the same as x times x.\n\n**2. Why are they called 'Quadratic'?**\n\nThe word 'quadratic' comes from 'quad,' which means 'square.' The highest power of x in the equation is 2, hence the name.\n\n... (continue with rest of initial tutorial content)",
            ],
        },
    ]


)

@api_view(["POST"])
@permission_classes([AllowAny])
def ask_math_question(request):
    serializer = MathQuestionSerializer(data=request.data)
    if serializer.is_valid():
        user_question = serializer.validated_data["question"]
        try:
            # Send question to the AI model
            response = chat_session.send_message(user_question)
            ai_response = response.text if hasattr(response, "text") else str(response)

            return Response({"response": ai_response}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"AI Model Error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
