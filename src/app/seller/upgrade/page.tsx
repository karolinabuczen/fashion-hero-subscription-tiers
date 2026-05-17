"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { CheckCircle, BarChart2, User, TrendingUp } from "lucide-react";
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

// ── Dane wykresów (mock) ────────────────────────────────────────────────────

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

// ── Komponent ───────────────────────────────────────────────────────────────

export default function SellerUpgradePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user === null) {
      router.replace("/account/login");
    } else if (user && !user.isSeller) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user || !user.isSeller) return null;

  // ── Ekran potwierdzenia ─────────────────────────────────────────────────

  if (submitted) {
    return (
      <main className="min-h-screen bg-[var(--color-cream-light)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-16">
          <CheckCircle
            className="mx-auto mb-6 text-[var(--color-charcoal)]"
            size={52}
            strokeWidth={1.5}
          />
          <h1 className="text-2xl font-semibold text-[var(--color-charcoal)] mb-4">
            Dziękujemy!
          </h1>
          <p className="text-[var(--color-warm-gray)] leading-relaxed">
            Konsultant zadzwoni do Ciebie w ciągu 2 dni roboczych.
          </p>
          <Link
            href="/account"
            className="inline-block mt-8 px-6 py-3 bg-[var(--color-charcoal)] text-white text-sm font-medium hover:bg-[var(--color-charcoal-light)] transition-colors"
          >
            Wróć do konta
          </Link>
        </div>
      </main>
    );
  }

  // ── Strona landing ──────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[var(--color-cream-light)]">

      {/* Hero */}
      <section className="bg-[var(--color-charcoal)] text-white px-6 py-16 text-center">
        <span className="inline-block text-xs font-medium tracking-widest uppercase border border-white/30 px-3 py-1 mb-6">
          Pakiet Premium
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold max-w-2xl mx-auto leading-snug mb-4">
          Pakiet Premium dla sprzedawców FashionHero
        </h1>
        <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed">
          Wyższa marża, zaawansowana analityka i dedykowany opiekun —
          wszystko w jednym pakiecie.
        </p>
      </section>

      {/* Karta cenowa */}
      <section className="max-w-lg mx-auto px-6 -mt-8">
        <div className="bg-white shadow-md p-8 text-center">
          <p className="text-xs text-[var(--color-warm-gray)] uppercase tracking-widest mb-4">
            Cena pakietu
          </p>
          <div className="text-5xl font-semibold text-[var(--color-charcoal)] mb-1">
            18%
          </div>
          <p className="text-sm text-[var(--color-warm-gray)] mb-4">marży od każdej transakcji</p>
          <div className="border-t border-[var(--color-cream-dark)] my-4" />
          <div className="text-3xl font-semibold text-[var(--color-charcoal)] mb-1">
            399 zł<span className="text-lg font-normal text-[var(--color-warm-gray)]">/mies.</span>
          </div>
          <p className="text-sm text-[var(--color-warm-gray)] mb-6">za analitykę i opiekuna konta</p>

          {/* Benefity */}
          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-start gap-3 text-sm text-[var(--color-charcoal)]">
              <BarChart2 size={16} className="mt-0.5 shrink-0 text-[var(--color-warm-gray)]" />
              <span>Zaawansowana analityka sprzedaży — 4 wykresy z danymi Twojego sklepu vs. FashionHero</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[var(--color-charcoal)]">
              <User size={16} className="mt-0.5 shrink-0 text-[var(--color-warm-gray)]" />
              <span>Dedykowany opiekun konta — wsparcie i strategia wzrostu na wyłączność</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[var(--color-charcoal)]">
              <TrendingUp size={16} className="mt-0.5 shrink-0 text-[var(--color-warm-gray)]" />
              <span>Wyższa marża — 18% zamiast standardowej stawki</span>
            </li>
          </ul>

          <button
            onClick={() => setSubmitted(true)}
            className="w-full bg-[var(--color-charcoal)] text-white py-3.5 text-sm font-semibold hover:bg-[var(--color-charcoal-light)] transition-colors"
          >
            Ulepsz swój pakiet
          </button>
        </div>
      </section>

      {/* Podgląd analityki */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs text-[var(--color-warm-gray)] uppercase tracking-widest text-center mb-2">
          Co znajdziesz w pakiecie
        </p>
        <h2 className="text-xl font-semibold text-[var(--color-charcoal)] text-center mb-10">
          Podgląd analityki sprzedaży
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* 1. Sprzedaż w czasie */}
          <div className="bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wide mb-1">
              Sprzedaż w czasie
            </h3>
            <p className="text-xs text-[var(--color-warm-gray)] mb-4">
              Twoja sprzedaż rośnie o 12% mies./mies.
            </p>
            <ResponsiveContainer width="100%" height={180}>
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
            <h3 className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wide mb-1">
              Top 3 kategorie vs FH
            </h3>
            <p className="text-xs text-[var(--color-warm-gray)] mb-4">
              Odzież damska dominuje na platformie.
            </p>
            <ResponsiveContainer width="100%" height={180}>
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
            <h3 className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wide mb-1">
              Średnia cena produktu vs FH
            </h3>
            <p className="text-xs text-[var(--color-warm-gray)] mb-4">
              Twoje produkty są 8% droższe od mediany FH.
            </p>
            <ResponsiveContainer width="100%" height={180}>
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
            <h3 className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wide mb-1">
              Profil top kupujących
            </h3>
            <p className="text-xs text-[var(--color-warm-gray)] mb-4">
              Twoi kupujący to kobiety 25–34 z dużych miast.
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={kupujacyDane}
                  dataKey="wartosc"
                  nameKey="segment"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
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

        </div>
      </section>

      {/* Dolne CTA */}
      <section className="bg-white border-t border-[var(--color-cream-dark)] px-6 py-14 text-center">
        <h2 className="text-xl font-semibold text-[var(--color-charcoal)] mb-3">
          Gotowy na wyższy poziom sprzedaży?
        </h2>
        <p className="text-sm text-[var(--color-warm-gray)] mb-8 max-w-sm mx-auto">
          Kliknij poniżej, a nasz konsultant skontaktuje się z Tobą w ciągu 2 dni roboczych.
        </p>
        <button
          onClick={() => setSubmitted(true)}
          className="bg-[var(--color-charcoal)] text-white px-10 py-3.5 text-sm font-semibold hover:bg-[var(--color-charcoal-light)] transition-colors"
        >
          Ulepsz swój pakiet
        </button>
      </section>

    </main>
  );
}
