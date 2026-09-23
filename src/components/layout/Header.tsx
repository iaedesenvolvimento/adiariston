"use client";

import Link from "next/link";
import { useState } from "react";

const navigationLinks = [
  {
    href: "/",
    label: "Início",
  },
  {
    href: "/sobre",
    label: "Sobre",
  },
  {
    href: "/agenda",
    label: "Eventos",
  },
  {
    href: "/ministerios",
    label: "Servir",
  },
  {
    href: "/contato",
    label: "Contato",
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-300 items-center justify-between px-5">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-primary-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary-600 text-primary-600">
            A
          </span>
          <span>ADI Ariston</span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-black uppercase tracking-[0.18em] text-primary-900 transition hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Ações */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/oracao"
            className="border border-primary-900 px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-primary-900 transition hover:bg-primary-900 hover:text-white"
          >
            Oração
          </Link>

          <Link
            href="/contribua"
            className="bg-primary-600 px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-primary-700"
          >
            Contribua
          </Link>
        </div>

        {/* Menu Mobile - temporário */}
        <button
          type="button"
          aria-label={
            isMenuOpen ? "Fechar menu" : "Abrir menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="menu-mobile"
          onClick={() =>
            setIsMenuOpen((currentState) => !currentState)
          }
          className="flex h-11 w-11 items-center justify-center border border-border-default lg:hidden"
        >
          <span className="text-2xl" aria-hidden="true">
            {isMenuOpen ? "×" : "☰"}
          </span>
        </button>

      </div>

      {isMenuOpen && (
        <div
          id="menu-mobile"
          className="border-t border-border-default bg-white px-5 py-5 lg:hidden"
        >
          <nav className="mx-auto flex max-w-300 flex-col gap-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-sm font-black uppercase tracking-[0.14em] text-text-primary transition hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/oracao"
              onClick={() => setIsMenuOpen(false)}
              className="border border-primary-900 px-3 py-2 text-sm font-black uppercase tracking-[0.14em] text-primary-900 transition hover:bg-primary-900 hover:text-white"
            >
              Pedido de Oração
            </Link>

            <Link
              href="/visitante"
              onClick={() => setIsMenuOpen(false)}
              className="bg-primary-600 px-3 py-2 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-primary-700"
            >
              Sou Visitante
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
