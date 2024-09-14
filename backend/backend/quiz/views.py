from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Quiz, Question, Answer, Choice
from .serializers import QuizSerializer, AnswerSerializer, QuizSubmissionSerializer
from django.shortcuts import get_object_or_404

# List all quizzes
class QuizListView(generics.ListAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = (AllowAny,)

# Retrieve a specific quiz with its questions
class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

# Handle quiz submission
class SubmitQuizView(generics.CreateAPIView):
    serializer_class = QuizSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        quiz_id = kwargs.get('pk')  # get quiz ID from the URL
        answers = request.data.get('answers')  # expecting list of answers (question_id, choice_id)

        correct_answers = 0
        total_questions = 0

        for answer_data in answers:
            question_id = answer_data['question_id']
            choice_id = answer_data['choice_id']

            # Check if the answer is correct
            question = get_object_or_404(Question, id=question_id, quiz_id=quiz_id)
            choice = get_object_or_404(Choice, id=choice_id, question=question)

            if choice.is_correct:
                correct_answers += 1

            # Save the answer
            Answer.objects.create(user=request.user, question=question, choice=choice)
            total_questions += 1

        score = (correct_answers / total_questions) * 100
        return Response({'score': score}, status=status.HTTP_200_OK)
