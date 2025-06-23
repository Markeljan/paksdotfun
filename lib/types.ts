export interface CardData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity?: string;
  supertype?: string;
  types?: string[];
  tcgplayerMarketPriceUsd?: number;
}

export enum PackState {
  INIT = "INIT", // Initial state, API key check
  LOADING_CARDS = "LOADING_CARDS", // Cards are being fetched
  SEALED = "SEALED", // Pack is ready to be opened
  OPENING = "OPENING", // Pack opening animation is in progress
  REVEALING = "REVEALING", // Cards are being revealed one by one
  ALL_REVEALED = "ALL_REVEALED", // All cards have been revealed
  ERROR = "ERROR", // An error occurred
}
