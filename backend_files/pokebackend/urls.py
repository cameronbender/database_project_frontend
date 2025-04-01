"""
URL configuration for backend_files project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path, include
from django.http import JsonResponse

from pokebackend.api.models import PokemonFullInfo
from pokebackend.api.serializers import PokemonFullInfoSerializer

def home(request):
    qs = PokemonFullInfo.objects.all()
    serializer = PokemonFullInfoSerializer(qs, many=True)
    return JsonResponse(serializer.data, safe=False)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('pokebackend.api.urls')),
    path("", home),  # Root URL now returns all Pokémon info
]