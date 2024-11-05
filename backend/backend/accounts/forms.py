from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ("email",)

class CustomUserChangeForm(UserCreationForm):
    class Meta():
        model = CustomUser
        fields = ("email",) 