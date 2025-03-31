from rest_framework import serializers
from .models import PokemonFullInfo, TeamPokemonMoves, PokemonEvolutions, RaidBossDetails

class PokemonFullInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PokemonFullInfo
        fields = '__all__'

class TeamPokemonMovesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamPokemonMoves
        fields = '__all__'

class PokemonEvolutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PokemonEvolutions
        fields = '__all__'

class RaidBossDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaidBossDetails
        fields = '__all__'