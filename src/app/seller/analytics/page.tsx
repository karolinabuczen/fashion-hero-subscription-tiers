"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { usePostHog } from "posthog-js/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ── Dane wykresów (mock, hardcoded) ────────────────────────────────────────

const sprzedazDane = [
  { miesiac: "Gru", sprzedaz: 4200 },
  { miesiac: "Sty", sprzedaz: 5800 },
  { miesiac: "Lut", sprzedaz: 5100 },
  { miesiac: "Mar", sprzedaz: 7200 },
  { miesiac: "Kwi", sprzedaz: 6800 },
  { miesiac: "Maj", sprzedaz: 9100 },
];

const kategorieDane = [
  { kategoria: "Odzież", twoje: 42, srFH: 28 },
  { kategoria: "Akcesoria", twoje: 31, srFH: 35 },
  { kategoria: "Obuwie", twoje: 27, srFH: 22 },
];

const cenaDane = [
  { label: "Twoje produkty", cena: 187 },
  { label: "Średnia FH", cena: 142 },
];

const kupujacyDane = [
  { segment: "Kobiety 25–34", wartosc: 38 },
  { segment: "Kobiety 35–44", wartosc: 27 },
  { segment: "Mężczyźni 25–34", wartosc: 21 },
  { segment: "Pozostali", wartosc: 14 },
];

const PIE_COLORS = ["#212121", "#6b6b6b", "#ece9e2", "#c8c2b8"];

// ── Typy stanu ─────────────────────────────────────────────────────────────

type Widok = "landing" | "formularz" | "dziekujemy";

// ── Komponent ──────────────────────────────────────────────────────────────

