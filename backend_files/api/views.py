from rest_framework import generics
from .models import PokemonFullInfo, TeamPokemonMoves, PokemonEvolutions, RaidBossDetails
from .serializers import (
    PokemonFullInfoSerializer,
    TeamPokemonMovesSerializer,
    PokemonEvolutionsSerializer,
    RaidBossDetailsSerializer
)

# List all Pokémon (using the full info view)
class PokemonFullInfoList(generics.ListAPIView):
    queryset = PokemonFullInfo.objects.all()
    serializer_class = PokemonFullInfoSerializer

# Retrieve details for a specific Pokémon by pokemon_id
class PokemonFullInfoDetail(generics.RetrieveAPIView):
    queryset = PokemonFullInfo.objects.all()
    serializer_class = PokemonFullInfoSerializer
    lookup_field = 'pokemon_id'

# List team Pokémon moves
class TeamPokemonMovesList(generics.ListAPIView):
    queryset = TeamPokemonMoves.objects.all()
    serializer_class = TeamPokemonMovesSerializer

# List Pokémon evolutions
class PokemonEvolutionsList(generics.ListAPIView):
    queryset = PokemonEvolutions.objects.all()
    serializer_class = PokemonEvolutionsSerializer

# List raid boss details
class RaidBossDetailsList(generics.ListAPIView):
    queryset = RaidBossDetails.objects.all()
    serializer_class = RaidBossDetailsSerializer


