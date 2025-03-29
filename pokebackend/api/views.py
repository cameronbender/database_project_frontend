from django.shortcuts import render

from django.http import JsonResponse

def sample_data(request):
    return JsonResponse({"message": "Hello from Django!"})


