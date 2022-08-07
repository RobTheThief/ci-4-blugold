from django.urls import include, path
from .views import StationCreate, StationList, StationDetail, StationUpdate, StationDelete


urlpatterns = [
    path('create/', StationCreate.as_view(), name='create-fulesprices'),
    path('', StationList.as_view()),
    path('<int:id>/', StationDetail.as_view(), name='retrieve-station'),
    path('update/<int:id>/', StationUpdate.as_view(), name='update-station'),
    path('delete/<int:id>/', StationDelete.as_view(), name='delete-station')
]