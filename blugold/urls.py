"""These `urlpatterns` list routes URLs to views for the CRUD operations
on the database """

from django.urls import include, path
from .views import StationCreate, \
    StationList, StationDetail, StationUpdate, StationDelete


urlpatterns = [
    path('create/', StationCreate.as_view(), name='create-fulesprices'),
    path('', StationList.as_view()),
    path('<int:pk>/', StationDetail.as_view(), name='retrieve-station'),
    path('update/<int:pk>/', StationUpdate.as_view(), name='update-station'),
    path('delete/<int:pk>/', StationDelete.as_view(), name='delete-station'),
]
