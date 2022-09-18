""" Serializers for fields in supporting CRUD operations to database,
validating input for authentication/registration/login and creating
users """

from rest_framework import serializers
from .models import Station
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password


class StationSerializer(serializers.ModelSerializer):
    """ This model serializer is used for the station API views """
    class Meta:
        model = Station
        fields = ['id', 'station', 'petrol', 'diesel',
                  'updated', 'google_id', 'updated_by']


class LoginSerializer(serializers.Serializer):
    """ This serializer defines two fields for authentication:
    username and password. It will try to authenticate the
    user when validated. """
    username = serializers.CharField(
        label="Username",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        """ Takes username and password from request
        to authenticate using the Django authentication framework.
        If the user is valid, put it in the serializer's validated_data
        to be used in the view. If we don't have a registered user of
        missing username or password, raise a ValidationError. """
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """ Used for the ProfileView view to create an
    object with user information"""
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
        ]


class CreateUserSerializer(serializers.ModelSerializer):
    """ Sets the user field attributes, validates the input,
    creates and saves user object """
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2',
                  'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        """ Validates that password fields are the same """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        """ POST request to register endpoint which
        saves user object """
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
