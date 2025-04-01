from django.urls import path
from .views import (
    PokemonFullInfoList, PokemonFullInfoDetail,
    TeamPokemonMovesList, PokemonEvolutionsList, RaidBossDetailsList
)

urlpatterns = [
    path('pokemon/', PokemonFullInfoList.as_view(), name='pokemon-full-info-list'),
    path('pokemon/<int:pokemon_id>/', PokemonFullInfoDetail.as_view(), name='pokemon-full-info-detail'),
    path('team-pokemon-moves/', TeamPokemonMovesList.as_view(), name='team-pokemon-moves-list'),
    path('pokemon-evolutions/', PokemonEvolutionsList.as_view(), name='pokemon-evolutions-list'),
    path('raid-boss-details/', RaidBossDetailsList.as_view(), name='raid-boss-details-list'),
]