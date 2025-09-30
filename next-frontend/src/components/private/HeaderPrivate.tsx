"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderPrivate() {
  const pathname = usePathname();
  const routes = [
    { name: "Inicio", href: "/" },
    { name: "Ruta 2", href: "/ruta-2" },
    { name: "Ruta 3", href: "/ruta-3" },
    { name: "Ruta 4", href: "/ruta-4" },
    { name: "Ruta 5", href: "/ruta-5" },
  ];

  return (
    <header className="h-20 flex items-center justify-between px-6">
      <div className="min-w-16">
        <h1 className="text-xl font-bold">Logo</h1>
      </div>

      <nav className="flex gap-8">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`font-medium hover:text-primary-7 transition-colors ${
              pathname === route.href ? "text-primary-7" : "text-foreground"
            }`}
          >
            {route.name}
          </Link>
        ))}
      </nav>

      <div className="min-w-16">
        <Link
          href="/iniciar-sesion"
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            pathname === "/iniciar-sesion"
              ? "text-primary-7"
              : "text-foreground hover:text-primary-7"
          }`}
        >
          Iniciar Sesión
        </Link>
      </div>
    </header>
  );
}
