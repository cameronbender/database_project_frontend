'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, X, Users, List } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
} from "@/components/ui/dialog"

import { Separator } from "@/components/ui/separator"

interface Pokemon {
  name: string
  type: string[]
  id: number
}

export default function PokemonTeamManager({ initialPokedex }: { initialPokedex: Pokemon[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [pokedex, setPokedex] = useState<Pokemon[]>(initialPokedex)
  const [activeTab, setActiveTab] = useState<string>('pokedex')
  const [team, setTeam] = useState<Pokemon[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Get unique Pokémon types for the dropdown filter
  const uniqueTypes = [...new Set(initialPokedex.flatMap(pokemon => pokemon.type))]
  
  // Load team from localStorage on component mount
  useEffect(() => {
    const savedTeam = localStorage.getItem('pokemonTeam')
    if (savedTeam) {
      try {
        setTeam(JSON.parse(savedTeam))
      } catch (e) {
        console.error('Failed to load team from localStorage')
      }
    }
  }, [])

  // Save team to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokemonTeam', JSON.stringify(team))
  }, [team])
  
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

  return (
    <div className="container mx-auto px-4 py-8">
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
            {filteredPokemon.map(pokemon => (
              <Card key={pokemon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => addToTeam(pokemon)}
                      disabled={team.some(p => p.id === pokemon.id)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
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
              
              {team.length > 0 && (
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
              )}
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
                {team.map(pokemon => (
                  <Card key={pokemon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeFromTeam(pokemon.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
                
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