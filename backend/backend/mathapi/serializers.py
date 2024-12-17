from rest_framework import serializers

class MathQuestionSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=500)
