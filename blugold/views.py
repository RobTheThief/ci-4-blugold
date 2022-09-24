""" Views for the blugold app to make CRUD operations on the
database, login, regester, logout user, get profile and to make
external API requests to Google places API """

from django.shortcuts import render
from rest_framework import viewsets, generics
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


class StationCreate(CsrfExemptMixin, generics.CreateAPIView):
    """ Endpoint that allows creation of a new station """
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class StationList(CsrfExemptMixin, generics.ListAPIView):
    """ Endpoint that allows station to be viewed. """
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


class StationDetail(generics.RetrieveAPIView):
    """ Endpoint that returns a single station by id. """
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


class StationUpdate(CsrfExemptMixin, generics.RetrieveUpdateAPIView):
    """ Endpoint that allows a Station record to be updated if a
    user is logged in. """
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StationSerializer
    queryset = Station.objects.all()


class StationDelete(generics.RetrieveDestroyAPIView):
    """ Endpoint that allows a Station record to be deleted if a
    user is logged in. """
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class LoginView(CsrfExemptMixin, views.APIView):
    """ Endpoint that logs in a regestered user """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, format=None):
        """ Makes a POST request to the backend and returns the
        response status """
        serializer = serializers.LoginSerializer(
            data=self.request.data,
            context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response(None, status=status.HTTP_202_ACCEPTED)


class LogoutView(views.APIView):
    """ Endpoint that logs out a user """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, format=None):
        """ Makes a POST request to the backend and
        returns the status response """
        logout(request)
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class ProfileView(generics.RetrieveAPIView):
    """ Endpoint that gets profile information on a logged in user
    if a user is logged in"""
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.UserSerializer

    def get_object(self):
        """ Makes a GET request to the backend and
        returns the reponse object """
        return self.request.user


class CreateUserView(CsrfExemptMixin, generics.CreateAPIView):
    """ Endpoint that registeres a new user """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer


class PlacesApiLocationRequest(CsrfExemptMixin, views.APIView):
    """ Endpoint that acts as middleware to make a request
    to the google places API to find stations in 3km radius of
    given coordinates"""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, name, location):
        """ Makes a GET request to the google places api and
        returns the response as json """
        response = {}
        payload = {
            'location': location,
            'radius': 3000, 'types': 'gas_station convenience_store store'
            'supermarket atm cafe car_repair car_wash',
            'name': 'gas station',
            'key': str(os.getenv('GOOGLE_API_KEY'))}
        r = requests.get(
            'https://maps.googleapis.com/maps/'
            'api/place/nearbysearch/json', payload)
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
    """ Endpoint that acts as middleware to make a request
    to the google places API to find coordinates of an address
    or place name"""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, area):
        """ Makes a GET request to the google places api and
        returns the response as json """
        response = {}
        payload = {
            'input': area,
            'inputtype': 'textquery',
            'fields': 'geometry',
            'key': str(os.getenv('GOOGLE_API_KEY'))}
        r = requests.get(
            'https://maps.googleapis.com/maps/api/'
            'place/findplacefromtext/json', payload)

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
