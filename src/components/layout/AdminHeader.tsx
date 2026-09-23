"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AuthenticatedAdmin } from "@/types/auth";

interface AdminHeaderProps {
  admin: AuthenticatedAdmin;
}

export function AdminHeader({ admin }: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border-default bg-surface">
      <div className="mx-auto flex min-h-20 max-w-300 flex-col justify-between gap-4 px-5 py-4 md:flex-row md:items-center">
        <div>
          <Link
            href="/admin"
            className="text-xl font-bold text-primary-900"
          >
            Administração
          </Link>

          <p className="mt-1 text-sm text-text-secondary">
            {admin.email}
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="rounded-md border border-border-default px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-background"
          >
            Site público
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
