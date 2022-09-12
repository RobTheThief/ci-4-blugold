"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from blugold import views

urlpatterns = [
    path('admin/', admin.site.urls),      
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('profile/', views.ProfileView.as_view()),
    path('register/', views.CreateUserView.as_view(), name='auth_register'),
    path('places-api-location-request/<str:name>/<str:location>/', views.PlacesApiLocationRequest.as_view()),
    path('places-api-area-request/<str:area>/', views.PlacesApiAreaRequest.as_view()),
    path('api/', include('blugold.urls')),
    re_path(r'', views.catchall),
]