import type { Card } from "pokemon-tcg-sdk-typescript/dist/interfaces/card";
import {
  findCardsByQueries,
  getAllCards,
} from "pokemon-tcg-sdk-typescript/dist/services/cardService";
import type { CardData } from "./types";

const POKEMON_API_PAGE_SIZE = 250;
const MAX_EXPECTED_PAGES = 50;

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const mapPokemonCardToCardData = (pokemonCard: Card): CardData => {
  let description = pokemonCard.flavorText || "";

  if (!description) {
    // If no flavor text, try to use ability or attack text
    if (pokemonCard.abilities && pokemonCard.abilities.length > 0) {
      const firstAbility = pokemonCard.abilities[0];
      description = `${firstAbility.name}: ${firstAbility.text}`;
    } else if (pokemonCard.attacks && pokemonCard.attacks.length > 0) {
      const firstAttack = pokemonCard.attacks[0];
      description = `${firstAttack.name} ${
        firstAttack.damage ? `(${firstAttack.damage})` : ""
      }: ${firstAttack.text}`;
    } else {
      description =
        "A mysterious Pokémon card with no detailed description available.";
    }
  }

  // Truncate long descriptions
  if (description.length > 250) {
    description = `${description.substring(0, 247)}...`;
  }

  const imageUrl = pokemonCard.images?.large || pokemonCard.images?.small;
  if (!imageUrl) {
    console.warn(
      `Card ${pokemonCard.name} (${pokemonCard.id}) is missing an image URL.`
    );
  }

  return {
    id: pokemonCard.id,
    name: pokemonCard.name,
    description: description,
    imageUrl: imageUrl,
    rarity: pokemonCard.rarity,
    supertype: pokemonCard.supertype,
    types: pokemonCard.types,
  };
};

export const fetchPokemonCards = async (count: number): Promise<CardData[]> => {
  let allFetchedCards: Card[] = [];
  let attempts = 0;
  const maxAttempts = 3;

  while (
    allFetchedCards.filter((c) => c.images?.large || c.images?.small).length <
      count &&
    attempts < maxAttempts
  ) {
    attempts++;
    try {
      const randomPage = Math.floor(Math.random() * MAX_EXPECTED_PAGES) + 1;
      console.log(
        `Attempt ${attempts}: Fetching page ${randomPage} from Pokemon TCG API...`
      );
      const newCards = await findCardsByQueries({
        page: randomPage,
        pageSize: POKEMON_API_PAGE_SIZE,
      });
      allFetchedCards.push(...newCards);
      allFetchedCards = allFetchedCards.filter(
        (card, index, self) => index === self.findIndex((c) => c.id === card.id)
      );
    } catch (e) {
      console.warn(`Attempt ${attempts} to fetch cards failed:`, e);
      if (attempts >= maxAttempts) {
        try {
          console.warn(
            "Fetching random pages failed. Falling back to fetching all cards (page 1). "
          );
          const firstPageCards = await getAllCards();
          allFetchedCards.push(...firstPageCards);
          allFetchedCards = allFetchedCards.filter(
            (card, index, self) =>
              index === self.findIndex((c) => c.id === card.id)
          );
        } catch (finalError) {
          let errorMessage = "Failed to fetch card data from Pokemon TCG API.";
          if (finalError instanceof Error) {
            errorMessage += ` ${finalError.message}`;
          }
          if (
            typeof errorMessage === "string" &&
            (errorMessage.toLowerCase().includes("unauthorized") ||
              errorMessage.toLowerCase().includes("api key"))
          ) {
            throw new Error(
              "Failed to authenticate with Pokemon TCG API. Please verify your POKEMONTCG_API_KEY environment variable."
            );
          }
          throw new Error(errorMessage);
        }
      }
    }
  }

  if (!allFetchedCards || allFetchedCards.length === 0) {
    throw new Error(
      "No cards returned from Pokemon TCG API after multiple attempts."
    );
  }

  const cardsWithImages = allFetchedCards.filter(
    (card) => card.images && (card.images.large || card.images.small)
  );

  if (cardsWithImages.length < count) {
    if (cardsWithImages.length === 0)
      throw new Error("No cards with images found in the fetched batches.");
    console.warn(
      `Could only find ${cardsWithImages.length} cards with images after ${attempts} attempts, requested ${count}. Returning available cards.`
    );
    return shuffleArray(cardsWithImages).map(mapPokemonCardToCardData);
  }

  const shuffledCards = shuffleArray(cardsWithImages);
  const selectedPokemonCards = shuffledCards.slice(0, count);

  return selectedPokemonCards.map(mapPokemonCardToCardData);
};
