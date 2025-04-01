'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, X, Users, List, Save, Info } from "lucide-react"
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
  name: string
  type: string[]
  id: number
}

// Extended Pokemon interface with additional details
interface PokemonDetails extends Pokemon {
  description?: string
  height?: number
  weight?: number
  abilities?: string[]
  stats?: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  evolutionChain?: string[]
}

interface SavedTeam {
  name: string
  pokemon: Pokemon[]
  date: string
}

export default function PokemonTeamManager({ initialPokedex }: { initialPokedex: Pokemon[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [pokedex, setPokedex] = useState<Pokemon[]>(initialPokedex)
  const [activeTab, setActiveTab] = useState<string>('pokedex')
  const [team, setTeam] = useState<Pokemon[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Define an interface for your API response data
  interface ApiData {
    message: string;
    // Add other properties your API returns here
  }

  // Type the data state correctly
  const [data, setData] = useState<ApiData | null>(null);

  // Get unique Pokémon types for the dropdown filter
  const uniqueTypes = [...new Set(initialPokedex.flatMap(pokemon => pokemon.type))]

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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/data/")
      .then((response) => response.json())
      .then((data: ApiData) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Filter Pokémon based on search term and type filter
  const filteredPokemon = pokedex.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || pokemon.type.includes(typeFilter)
    return matchesSearch && matchesType
  })

  // Add Pokémon to team (max 6)
  const addToTeam = (pokemon: Pokemon) => {
    if (team.length >= 6) {
      toast.error("Team is full", {
        description: "You can only have 6 Pokémon in your team. Remove one first."
      })
      return
    }

    if (team.some(p => p.id === pokemon.id)) {
      toast.error("Already in team", {
        description: `${pokemon.name} is already in your team.`
      })
      return
    }

    setTeam([...team, pokemon])
    toast.success("Added to team", {
      description: `${pokemon.name} was added to your team.`
    })
  }

  // Remove Pokémon from team
  const removeFromTeam = (pokemonId: number) => {
    const pokemonToRemove = team.find(p => p.id === pokemonId)
    setTeam(team.filter(p => p.id !== pokemonId))

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

  // Show Pokémon details
  const showPokemonDetails = (pokemon: Pokemon) => {
    // Mock fetching additional details here
    // In a real app, you would fetch this from your API
    const mockDetails: PokemonDetails = {
      ...pokemon,
      description: `${pokemon.name} is a ${pokemon.type.join('/')} type Pokémon introduced in Generation I.`,
      height: Math.random() * 20, // Random height between 0-20
      weight: Math.random() * 1000, // Random weight between 0-1000
      abilities: ["Ability 1", "Ability 2", "Hidden Ability"],
      stats: {
        hp: Math.floor(Math.random() * 100) + 50,
        attack: Math.floor(Math.random() * 100) + 50,
        defense: Math.floor(Math.random() * 100) + 50,
        specialAttack: Math.floor(Math.random() * 100) + 50,
        specialDefense: Math.floor(Math.random() * 100) + 50,
        speed: Math.floor(Math.random() * 100) + 50
      },
      evolutionChain: pokemon.id % 3 === 1 ? [pokemon.name, `${pokemon.name} 2`, `${pokemon.name} 3`] : [pokemon.name]
    }

    setSelectedPokemon(mockDetails)
    setIsDetailOpen(true)
  }

  // Render individual Pokémon card
  const renderPokemonCard = (pokemon: Pokemon, inTeam: boolean = false) => (
    <Card
      key={pokemon.id}
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => showPokemonDetails(pokemon)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>#{pokemon.id.toString().padStart(3, '0')}</span>
              <span>{pokemon.name}</span>
            </CardTitle>
            <CardDescription>
              {pokemon.type.map((type) => (
                <span key={type} className="inline-block px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
                  style={{
                    backgroundColor: getTypeColor(type),
                    color: ['Electric', 'Ice', 'Fairy', 'Normal'].includes(type) ? '#333' : 'white'
                  }}>
                  {type}
                </span>
              ))}
            </CardDescription>
          </div>
          {/* Prevent detail opening when clicking buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              inTeam ? removeFromTeam(pokemon.id) : addToTeam(pokemon);
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
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedPokemon && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2 text-2xl">
                  <span>#{selectedPokemon.id.toString().padStart(3, '0')}</span>
                  <span>{selectedPokemon.name}</span>
                </SheetTitle>
                <div className="flex gap-1 flex-wrap mb-2">
                  {selectedPokemon.type.map((type) => (
                    <span key={type} className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: getTypeColor(type),
                        color: ['Electric', 'Ice', 'Fairy', 'Normal'].includes(type) ? '#333' : 'white'
                      }}>
                      {type}
                    </span>
                  ))}
                </div>
              </SheetHeader>

              <div className="mt-6">
                <p className="text-gray-700">{selectedPokemon.description}</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="border rounded-md p-3">
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Height</h4>
                    <p>{selectedPokemon.height?.toFixed(1)} m</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Weight</h4>
                    <p>{selectedPokemon.weight?.toFixed(1)} kg</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-lg mb-2">Abilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPokemon.abilities?.map((ability, index) => (
                      <span
                        key={ability}
                        className={`px-3 py-1 rounded-full text-sm ${
                          index === selectedPokemon.abilities!.length - 1 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>

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
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
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

                <div className="mt-8 flex justify-between">
                  {!team.some(p => p.id === selectedPokemon.id) ? (
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
                        removeFromTeam(selectedPokemon.id)
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
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {savedTeam.pokemon.map(pokemon => (
                            <div
                              key={pokemon.id}
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
    </div>
  )
}

// Function to get background color based on Pokémon type
function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    Normal: '#A8A77A',
    Fire: '#EE8130',
    Water: '#6390F0',
    Electric: '#F7D02C',
    Grass: '#7AC74C',
    Ice: '#96D9D6',
    Fighting: '#C22E28',
    Poison: '#A33EA1',
    Ground: '#E2BF65',
    Flying: '#A98FF3',
    Psychic: '#F95587',
    Bug: '#A6B91A',
    Rock: '#B6A136',
    Ghost: '#735797',
    Dragon: '#6F35FC',
    Dark: '#705746',
    Steel: '#B7B7CE',
    Fairy: '#D685AD'
  }

  return typeColors[type] || '#777777'
}

function setData(data: any): any {
  throw new Error('Function not implemented.')
}