import Image from "next/image";
import React from "react";

import { type CardData } from "@/lib/types";

interface CardViewProps {
  card: CardData;
  isFaceUp: boolean;
  className?: string;
  onClick?: () => void;
  ariaCardNumber?: number;
  ariaTotalCards?: number;
}

const CardView: React.FC<CardViewProps> = ({
  card,
  isFaceUp,
  className,
  onClick,
  ariaCardNumber,
  ariaTotalCards,
}) => {
  const handleInteraction = () => {
    if (onClick) {
      onClick();
    }
  };

  let ariaLabel = "";
  if (isFaceUp) {
    ariaLabel = `Card: ${card.name}. ${card.supertype ? `Type: ${card.supertype}.` : ""} ${card.description.substring(0, 50)}...`;
  } else {
    ariaLabel = "Reveal card";
    if (ariaCardNumber && ariaTotalCards) {
      ariaLabel += ` ${ariaCardNumber} of ${ariaTotalCards}`;
    }
  }

  return (
    <div
      className={`card-container aspect-[640/893] w-56 sm:w-60 ${!isFaceUp ? "is-flipped" : ""} ${className || ""} cursor-pointer transition-transform duration-150 ease-in-out hover:scale-105`}
      {...(onClick
        ? {
            onClick: handleInteraction,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") handleInteraction();
            },
            role: "button",
            tabIndex: 0,
            "aria-label": ariaLabel,
            "aria-pressed": isFaceUp ? "true" : "false",
          }
        : {
            role: "img",
            tabIndex: -1,
            "aria-label": ariaLabel,
          })}
    >
      <div className="card-inner">
        {/* Card Face (Front) */}
        <div
          className={`card-face border-2 border-slate-500 rounded-lg shadow-xl overflow-hidden flex flex-col ${isFaceUp ? "bg-slate-700" : "bg-transparent"}`}
        >
          <div className="w-full h-full relative flex-1 aspect-[640/893]">
            <Image
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-full object-cover"
              width={640}
              height={893}
              sizes="(max-width: 640px) 100vw, 640px"
              priority
            />
            {card.rarity && (
              <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/60 rounded-full text-[9px] sm:text-[10px] text-yellow-300 font-semibold shadow">
                {card.rarity}
              </div>
            )}
          </div>
        </div>

        {/* Card Back - Pokemon Themed */}
        <div className="card-face card-back bg-blue-600 rounded-lg shadow-xl flex items-center justify-center p-4 border-4 border-yellow-400 aspect-[640/893]">
          <div className="text-center relative">
            <Image
              src="/pokeball.png"
              alt="Pokeball"
              className="w-24 h-24 mx-auto opacity-80 mb-2"
              width={96}
              height={96}
              priority
            />
            <div
              className="text-3xl font-black tracking-wider text-yellow-300"
              style={{
                textShadow:
                  "2px 2px 0px #3B82F6, -2px -2px 0px #3B82F6, 2px -2px 0px #3B82F6, -2px 2px 0px #3B82F6, 2px 2px 5px rgba(0,0,0,0.7)",
              }}
            >
              POKÉMON
            </div>
            <div
              className="mt-1 text-sm font-semibold text-yellow-200"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
            >
              TRADING CARD GAME
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardView;
