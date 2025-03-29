from django.urls import path
from .views import sample_data

urlpatterns = [
    path("data/", sample_data),
]