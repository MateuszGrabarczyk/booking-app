from rest_framework import serializers
from .models import TimeSlot, Category, Booking


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class TimeSlotSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    is_taken = serializers.SerializerMethodField()
    is_booked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = TimeSlot
        fields = ['id', 'category', 'start', 'end', 'is_taken', 'is_booked_by_user']

    def get_is_taken(self, obj):
        return hasattr(obj, 'booking') and obj.booking is not None
    
    def get_is_booked_by_user(self, slot):
        user = self.context['request'].user
        return hasattr(slot, 'booking') and slot.booking.user == user


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'slot', 'signed_up_at']
        read_only_fields = ['id', 'signed_up_at']