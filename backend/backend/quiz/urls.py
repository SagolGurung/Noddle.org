from django.urls import path
from .views import QuizListView, QuizDetailView, SubmitQuizView

urlpatterns = [
    path('quizzes/', QuizListView.as_view(), name='quiz-list'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/<int:pk>/submit/', SubmitQuizView.as_view(), name='quiz-submit'),
]
