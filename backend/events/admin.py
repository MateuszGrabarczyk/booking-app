from django.contrib import admin
from .models import Category, TimeSlot, Booking

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('category', 'start', 'end')
    list_filter = ('category',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('slot', 'user', 'signed_up_at')
    list_filter = ('slot__category',)