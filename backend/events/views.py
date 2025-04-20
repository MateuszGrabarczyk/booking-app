from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import TimeSlot, Category
from .serializers import TimeSlotSerializer, CategorySerializer

class AvailableTimeSlotsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        raw = request.GET.get('categories', '')
        try:
            cat_ids = [int(pk) for pk in raw.split(',') if pk.strip()]
        except ValueError:
            return Response(
                {"detail": "Invalid category IDs."},
                status=status.HTTP_400_BAD_REQUEST
            )

        qs = TimeSlot.objects.filter(
            category_id__in=cat_ids
        ).order_by('start')

        serializer = TimeSlotSerializer(qs, many=True)
        return Response(serializer.data)


class CategoryListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    