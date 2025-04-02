'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, X, Users, List, Save, Info, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Separator } from "@/components/ui/separator"

interface Pokemon {
  pokemon_id: number
  name: string
  pokedex_number: number
  primary_type: string
  secondary_type: string | null
  base_hp: number
  base_attack: number
  base_defense: number
  base_special_attack: number
  base_special_defense: number
  base_speed: number
  total_stats: number
  previous_evolution: string | null
  next_evolution: string | null
  moves: string
}

// Extended Pokemon interface with additional details
interface PokemonDetails extends Omit<Pokemon, 'moves'> {
  description?: string
  stats?: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  evolutionChain?: string[]
  moves?: string[]
}

interface SavedTeam {
  name: string
  pokemon: Pokemon[]
  date: string
}

export default function PokemonTeamManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [pokedex, setPokedex] = useState<Pokemon[]>([])
  const [activeTab, setActiveTab] = useState<string>('pokedex')
  const [team, setTeam] = useState<Pokemon[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isWeaknessesOpen, setIsWeaknessesOpen] = useState(false)

  // Function to get team weaknesses
  const getTeamWeaknesses = (): Record<string, number> => {
    const typeWeaknesses: Record<string, string[]> = {
      'NORMAL': ['FIGHTING'],
      'FIRE': ['WATER', 'GROUND', 'ROCK'],
      'WATER': ['ELECTRIC', 'GRASS'],
      'ELECTRIC': ['GROUND'],
      'GRASS': ['FIRE', 'ICE', 'POISON', 'FLYING', 'BUG'],
      'ICE': ['FIRE', 'FIGHTING', 'ROCK', 'STEEL'],
      'FIGHTING': ['FLYING', 'PSYCHIC', 'FAIRY'],
      'POISON': ['GROUND', 'PSYCHIC'],
      'GROUND': ['WATER', 'GRASS', 'ICE'],
      'FLYING': ['ELECTRIC', 'ICE', 'ROCK'],
      'PSYCHIC': ['BUG', 'GHOST', 'DARK'],
      'BUG': ['FLYING', 'ROCK', 'FIRE'],
      'ROCK': ['WATER', 'GRASS', 'FIGHTING', 'GROUND', 'STEEL'],
      'GHOST': ['GHOST', 'DARK'],
      'DRAGON': ['ICE', 'DRAGON', 'FAIRY'],
      'DARK': ['FIGHTING', 'BUG', 'FAIRY'],
      'STEEL': ['FIRE', 'FIGHTING', 'GROUND'],
      'FAIRY': ['POISON', 'STEEL']
    };

    const weaknesses: Record<string, number> = {};
    
    team.forEach((pokemon: Pokemon) => {
      // Add primary type weaknesses
      const primaryType = pokemon.primary_type?.toUpperCase();
      if (primaryType && typeWeaknesses[primaryType]) {
        typeWeaknesses[primaryType].forEach(weakness => {
          weaknesses[weakness] = (weaknesses[weakness] || 0) + 1;
        });
      }
      
      // Add secondary type weaknesses if they exist
      const secondaryType = pokemon.secondary_type?.toUpperCase();
      if (secondaryType && typeWeaknesses[secondaryType]) {
        typeWeaknesses[secondaryType].forEach(weakness => {
          weaknesses[weakness] = (weaknesses[weakness] || 0) + 1;
        });
      }
    });

    // Sort weaknesses by count in descending order
    return Object.fromEntries(
      Object.entries(weaknesses).sort(([, a], [, b]) => b - a)
    );
  };

  // Fetch Pokémon data from backend
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/')
        const data = await response.json()
        setPokedex(data)
      } catch (error) {
        console.error('Error fetching Pokémon:', error)
        toast.error("Failed to load Pokémon data", {
          description: "Please check if the backend server is running."
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPokemon()
  }, [])

  // Get unique Pokémon types for the dropdown filter
  const uniqueTypes = [...new Set(pokedex.flatMap(pokemon =>
    [pokemon.primary_type, pokemon.secondary_type].filter((type): type is string => type !== null)
  ))]

  // Filter Pokémon based on search term and type filter
  const filteredPokemon = pokedex.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' ||
      pokemon.primary_type === typeFilter ||
      pokemon.secondary_type === typeFilter
    return matchesSearch && matchesType
  })

  // Show Pokémon details
  const showPokemonDetails = (pokemon: Pokemon) => {
    const details: PokemonDetails = {
      ...pokemon,
      description: `${pokemon.name} is a ${pokemon.primary_type}${pokemon.secondary_type ? `/${pokemon.secondary_type}` : ''} type Pokémon.`,
      stats: {
        hp: pokemon.base_hp,
        attack: pokemon.base_attack,
        defense: pokemon.base_defense,
        specialAttack: pokemon.base_special_attack,
        specialDefense: pokemon.base_special_defense,
        speed: pokemon.base_speed
      },
      evolutionChain: [
        pokemon.previous_evolution,
        pokemon.name,
        pokemon.next_evolution
      ].filter(Boolean) as string[],
      moves: pokemon.moves?.split(',').map(move => move.trim())
    }

    setSelectedPokemon(details)
    setIsDetailOpen(true)
  }

  // Load team and saved teams from localStorage on component mount
  useEffect(() => {
    const savedTeam = localStorage.getItem('pokemonTeam')
    if (savedTeam) {
      try {
        setTeam(JSON.parse(savedTeam))
      } catch (e) {
        console.error('Failed to load team from localStorage')
      }
    }

    const savedTeamsFromStorage = localStorage.getItem('savedPokemonTeams')
    if (savedTeamsFromStorage) {
      try {
        setSavedTeams(JSON.parse(savedTeamsFromStorage))
      } catch (e) {
        console.error('Failed to load saved teams from localStorage')
      }
    }
  }, [])

  // Save team to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokemonTeam', JSON.stringify(team))
  }, [team])

  // Save savedTeams to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('savedPokemonTeams', JSON.stringify(savedTeams))
  }, [savedTeams])

  // Add Pokémon to team (max 6)
  const addToTeam = (pokemon: Pokemon | PokemonDetails) => {
    if (team.length >= 6) {
      toast.error("Team is full", {
        description: "You can only have 6 Pokémon in your team. Remove one first."
      })
      return
    }

    if (team.some(p => p.pokemon_id === pokemon.pokemon_id)) {
      toast.error("Already in team", {
        description: `${pokemon.name} is already in your team.`
      })
      return
    }

    // Convert PokemonDetails to Pokemon if needed
    const pokemonToAdd: Pokemon = {
      ...pokemon,
      moves: Array.isArray(pokemon.moves) ? pokemon.moves.join(', ') : (pokemon.moves || '')
    }

    setTeam([...team, pokemonToAdd])
    toast.success("Added to team", {
      description: `${pokemon.name} was added to your team.`
    })
  }

  // Remove Pokémon from team
  const removeFromTeam = (pokemonId: number) => {
    const pokemonToRemove = team.find(p => p.pokemon_id === pokemonId)
    setTeam(team.filter(p => p.pokemon_id !== pokemonId))

    if (pokemonToRemove) {
      toast.info("Removed from team", {
        description: `${pokemonToRemove.name} was removed from your team.`
      })
    }
  }

  // Clear the entire team
  const clearTeam = () => {
    setTeam([])
    setIsDialogOpen(false)
    toast.info("Team cleared", {
      description: "Your team has been cleared."
    })
  }

  // Save the current team
  const saveTeam = () => {
    if (team.length === 0) {
      toast.error("Empty team", {
        description: "You can't save an empty team."
      })
      return
    }

    if (!teamName.trim()) {
      toast.error("Team name required", {
        description: "Please enter a name for your team."
      })
      return
    }

    // Check if a team with this name already exists
    const teamExists = savedTeams.some(t => t.name === teamName.trim())
    if (teamExists) {
      toast.error("Team name exists", {
        description: "A team with this name already exists. Please choose a different name."
      })
      return
    }

    const newSavedTeam: SavedTeam = {
      name: teamName.trim(),
      pokemon: [...team],
      date: new Date().toLocaleString()
    }

    setSavedTeams([...savedTeams, newSavedTeam])
    setIsSaveDialogOpen(false)
    setTeamName('')

    toast.success("Team saved", {
      description: `Your team "${newSavedTeam.name}" has been saved.`
    })
  }

  // Render individual Pokémon card
  const renderPokemonCard = (pokemon: Pokemon, inTeam: boolean = false) => (
    <Card
      key={pokemon.pokemon_id}
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => showPokemonDetails(pokemon)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>#{pokemon.pokedex_number.toString().padStart(3, '0')}</span>
              <span>{pokemon.name}</span>
            </CardTitle>
            <CardDescription className="mt-2">
              {pokemon.primary_type && (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
                  style={{
                    backgroundColor: getTypeColor(pokemon.primary_type),
                    color: ['Electric', 'Ice', 'Fairy', 'Normal'].includes(pokemon.primary_type) ? '#333' : 'white'
                  }}>
                  {pokemon.primary_type}
                </span>
              )}
              {pokemon.secondary_type && (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
                  style={{
                    backgroundColor: getTypeColor(pokemon.secondary_type),
                    color: ['Electric', 'Ice', 'Fairy', 'Normal'].includes(pokemon.secondary_type) ? '#333' : 'white'
                  }}>
                  {pokemon.secondary_type}
                </span>
              )}
            </CardDescription>
          </div>
          {/* Prevent detail opening when clicking buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              inTeam ? removeFromTeam(pokemon.pokemon_id) : addToTeam(pokemon);
            }}
          >
            {inTeam ? <X size={16} /> : <Plus size={16} />}
          </Button>
        </div>
      </CardHeader>
      <CardFooter className="pt-0 pb-3">
        <div className="w-full flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              showPokemonDetails(pokemon);
            }}
          >
            <Info size={14} />
            <span>View Details</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Pokémon Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6 rounded-lg">
          {selectedPokemon && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2 text-2xl">
                  <span>#{selectedPokemon.pokedex_number.toString().padStart(3, '0')}</span>
                  <span>{selectedPokemon.name}</span>
                </SheetTitle>
                <div className="flex gap-1 flex-wrap mb-2">
                  {selectedPokemon.primary_type && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: getTypeColor(selectedPokemon.primary_type),
                        color: ['Electric', 'Ice', 'Fairy', 'Normal'].includes(selectedPokemon.primary_type) ? '#333' : 'white'
                      }}>
                      {selectedPokemon.primary_type}
                    </span>
                  )}
                  {selectedPokemon.secondary_type && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: getTypeColor(selectedPokemon.secondary_type),
                        color: ['Electric', 'Ice', 'Fairy', 'Normal'].includes(selectedPokemon.secondary_type) ? '#333' : 'white'
                      }}>
                      {selectedPokemon.secondary_type}
                    </span>
                  )}
                </div>
              </SheetHeader>

              <div className="mt-6">
                <p className="text-gray-700">{selectedPokemon.description}</p>

                <div className="mt-6">
                  <h4 className="font-semibold text-lg mb-3">Base Stats</h4>
                  {selectedPokemon.stats && (
                    <div className="space-y-3">
                      {Object.entries(selectedPokemon.stats).map(([stat, value]) => {
                        const formattedStat = stat.replace(/([A-Z])/g, ' $1').trim()
                        const percentage = (value / 150) * 100 // Assuming max base stat is 150

                        return (
                          <div key={stat}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium capitalize">{formattedStat}</span>
                              <span className="text-sm font-medium">{value}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: getTypeColor(selectedPokemon.primary_type),
                                  opacity: 0.8
                                }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {selectedPokemon.evolutionChain && selectedPokemon.evolutionChain.length > 1 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-lg mb-3">Evolution Chain</h4>
                    <div className="flex items-center">
                      {selectedPokemon.evolutionChain.map((evo, index) => (
                        <div key={evo} className="flex items-center">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-1">
                              {evo.charAt(0)}
                            </div>
                            <p className="text-sm">{evo}</p>
                          </div>

                          {index < selectedPokemon.evolutionChain!.length - 1 && (
                            <div className="mx-2 text-gray-400">→</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Moves Section */}
                {selectedPokemon.moves && selectedPokemon.moves.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-lg mb-3">Available Moves</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPokemon.moves.map((move, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 rounded-md bg-gray-100 text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          {formatMoveName(move)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  {!team.some(p => p.pokemon_id === selectedPokemon.pokemon_id) ? (
                    <Button
                      onClick={() => {
                        addToTeam(selectedPokemon)
                        setIsDetailOpen(false)
                      }}
                      className="w-full"
                    >
                      Add to Team
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        removeFromTeam(selectedPokemon.pokemon_id)
                        setIsDetailOpen(false)
                      }}
                      className="w-full"
                    >
                      Remove from Team
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Pokémon Team Builder</h1>

          <TabsList>
            <TabsTrigger value="pokedex" className="flex items-center gap-2">
              <List size={16} />
              <span>Pokédex</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users size={16} />
              <span>My Team ({team.length}/6)</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <Separator className="mb-6" />

        {/* Pokédex Tab */}
        <TabsContent value="pokedex" className="space-y-6">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Counter */}
          <p className="text-sm text-gray-500">
            Showing {filteredPokemon.length} of {pokedex.length} Pokémon
          </p>

          {/* Pokémon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPokemon.map(pokemon => renderPokemonCard(pokemon))}
          </div>

          {/* No Results State */}
          {filteredPokemon.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium">No Pokémon Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Team ({team.length}/6)</h2>

              <div className="flex gap-2">
                {team.length > 0 && (
                  <>
                    {/* Save Team Dialog */}
                    <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Save size={16} />
                          <span>Save Team</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save your team</DialogTitle>
                          <DialogDescription>
                            Give your team a name to save this configuration for later use.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                          <Input
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Enter team name..."
                            className="w-full"
                          />
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
                          <Button onClick={saveTeam}>Save Team</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Clear Team Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">Clear Team</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Clear your team?</DialogTitle>
                          <DialogDescription>
                            This will remove all Pokémon from your current team. This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={clearTeam}>Clear Team</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>

            {team.length === 0 ? (
              <div className="text-center py-16 border rounded-lg">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium">Your team is empty</h3>
                <p className="text-gray-500 mt-2">Add Pokémon from the Pokédex tab</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('pokedex')}
                >
                  Browse Pokédex
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {team.map(pokemon => renderPokemonCard(pokemon, true))}

                  {/* Empty slots */}
                  {Array.from({ length: 6 - team.length }).map((_, index) => (
                    <Card key={`empty-${index}`} className="border-dashed overflow-hidden">
                      <CardContent className="py-8 flex flex-col items-center justify-center text-gray-400">
                        <Plus size={24} className="mb-2" />
                        <p>Empty Slot</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Team Stats Graph */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-xl font-bold mb-4">Team Average Stats</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'base_hp', label: 'HP' },
                      { key: 'base_attack', label: 'Attack' },
                      { key: 'base_defense', label: 'Defense' },
                      { key: 'base_special_attack', label: 'Special Attack' },
                      { key: 'base_special_defense', label: 'Special Defense' },
                      { key: 'base_speed', label: 'Speed' }
                    ].map(({ key, label }) => {
                      const avgStat = Math.round(
                        team.reduce((sum, pokemon) => {
                          const value = pokemon[key as keyof Pokemon];
                          return sum + (typeof value === 'number' ? value : 0);
                        }, 0) / team.length
                      );
                      const percentage = (avgStat / 150) * 100;

                      return (
                        <div key={key}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{label}</span>
                            <span className="text-sm font-medium">{avgStat}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: '#4F46E5',
                                opacity: 0.8
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Team Weaknesses - Collapsible */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsWeaknessesOpen(!isWeaknessesOpen)}>
                      <h3 className="text-xl font-bold">Team Weaknesses</h3>
                      <ChevronDown className={`h-5 w-5 transform transition-transform ${isWeaknessesOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {isWeaknessesOpen && (
                    <div className="px-6 pb-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(getTeamWeaknesses()).map(([type, count]) => (
                          <div
                            key={type}
                            className="flex items-center justify-between p-2 rounded-md"
                            style={{
                              backgroundColor: getTypeColor(type),
                              color: ['Electric', 'Ice', 'Fairy', 'Normal'].includes(type) ? '#333' : 'white'
                            }}
                          >
                            <span className="font-medium">{type}</span>
                            <span className="text-sm">{count}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Saved Teams Section */}
            {savedTeams.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Saved Teams</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedTeams.map((savedTeam, index) => (
                    <Card key={`saved-${index}`} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{savedTeam.name}</CardTitle>
                            <CardDescription>
                              Saved on {savedTeam.date}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setTeam(savedTeam.pokemon)
                                toast.success("Team loaded", {
                                  description: `Team "${savedTeam.name}" has been loaded.`
                                })
                              }}
                            >
                              Load
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                >
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Team</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete "{savedTeam.name}"? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline">Cancel</Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      setSavedTeams(savedTeams.filter(t => t.name !== savedTeam.name))
                                      toast.success("Team deleted", {
                                        description: `Team "${savedTeam.name}" has been deleted.`
                                      })
                                    }}
                                  >
                                    Delete Team
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {savedTeam.pokemon.map(pokemon => (
                            <div
                              key={pokemon.pokemon_id}
                              className="text-xs px-2 py-1 rounded bg-gray-100 cursor-pointer"
                              title={pokemon.name}
                              onClick={() => showPokemonDetails(pokemon)}
                            >
                              {pokemon.name}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Pokémon data...</p>
        </div>
      )}
    </div>
  )
}

// Function to get background color based on Pokémon type
function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    'NORMAL': '#A8A77A',
    'FIRE': '#EE8130',
    'WATER': '#6390F0',
    'ELECTRIC': '#F7D02C',
    'GRASS': '#7AC74C',
    'ICE': '#96D9D6',
    'FIGHTING': '#C22E28',
    'POISON': '#A33EA1',
    'GROUND': '#E2BF65',
    'FLYING': '#A98FF3',
    'PSYCHIC': '#F95587',
    'BUG': '#A6B91A',
    'ROCK': '#B6A136',
    'GHOST': '#735797',
    'DRAGON': '#6F35FC',
    'DARK': '#705746',
    'STEEL': '#B7B7CE',
    'FAIRY': '#D685AD'
  }

  return typeColors[type.toUpperCase()] || '#777777'
}

// Function to format move names
function formatMoveName(move: string): string {
  return move
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}