import { NextRequest, NextResponse } from "next/server";

import { fetchPokemonCards } from "@/lib/pokemon-tcg-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countParam = searchParams.get("count");
  const count = countParam ? parseInt(countParam, 10) : 5;

  if (Number.isNaN(count) || count < 1 || count > 20) {
    return NextResponse.json(
      { error: "Invalid 'count' parameter. Must be between 1 and 20." },
      { status: 400 }
    );
  }

  try {
    const cards = await fetchPokemonCards(count);
    return NextResponse.json(cards);
  } catch (error) {
    let message = "Failed to fetch cards.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
