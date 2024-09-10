from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import authenticate
# from django.contrib.auth.models import User

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username')


class UserRegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'password1', 'password2')
        extra_kwargs = {
            'password': {'write_only': True},
        }
    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError('Passwords do not match')
        password = attrs.get('password1','')
        if len(password) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters long')
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')

        return CustomUser.objects.create_user(**validated_data, password=password) 
    
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid email or password")

        
    



