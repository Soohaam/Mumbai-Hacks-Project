# myproject/urls.py

from django.contrib import admin
from django.urls import include, path
from Project.views import home
from Project.views import api_response

urlpatterns = [
    path('admin/', admin.site.urls),
     path('', home, name='home'),
     path('api/response/', api_response, name='api_response'), # Include your app's URLs
]
