from django.urls import path
from .views import AvailableTimeSlotsView, CategoryListView, BookingView

urlpatterns = [
    path('timeslots/available/', AvailableTimeSlotsView.as_view(), name='available-timeslots'),
    path('timeslots/booking/', BookingView.as_view(),  name='timeslot-booking'),
    path('timeslots/categories/', CategoryListView.as_view(), name='category-list'),
]