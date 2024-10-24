# myapp/views.py

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt  # Use if you're not handling CSRF tokens
def api_response(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name', 'User')  # Get the name or default to 'User'
        response_data = {'message': f'Hello, {name}!'}  # Create a greeting message
        return JsonResponse(response_data, status=200)

    return JsonResponse({'error': 'Invalid request'}, status=400)

def home(request):
    return HttpResponse("Welcome to the Django API!")
