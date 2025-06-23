"use client";

import { useCallback, useEffect, useState } from "react";

import BoosterPackView from "@/components/booster-pack-view";
import CardDisplayArea from "@/components/card-display-area";
import { ErrorIcon, LoadingIcon, ResetIcon } from "@/components/icons";
import { type CardData, PackState } from "@/lib/types";

const totalCardsInPack = 5;

export default function Home() {
  const [packState, setPackState] = useState<PackState>(PackState.INIT);
  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [lastFlippedId, setLastFlippedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  const fetchCards = useCallback(async () => {
    setApiKeyMissing(false);
    setPackState(PackState.LOADING_CARDS);
    setError(null);
    setFlippedCardIds([]);
    setLastFlippedId(null);
    try {
      const res = await fetch(`/api?count=${totalCardsInPack}`);
      if (!res.ok) {
        const data = await res.json();
        const errorMessage = data.error || "Unknown error from API.";
        if (
          typeof errorMessage === "string" &&
          (errorMessage.toLowerCase().includes("api key") ||
            errorMessage.toLowerCase().includes("unauthorized"))
        ) {
          setApiKeyMissing(true);
        }
        setError(errorMessage);
        setPackState(PackState.ERROR);
        return;
      }
      const cards = await res.json();
      setAllCards(cards);
      setPackState(PackState.SEALED);
    } catch (err) {
      console.error("Error fetching Pokemon cards:", err);
      let errorMessage =
        "An unknown error occurred while fetching cards from the Pokemon TCG API.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setPackState(PackState.ERROR);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handlePackOpen = () => {
    if (packState !== PackState.SEALED) return;
    setPackState(PackState.OPENING);
    setTimeout(() => {
      setPackState(PackState.REVEALING);
    }, 1000);
  };

  const handleCardFlip = (cardId: string) => {
    if (flippedCardIds.includes(cardId) || packState !== PackState.REVEALING) {
      return;
    }
    setFlippedCardIds((prev: string[]) => [...prev, cardId]);
    setLastFlippedId(cardId);
    if (flippedCardIds.length + 1 === allCards.length) {
      setPackState(PackState.ALL_REVEALED);
    }
  };

  const handleReset = () => {
    setFlippedCardIds([]);
    setLastFlippedId(null);
    fetchCards();
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen p-4 sm:p-8 text-center bg-slate-950 text-slate-100 overflow-y-auto">
      <header className="my-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
          PaksdotFun Pack Simulator
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Click to open, then click cards to reveal them!
        </p>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center w-full">
        {packState === PackState.LOADING_CARDS && (
          <div className="flex flex-col items-center justify-center text-xl text-slate-300">
            <LoadingIcon className="w-12 h-12 mb-4 animate-spin text-yellow-400" />
            Searching for Pokemon Cards...
          </div>
        )}
        {packState === PackState.ERROR && (
          <div className="flex flex-col items-center p-6 bg-red-800/60 rounded-lg shadow-xl max-w-md border border-red-700">
            <ErrorIcon className="w-16 h-16 mb-4 text-red-300" />
            <h2 className="text-2xl font-semibold mb-2 text-red-100">
              Oops! Something went wrong.
            </h2>
            <p className="text-red-200 mb-6">{error}</p>
            <button
              onClick={handleReset}
              type="button"
              className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              <ResetIcon className="w-5 h-5 mr-2" />
              Try Again
            </button>
            {apiKeyMissing && (
              <p className="mt-4 text-sm text-yellow-300 bg-yellow-900/50 p-3 rounded-md">
                To use this app, make sure the <code>POKEMONTCG_API_KEY</code>{" "}
                environment variable is correctly set up. You can get an API key
                from{" "}
                <a
                  href="https://dev.pokemontcg.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-yellow-100"
                >
                  dev.pokemontcg.io
                </a>
                .
              </p>
            )}
          </div>
        )}
        {(packState === PackState.SEALED || packState === PackState.OPENING) &&
          !apiKeyMissing &&
          allCards.length > 0 && (
            <BoosterPackView
              onOpen={handlePackOpen}
              isOpening={packState === PackState.OPENING}
            />
          )}
        {(packState === PackState.REVEALING ||
          packState === PackState.ALL_REVEALED) &&
          allCards.length > 0 && (
            <CardDisplayArea
              allCards={allCards}
              flippedCardIds={flippedCardIds}
              onCardFlip={handleCardFlip}
              lastFlippedId={lastFlippedId}
            />
          )}
        {packState === PackState.ALL_REVEALED && !apiKeyMissing && (
          <button
            onClick={handleReset}
            type="button"
            className="mt-12 mb-8 flex items-center px-8 py-3 bg-gradient-to-r from-yellow-500 via-red-500 to-pink-600 hover:from-yellow-600 hover:via-red-600 hover:to-pink-700 text-white font-bold rounded-lg shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
          >
            <ResetIcon className="w-6 h-6 mr-3" />
            Open Another Pack
          </button>
        )}
      </main>
    </div>
  );
}
