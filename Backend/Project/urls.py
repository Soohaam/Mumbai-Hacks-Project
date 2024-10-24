# myapp/urls.py

from django.urls import path
from .views import api_response

urlpatterns = [
    path('api/response/', api_response, name='api_response'),
]
