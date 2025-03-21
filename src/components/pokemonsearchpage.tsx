'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Pokemon {
  name: string
  type: string[]
  id: number
}

export default function PokemonSearchPage({ initialPokedex }: { initialPokedex: Pokemon[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [pokedex, setPokedex] = useState<Pokemon[]>(initialPokedex)
  
  // Get unique Pokémon types for the dropdown filter
  const uniqueTypes = [...new Set(initialPokedex.flatMap(pokemon => pokemon.type))]
  
  // Filter Pokémon based on search term and type filter
  const filteredPokemon = pokedex.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || pokemon.type.includes(typeFilter)
    return matchesSearch && matchesType
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Pokémon Database</h1>
        
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
      </div>
      
      {/* Pokémon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    {pokemon.type.map((type, index) => (
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
    </main>
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