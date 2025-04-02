from django.db import models


class PokemonFullInfo(models.Model):
    pokemon_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    pokedex_number = models.IntegerField()
    evolution = models.IntegerField()
    primary_type = models.CharField(max_length=50)
    secondary_type = models.CharField(max_length=50, null=True, blank=True)
    base_hp = models.IntegerField()
    base_attack = models.IntegerField()
    base_defense = models.IntegerField()
    base_special_attack = models.IntegerField()
    base_special_defense = models.IntegerField()
    base_speed = models.IntegerField()
    total_stats = models.IntegerField()
    previous_evolution = models.CharField(max_length=50, null=True, blank=True)
    next_evolution = models.CharField(max_length=50, null=True, blank=True)
    moves = models.TextField()

    class Meta:
        managed = False
        db_table = 'view_pokemon_full_info'


class TeamPokemonMoves(models.Model):
    team_pokemon_id = models.IntegerField(primary_key=True)
    team_name = models.CharField(max_length=50)
    pokemon_name = models.CharField(max_length=50)
    level = models.IntegerField()
    move1 = models.CharField(max_length=50, null=True, blank=True)
    move2 = models.CharField(max_length=50, null=True, blank=True)
    move3 = models.CharField(max_length=50, null=True, blank=True)
    move4 = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'view_team_pokemon_moves'


class PokemonEvolutions(models.Model):
    pokemon_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    evolution = models.IntegerField()
    previous_evolution = models.CharField(max_length=50, null=True, blank=True)
    next_evolution = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'view_pokemon_evolutions'


class RaidBossDetails(models.Model):
    raid_boss_id = models.IntegerField(primary_key=True)
    pokemon_name = models.CharField(max_length=50)
    raid_level = models.IntegerField()
    cp = models.IntegerField()
    appearance_date = models.DateField(null=True, blank=True)
    move_set = models.TextField()

    class Meta:
        managed = False
        db_table = 'view_raid_boss_details'


class PokemonGoInfo(models.Model):
    pokemon_go_stats_id = models.IntegerField(primary_key=True)
    pokemon_name = models.CharField(max_length=50)
    cp = models.IntegerField()
    hp = models.IntegerField()
    attack = models.IntegerField()
    defense = models.IntegerField()
    stamina = models.IntegerField()
    fast_move = models.CharField(max_length=50, null=True, blank=True)
    charged_move = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'view_pokemon_go_info'

class TeamOverview(models.Model):
    team_id = models.IntegerField(primary_key=True)
    team_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50)
    team_members = models.TextField()

    class Meta:
        managed = False
        db_table = 'view_team_overview'