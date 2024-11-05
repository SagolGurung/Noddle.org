from rest_framework import serializers
from .models import Quiz, Question, Choice, Answer

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'choice_text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_by', 'questions']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'user', 'question', 'choice', 'submitted_at']

class QuizSubmissionSerializer(serializers.Serializer):
    # This will be used for handling quiz submissions
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()
