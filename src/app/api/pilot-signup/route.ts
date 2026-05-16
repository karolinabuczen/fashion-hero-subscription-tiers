import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_RANGE = "A:D";

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

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

    const sheets = await getSheets();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: "RAW",
      requestBody: {
        values: [[new Date().toISOString(), sellerId ?? "unknown", email, firma]],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("pilot-signup error:", message);
    return NextResponse.json(
      { error: "Błąd serwera. Spróbuj ponownie.", debug: message },
      { status: 500 }
    );
  }
}
