from django.urls import path
from .views import AvailableTimeSlotsView, CategoryListView, BookingCreateView

urlpatterns = [
    path('timeslots/available/', AvailableTimeSlotsView.as_view(), name='available-timeslots'),
    path('timeslots/book/',     BookingCreateView.as_view(),  name='book-timeslot'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
]