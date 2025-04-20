from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile
from events.models import Category

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ('email', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )


class UserProfileSerializer(serializers.ModelSerializer):
    preferred_categories = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = UserProfile
        fields = ['preferred_categories']
