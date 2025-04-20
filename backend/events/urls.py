from django.urls import path
from .views import AvailableTimeSlotsView

urlpatterns = [
    path('timeslots/available/', AvailableTimeSlotsView.as_view(), name='available-timeslots'),
]