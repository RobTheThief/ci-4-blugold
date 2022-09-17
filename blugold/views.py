from django.shortcuts import render
from rest_framework import viewsets, generics
from django.views import View
from django.http import HttpResponse, HttpResponseNotFound
import os
from .serializers import StationSerializer, CreateUserSerializer
from .models import Station
from . import serializers
from rest_framework import permissions
from rest_framework import authentication
from rest_framework import views
from rest_framework.response import Response
from django.contrib.auth import login, logout
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from braces.views import CsrfExemptMixin
from django.contrib.auth.models import User
import dotenv
import requests
import json


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


class StationCreate(CsrfExemptMixin, generics.CreateAPIView):
    # API endpoint that allows creation of a new station
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class StationList(CsrfExemptMixin, generics.ListAPIView):
    # API endpoint that allows station to be viewed.
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


class StationDetail(generics.RetrieveAPIView):
    # API endpoint that returns a single station by id.
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


class StationUpdate(CsrfExemptMixin, generics.RetrieveUpdateAPIView):
    # API endpoint that allows a Station record to be updated.
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StationSerializer
    queryset = Station.objects.all()


class StationDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a Station record to be deleted.
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class LoginView(CsrfExemptMixin, views.APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, format=None):
        serializer = serializers.LoginSerializer(data=self.request.data,
                                                 context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response(None, status=status.HTTP_202_ACCEPTED)


class LogoutView(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, format=None):
        logout(request)
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class ProfileView(generics.RetrieveAPIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return self.request.user


class CreateUserView(CsrfExemptMixin, generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer


class PlacesApiLocationRequest(CsrfExemptMixin, views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, name, location):
        response = {}
        payload = {'location': location, 'radius': 3000, 'types': 'gas_station convenience_store store supermarket atm cafe car_repair car_wash',
                   'name': 'gas station', 'key': str(os.getenv('GOOGLE_API_KEY'))}
        r = requests.get(
            'https://maps.googleapis.com/maps/api/place/nearbysearch/json', payload)
        r_status = r.status_code
        if r_status == 200:
            json_res = r.text
            data = json.loads(json_res)
            response['status'] = 200
            response['message'] = 'success'
        else:
            response['status'] = r.status_code
            response['message'] = 'error'
        return Response(data)


class PlacesApiAreaRequest (CsrfExemptMixin, views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, area):
        response = {}
        payload = {'input': area, 'inputtype': 'textquery', 'fields': 'geometry',
                   'key': str(os.getenv('GOOGLE_API_KEY'))}
        r = requests.get(
            'https://maps.googleapis.com/maps/api/place/findplacefromtext/json', payload)

        r_status = r.status_code
        if r_status == 200:
            json_res = r.text
            data = json.loads(json_res)
            response['status'] = 200
            response['message'] = 'success'
        else:
            response['status'] = r.status_code
            response['message'] = 'error'
        return Response(data)
