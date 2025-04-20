from rest_framework import serializers
from .models import TimeSlot, Category, Booking


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class TimeSlotSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    is_taken = serializers.SerializerMethodField()

    class Meta:
        model = TimeSlot
        fields = ['id', 'category', 'start', 'end', 'is_taken']

    def get_is_taken(self, obj):
        return hasattr(obj, 'booking') and obj.booking is not None


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'slot', 'signed_up_at']
        read_only_fields = ['id', 'signed_up_at']