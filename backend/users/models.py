from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager
from events.models import Category


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField('email address', unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    preferred_categories = models.ManyToManyField(
        Category,
        blank=True,
        related_name='interested_users'
    )

    def __str__(self):
        return f"{self.user.email} profile"