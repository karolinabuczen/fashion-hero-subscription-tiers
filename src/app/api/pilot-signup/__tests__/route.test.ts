import { promises as fs } from "fs";
import path from "path";

const PILOTS_FILE = path.join(process.cwd(), "pilots.json");

// Mockujemy operacje na plikach, żeby nie zapisywać na dysku podczas testów
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

// Mockujemy next/server żeby uniknąć problemów z Web Fetch API w środowisku testowym
jest.mock("next/server", () => {
  class MockNextRequest {
    private body: string;
    constructor(_url: string, init: { body: string }) {
      this.body = init.body;
    }
    async json() {
      return JSON.parse(this.body);
    }
  }
  class MockNextResponse {
    static json(data: unknown, init?: { status?: number }) {
      return { _data: data, status: init?.status ?? 200, json: async () => data };
    }
  }
  return { NextRequest: MockNextRequest, NextResponse: MockNextResponse };
});

import { POST } from "../route";

const mockReadFile = (fs.readFile as jest.Mock);
const mockWriteFile = (fs.writeFile as jest.Mock);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeRequest(body: object): any {
  const { NextRequest } = jest.requireMock("next/server");
  return new NextRequest("http://localhost/api/pilot-signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/pilot-signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReadFile.mockResolvedValue("[]");
    mockWriteFile.mockResolvedValue(undefined);
  });

  it("zwraca { ok: true } i status 200 dla poprawnych danych", async () => {
    const res = await POST(makeRequest({ email: "anna@avintage.pl", firma: "Anna's Vintage", sellerId: "anna@avintage.pl" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
  });

  it("zwraca status 400 gdy brakuje emaila", async () => {
    const res = await POST(makeRequest({ firma: "Anna's Vintage" }));
    expect(res.status).toBe(400);
  });

  it("zwraca status 400 gdy brakuje firmy", async () => {
    const res = await POST(makeRequest({ email: "anna@avintage.pl" }));
    expect(res.status).toBe(400);
  });

  it("zapisuje wiersz z timestamp, seller_id, email i firma", async () => {
    await POST(makeRequest({ email: "anna@avintage.pl", firma: "Anna's Vintage", sellerId: "anna@avintage.pl" }));

    expect(mockWriteFile).toHaveBeenCalledTimes(1);

    const [filePath, content] = mockWriteFile.mock.calls[0] as [string, string, string];
    expect(filePath).toBe(PILOTS_FILE);

    const entries = JSON.parse(content) as Array<{
      timestamp: string;
      seller_id: string;
      email: string;
      firma: string;
    }>;

    expect(entries).toHaveLength(1);
    expect(entries[0].email).toBe("anna@avintage.pl");
    expect(entries[0].firma).toBe("Anna's Vintage");
    expect(entries[0].seller_id).toBe("anna@avintage.pl");
    expect(entries[0].timestamp).toBeTruthy();
  });

  it("dodaje wpis do istniejących danych w pliku", async () => {
    const existing = [{ timestamp: "2026-01-01T00:00:00.000Z", seller_id: "ktos@example.com", email: "ktos@example.com", firma: "Ktoś" }];
    mockReadFile.mockResolvedValue(JSON.stringify(existing));

    await POST(makeRequest({ email: "nowy@example.com", firma: "Nowa Marka", sellerId: "nowy@example.com" }));

    const [, content] = mockWriteFile.mock.calls[0] as [string, string, string];
    const entries = JSON.parse(content) as unknown[];
    expect(entries).toHaveLength(2);
  });
});
