import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface PilotEntry {
  timestamp: string;
  seller_id: string;
  email: string;
  firma: string;
}

const PILOTS_FILE = path.join(process.cwd(), "pilots.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, firma, sellerId } = body as {
      email?: string;
      firma?: string;
      sellerId?: string;
    };

    if (!email || !firma) {
      return NextResponse.json(
        { error: "Pola email i firma są wymagane." },
        { status: 400 }
      );
    }

    const entry: PilotEntry = {
      timestamp: new Date().toISOString(),
      seller_id: sellerId ?? "unknown",
      email,
      firma,
    };

    let entries: PilotEntry[] = [];
    try {
      const raw = await fs.readFile(PILOTS_FILE, "utf-8");
      entries = JSON.parse(raw) as PilotEntry[];
    } catch {
      // plik nie istnieje lub pusty — zaczynamy od pustej tablicy
    }

    entries.push(entry);
    await fs.writeFile(PILOTS_FILE, JSON.stringify(entries, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Błąd serwera. Spróbuj ponownie." },
      { status: 500 }
    );
  }
}
