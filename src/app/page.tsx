import { Toaster } from "sonner"
import PokemonTeamManager from '@/components/pokemonteammanager'

interface Pokemon {
  name: string
  type: string[]
  id: number
}

async function getPokemon(): Promise<Pokemon[]> {
  const response = await fetch('http://localhost:4000/pokedex');

  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon data');
  }

  const result: Pokemon[] = await response.json();
  return result;
}

export default async function Home() {
  const pokedex = await getPokemon()

  return (
    <main>
      <PokemonTeamManager initialPokedex={pokedex} />
      <Toaster position="top-right" richColors />
    </main>
  );
}