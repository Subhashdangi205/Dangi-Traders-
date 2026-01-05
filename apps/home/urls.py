from django.urls import path
from apps.home import views  # Full path use karna zaroori hai

urlpatterns = [
    path('', views.home, name='home')
]