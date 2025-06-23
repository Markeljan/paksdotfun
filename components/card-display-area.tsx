import React from "react";

import CardView from "@/components/card-view";
import { CardData } from "@/lib/types";

interface CardDisplayAreaProps {
  allCards: CardData[];
  flippedCardIds: string[];
  onCardFlip: (cardId: string) => void;
  lastFlippedId: string | null;
}

const CardDisplayArea: React.FC<CardDisplayAreaProps> = ({
  allCards,
  flippedCardIds,
  onCardFlip,
  lastFlippedId,
}) => {
  const allRevealed =
    flippedCardIds.length === allCards.length && allCards.length > 0;

  return (
    <div className="w-full flex flex-col items-center p-4 my-8">
      <div
        className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 w-full max-w-5xl"
        style={{ minHeight: "22rem" }}
      >
        {allCards.length === 0 && (
          <p className="text-slate-400 text-lg">No cards to display.</p>
        )}
        {allCards.map((card, index) => {
          const isFaceUp = flippedCardIds.includes(card.id);
          const isClickable = !isFaceUp;

          return (
            <CardView
              key={card.id}
              card={card}
              isFaceUp={isFaceUp}
              onClick={isClickable ? () => onCardFlip(card.id) : undefined}
              className={`${card.id === lastFlippedId && isFaceUp ? "animate-just-flipped" : ""} ${isClickable ? "cursor-pointer" : ""}`}
              ariaCardNumber={index + 1}
              ariaTotalCards={allCards.length}
            />
          );
        })}
      </div>
      {allRevealed && (
        <p className="mt-8 text-2xl font-semibold text-green-400">
          All cards revealed!
        </p>
      )}
    </div>
  );
};

export default CardDisplayArea;
