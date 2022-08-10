from django.shortcuts import render
from rest_framework import viewsets, generics
from django.views import View
from django.http import HttpResponse, HttpResponseNotFound
import os       
from .serializers import StationSerializer     
from .models import Station                     

class BlugoldView(viewsets.ModelViewSet):
    serializer_class = StationSerializer          
    queryset = Station.objects.all()

class Assets(View):
    def get(self, _request, filename):
        path = os.path.join(os.path.dirname(__file__), 'static', filename)

        if os.path.isfile(path):
            with open(path, 'rb') as file:
                return HttpResponse(file.read(), content_type='application/javascript')
        else:
            return HttpResponseNotFound()

class StationCreate(generics.CreateAPIView):
    # API endpoint that allows creation of a new station
    serializer_class = StationSerializer
    queryset = Station.objects.all(),

class StationList(generics.ListAPIView):
    # API endpoint that allows station to be viewed.
    serializer_class = StationSerializer
    queryset = Station.objects.all()

class StationDetail(generics.RetrieveAPIView):
    # API endpoint that returns a single station by id.
    serializer_class = StationSerializer
    queryset = Station.objects.all()

class StationUpdate(generics.RetrieveUpdateAPIView):
    # API endpoint that allows a Station record to be updated.
    queryset = Station.objects.all()
    serializer_class = StationSerializer

class StationDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a Station record to be deleted.
    serializer_class = StationSerializer
    queryset = Station.objects.all()