export default function SellerAnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const ph = usePostHog();

  const [widok, setWidok] = useState<Widok>("landing");

  function otworzFormularz() {
    setWidok("formularz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const [email, setEmail] = useState("");
  const [firma, setFirma] = useState("");
  const [blad, setBlad] = useState("");
  const [ladowanie, setLadowanie] = useState(false);

  // Ochrona strony — tylko aktywni sprzedawcy
  useEffect(() => {
    if (user === null) {
      router.replace("/account/login");
    } else if (!user.isSeller) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user || !user.isSeller) return null;

  // ── Obsługa formularza ─────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBlad("");

    if (!email.trim() || !firma.trim()) {
      setBlad("Uzupełnij wszystkie pola.");
      return;
    }

    setLadowanie(true);
    try {
      const res = await fetch("/api/pilot-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firma, sellerId: user!.email }),
      });
      if (!res.ok) throw new Error("Błąd serwera");
      ph.capture("pilot_signup", { seller_id: user!.email, firma });
      setWidok("dziekujemy");
    } catch {
      setBlad("Coś poszło nie tak. Spróbuj ponownie.");
    } finally {
      setLadowanie(false);
    }
  }

  // ── Ekran "Dziękujemy" ─────────────────────────────────────────────────

  if (widok === "dziekujemy") {
    return (
      <main className="min-h-screen bg-[var(--color-cream-light)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-16">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-2xl font-semibold text-[var(--color-charcoal)] mb-4">
            Dziękujemy!
          </h1>
          <p className="text-[var(--color-warm-gray)] leading-relaxed">
            Odezwiemy się do Ciebie w ciągu 14 dni z informacją o dostępie do
            pilota FashionHero Analytics.
          </p>
          <button
            onClick={() => router.push("/account")}
            className="mt-8 px-6 py-3 bg-[var(--color-charcoal)] text-white text-sm font-medium hover:bg-[var(--color-charcoal-light)] transition-colors"
          >
            Wróć do konta
          </button>
        </div>
      </main>
    );
  }

  // ── Formularz zapisu ───────────────────────────────────────────────────

  if (widok === "formularz") {
    return (
      <main className="min-h-screen bg-[var(--color-cream-light)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--color-charcoal)] mb-2">
            Zapisz się na pilot
          </h2>
          <p className="text-sm text-[var(--color-warm-gray)] mb-6">
            Pierwsze 2 tygodnie gratis. Odezwiemy się w ciągu 14 dni.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="firma"
                  className="block text-xs font-medium text-[var(--color-charcoal)] mb-1 uppercase tracking-wide"
                >
                  Nazwa firmy / marki
                </label>
                <input
                  id="firma"
                  type="text"
                  value={firma}
                  onChange={(e) => setFirma(e.target.value)}
                  placeholder="np. Anna's Vintage"
                  className="w-full border border-black/15 px-3 py-2.5 text-sm text-[var(--color-charcoal)] outline-none focus:border-[var(--color-charcoal)] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-[var(--color-charcoal)] mb-1 uppercase tracking-wide"
                >
                  Adres e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="np. anna@avintage.pl"
                  className="w-full border border-black/15 px-3 py-2.5 text-sm text-[var(--color-charcoal)] outline-none focus:border-[var(--color-charcoal)] transition-colors"
                />
              </div>
            </div>

            {blad && (
              <p className="mt-4 text-sm text-red-600 text-center">{blad}</p>
            )}

            <button
              type="submit"
              disabled={ladowanie}
              className="mt-6 w-full bg-[var(--color-charcoal)] text-white py-3 text-sm font-medium hover:bg-[var(--color-charcoal-light)] transition-colors disabled:opacity-50"
            >
              {ladowanie ? "Wysyłanie…" : "Zapisz się na pilot"}
            </button>

            <button
              type="button"
              onClick={() => setWidok("landing")}
              className="mt-3 w-full text-sm text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)] transition-colors"
            >
              Wróć
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Główna strona landing ──────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[var(--color-cream-light)]">

      {/* Hero */}
      <section className="bg-[var(--color-charcoal)] text-white px-6 py-16 text-center">
        <span className="inline-block text-xs font-medium tracking-widest uppercase border border-white/30 px-3 py-1 mb-6">
          FashionHero Analytics
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold max-w-2xl mx-auto leading-snug mb-4">
          Poznaj swoich kupujących. Sprzedawaj mądrzej.
        </h1>
        <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed mb-8">
          Twoje dane sprzedaży, trendy kategorii i profil kupujących — wszystko
          w jednym miejscu, porównane ze średnią FashionHero.
        </p>
        <button
          onClick={otworzFormularz}
          className="bg-white text-[var(--color-charcoal)] px-8 py-3 text-sm font-semibold hover:bg-[var(--color-cream)] transition-colors"
        >
          Zapisz się na pilot
        </button>
      </section>

      {/* Wykresy */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* 1. Sprzedaż w czasie */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wide mb-1">
            Sprzedaż w czasie
          </h2>
          <p className="text-xs text-[var(--color-warm-gray)] mb-4">
            Twoje przychody rosły o 117% w ciągu ostatnich 6 miesięcy.
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sprzedazDane}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="miesiac" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v} zł`} />
              <Tooltip formatter={(v) => [`${v} zł`, "Sprzedaż"]} />
              <Line
                type="monotone"
                dataKey="sprzedaz"
                stroke="#212121"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Top 3 kategorie vs FH */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wide mb-1">
            Top 3 kategorie vs FH
          </h2>
          <p className="text-xs text-[var(--color-warm-gray)] mb-4">
            Odzież to Twój mocny punkt — sprzedajesz 50% więcej niż średnia platformy.
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={kategorieDane} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="kategoria" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="twoje" name="Ty" fill="#212121" />
              <Bar dataKey="srFH" name="Średnia FH" fill="#c8c2b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Średnia cena vs FH */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wide mb-1">
            Średnia cena produktu vs FH
          </h2>
          <p className="text-xs text-[var(--color-warm-gray)] mb-4">
            Twoje produkty są wycenione o 32% wyżej niż średnia — to sygnał premium.
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cenaDane} barSize={40} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v} zł`} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={110} />
              <Tooltip formatter={(v) => [`${v} zł`]} />
              <Bar dataKey="cena" fill="#212121" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Profil top kupujących */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wide mb-1">
            Profil top kupujących
          </h2>
          <p className="text-xs text-[var(--color-warm-gray)] mb-4">
            65% Twoich kupujących to kobiety w wieku 25–44 lat z dużych miast.
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={kupujacyDane}
                dataKey="wartosc"
                nameKey="segment"
                cx="50%"
                cy="50%"
                outerRadius={75}
                label={({ index }) => `${kupujacyDane[index as number]?.wartosc}%`}
                labelLine={false}
              >
                {kupujacyDane.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, _name, props) => [`${v}%`, props.payload.segment]} />
              <Legend
                formatter={(_, entry) => (entry.payload as { segment: string }).segment}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Sekcja cenowa */}
      <section className="bg-white border-t border-[var(--color-cream-dark)] px-6 py-16 text-center">
        <p className="text-xs text-[var(--color-warm-gray)] uppercase tracking-widest mb-3">
          Cennik
        </p>
        <div className="text-4xl font-semibold text-[var(--color-charcoal)] mb-2">
          299 zł<span className="text-lg font-normal text-[var(--color-warm-gray)]">/mies.</span>
        </div>
        <p className="text-sm text-[var(--color-warm-gray)] mb-8">
          Oferta pilota: <span className="font-medium text-[var(--color-charcoal)]">pierwsze 2 tygodnie gratis</span> — bez zobowiązań.
        </p>
        <button
          onClick={otworzFormularz}
          className="bg-[var(--color-charcoal)] text-white px-10 py-3.5 text-sm font-semibold hover:bg-[var(--color-charcoal-light)] transition-colors"
        >
          Zapisz się na pilot
        </button>
        <p className="mt-4 text-xs text-[var(--color-warm-gray)]">
          Odezwiemy się w ciągu 14 dni.
        </p>
      </section>

    </main>
  );
}
