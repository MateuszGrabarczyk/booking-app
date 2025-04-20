from django.urls import path
from .views import AvailableTimeSlotsView, CategoryListView

urlpatterns = [
    path('timeslots/available/', AvailableTimeSlotsView.as_view(), name='available-timeslots'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
]