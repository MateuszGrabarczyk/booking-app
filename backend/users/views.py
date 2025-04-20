from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserRegisterSerializer

class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        resp = super().create(request, *args, **kwargs)
        return Response({"user": resp.data}, status=status.HTTP_201_CREATED)