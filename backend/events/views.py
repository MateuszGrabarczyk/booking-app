from django.utils.dateparse import parse_datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import TimeSlot, Category, Booking
from .serializers import TimeSlotSerializer, CategorySerializer, BookingSerializer

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

        start_str = request.GET.get('start_date')
        end_str = request.GET.get('end_date')
        if not start_str or not end_str:
            return Response(
                {"detail": "start_date and end_date are required in YYYY-MM-DD or ISO format."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            start_dt = parse_datetime(start_str)
            end_dt = parse_datetime(end_str)
            if start_dt is None or end_dt is None:
                raise ValueError
        except ValueError:
            return Response(
                {"detail": "Invalid date format. Use ISO‑8601 or YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        qs = TimeSlot.objects.filter(
            category_id__in=cat_ids,
            start__gte=start_dt,
            end__lte=end_dt,
        ).order_by('start')

        serializer = TimeSlotSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)


class CategoryListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    


class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        slot_id = request.data.get('slot_id')
        if slot_id is None:
            return Response(
                {"detail": "Missing `slot_id` in request body."},
                status=status.HTTP_400_BAD_REQUEST
            )

        slot = get_object_or_404(TimeSlot, pk=slot_id)

        if hasattr(slot, 'booking'):
            return Response(
                {"detail": "This time slot is already taken."},
                status=status.HTTP_409_CONFLICT
            )

        booking = Booking.objects.create(user=request.user, slot=slot)
        serializer = BookingSerializer(booking, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        slot_id = request.data.get('slot_id')
        if slot_id is None:
            return Response(
                {"detail": "Missing `slot_id` in request body."},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking = get_object_or_404(
            Booking,
            user=request.user,
            slot_id=slot_id
        )
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)