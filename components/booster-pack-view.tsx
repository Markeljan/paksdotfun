import React, { useRef, useState } from "react";

interface BoosterPackViewProps {
  onOpen: () => void;
  isOpening: boolean;
}

const BoosterPackView: React.FC<BoosterPackViewProps> = ({
  onOpen,
  isOpening,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const packRef = useRef<HTMLButtonElement>(null);

  const DRAG_THRESHOLD = 50; // pixels

  const handleInteractionStart = (clientX: number, clientY: number) => {
    if (isOpening) return;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setDragOffset({ x: 0, y: 0 });
  };

  const handleInteractionMove = (clientX: number, clientY: number) => {
    if (!isDragging || !dragStart || isOpening) return;
    const offsetX = clientX - dragStart.x;
    const offsetY = clientY - dragStart.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleInteractionEnd = () => {
    if (!isDragging || isOpening) return;
    setIsDragging(false);
    if (
      Math.abs(dragOffset.y) > DRAG_THRESHOLD ||
      Math.abs(dragOffset.x) > DRAG_THRESHOLD
    ) {
      onOpen();
    } else if (
      dragStart &&
      Math.abs(dragOffset.y) < 10 &&
      Math.abs(dragOffset.x) < 10
    ) {
      // If it's a small drag, treat as click
      onOpen();
    }
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const packDynamicStyle: React.CSSProperties = isOpening
    ? { transform: "scale(0.8) rotate(10deg) translateY(20px)", opacity: 0 }
    : isDragging
      ? {
          transform: `translate(${dragOffset.x / 5}px, ${dragOffset.y / 5}px) rotate(${dragOffset.x / 20}deg) scale(0.98)`,
          cursor: "grabbing",
        }
      : { cursor: "grab" };

  return (
    <button
      type="button"
      ref={packRef}
      className={`relative w-64 h-96 sm:w-72 sm:h-[28rem] rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50
        ${isOpening ? "scale-50 opacity-0 pointer-events-none" : "scale-100 opacity-100"}
      `}
      style={packDynamicStyle}
      onMouseDown={(e) => handleInteractionStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleInteractionMove(e.clientX, e.clientY)}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd} // End drag if mouse leaves pack
      onTouchStart={(e) =>
        handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchMove={(e) =>
        handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchEnd={handleInteractionEnd}
      tabIndex={0}
      aria-label="Open booster pack"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
    >
      {/* Pack Art - Simple Gradient with "Shine" Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"></div>
      {/* Shine element */}
      <div
        className="absolute -top-1/4 -left-1/4 w-1/2 h-[150%] bg-white opacity-20 transform -rotate-45"
        style={{
          animation: isOpening
            ? "none"
            : "shine 4s infinite ease-in-out alternate",
        }}
      ></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div
          className="text-3xl sm:text-4xl font-black tracking-wider text-white"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
        >
          GEMINI
        </div>
        <div className="mt-2 px-4 py-2 bg-black/30 rounded-md text-sm sm:text-base font-semibold text-yellow-300">
          BOOSTER PACK
        </div>
      </div>

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-1 1l2-2M0 10l10-10M9 11l2-2' stroke='%23fff' stroke-width='0.2'/%3E%3C/svg%3E\")",
        }}
      ></div>

      {isOpening && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <svg
            className="animate-spin h-12 w-12 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <title>Loading</title>
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </button>
  );
};

export default BoosterPackView;
