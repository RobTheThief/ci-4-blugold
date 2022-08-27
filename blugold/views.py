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

import urllib.request
from django.conf import settings
from django.http import HttpResponse
from django.template import engines
from django.views.generic import TemplateView
from rest_framework.permissions import IsAuthenticated
import requests
import json


def catchall_dev(request, upstream='http://localhost:3000'):
    upstream_url = upstream + request.path
    with urllib.request.urlopen(upstream_url) as response:
        content_type = response.headers.get('Content-Type')

        if content_type == 'text/html; charset=UTF-8':
            response_text = response.read().decode()
            content = engines['django'].from_string(response_text).render()
        else:
            content = response.read()

        return HttpResponse(
            content,
            content_type=content_type,
            status=response.status,
            reason=response.reason,
        )


catchall_prod = TemplateView.as_view(template_name='index.html')

catchall = catchall_dev if settings.DEBUG else catchall_prod


class BlugoldView(viewsets.ModelViewSet):
    serializer_class = StationSerializer
    queryset = Station.objects.all()


class Assets(View):
    def get(self, _request, filename):
        path = os.path.join(os.path.dirname(__file__), 'public', filename)

        if os.path.isfile(path):
            with open(path, 'rb') as file:
                return HttpResponse(file.read(), content_type='application/javascript')
        else:
            return HttpResponseNotFound()


class StationCreate(generics.CreateAPIView):
    # API endpoint that allows creation of a new station
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    #authentication_classes = [authentication.SessionAuthentication]
    #permission_classes = [permissions.DjangoModelPermissions]
    authentication_classes = []
    permission_classes = (permissions.AllowAny,)

class StationList(generics.ListAPIView):
    # API endpoint that allows station to be viewed.
    #permission_classes = (permissions.AllowAny,)
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    authentication_classes = []
    permission_classes = (permissions.AllowAny,)

class StationDetail(generics.RetrieveAPIView):
    # API endpoint that returns a single station by id.
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    authentication_classes = []
    permission_classes = (permissions.AllowAny,)

class StationUpdate(generics.RetrieveUpdateAPIView):
    # API endpoint that allows a Station record to be updated.
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    authentication_classes = []
    permission_classes = (permissions.AllowAny,)

class StationDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a Station record to be deleted.
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    authentication_classes = []
    permission_classes = (permissions.AllowAny,)

class LoginView(CsrfExemptMixin, views.APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = (permissions.AllowAny,)
    #authentication_classes = [authentication.SessionAuthentication]
    authentication_classes = []
    
    def post(self, request, format=None):
        serializer = serializers.LoginSerializer(data=self.request.data,
                                                 context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        login(request, user)
        return Response(None, status=status.HTTP_202_ACCEPTED)


class LogoutView(CsrfExemptMixin, views.APIView):
    #permission_classes = [IsAuthenticated]
    #authentication_classes = [
        #authentication.SessionAuthentication, authentication.BasicAuthentication]
    permission_classes = (permissions.AllowAny,)
    authentication_classes = []

    def get(self, request, format=None):
        logout(request)
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class ProfileView(generics.RetrieveAPIView):
    serializer_class = serializers.UserSerializer
    #permission_classes = (permissions.IsAuthenticated,)
    #authentication_classes = [authentication.SessionAuthentication]
    authentication_classes = []
    permission_classes = (permissions.AllowAny,)
    def get_object(self):
        return self.request.user


class CreateUserView(CsrfExemptMixin, generics.CreateAPIView):
    authentication_classes = []
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = CreateUserSerializer


class PlacesApiLocationRequest(CsrfExemptMixin, views.APIView):
    authentication_classes = []
    permission_classes = (permissions.AllowAny,)

    def get(self, request, name, radius, location, format=None):
        response = {}
        print(location, radius)
        payload = {'location': location, 'radius': radius, 'types': 'gas_station',
                   'name': name, 'key': str(os.getenv('GOOGLE_API_KEY'))}
        print(payload)
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
    authentication_classes = []
    permission_classes = (permissions.AllowAny,) 

    def get(self, request, area):
        response = {}
        print(area)
       
        payload = {'input': area, 'inputtype': 'textquery', 'fields': 'geometry',
                'key': str(os.getenv('GOOGLE_API_KEY'))}
        r = requests.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', payload)

        print(payload)
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

