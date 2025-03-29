'use client'

import { useState, useEffect } from 'react'
import { Toaster } from "sonner"
import PokemonTeamManager from '@/components/pokemonteammanager'
import LoginSignupPage from '@/components/loginsignup'

interface Pokemon {
  name: string
  type: string[]
  id: number
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pokedex, setPokedex] = useState<Pokemon[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function fetchPokemon(): Promise<Pokemon[]> {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:4000/pokedex');

      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon data');
      }

      const result: Pokemon[] = await response.json();
      setPokedex(result)
      return result;
    } catch (error) {
      console.error('Failed to fetch Pokémon:', error);
      return [];
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch Pokémon if authenticated
    if (isAuthenticated) {
      fetchPokemon();
    }
  }, [isAuthenticated])

  return (
    <main>
      {!isAuthenticated ? (
        <LoginSignupPage setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-screen">
              Loading Pokédex...
            </div>
          ) : (
            <PokemonTeamManager 
              initialPokedex={pokedex} 
            />
          )}
          <Toaster position="top-right" richColors />
        </>
      )}
    </main>
  );
}