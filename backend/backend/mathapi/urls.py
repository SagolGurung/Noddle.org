from django.urls import path
from .views import ask_math_question

urlpatterns = [
    path("ask/", ask_math_question, name="ask_math_question"),
]
