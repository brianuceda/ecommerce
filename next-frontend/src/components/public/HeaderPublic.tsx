"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../../public/Logo";
import { Input } from "@mantine/core";
import { Search, ShoppingCart, User } from "lucide-react";

export default function HeaderPublic() {
  const pathname = usePathname();
  const routes = [
    { name: "Sala", href: "/sala" },
    { name: "Dormitorio", href: "/dormitorio" },
    { name: "Comedor", href: "/comedor" },
    { name: "Oficina", href: "/oficina" },
    { name: "Exterior", href: "/exterior" },
  ];

  return (
    <header>
      {/* Parte 1 */}
      <div className="h-20 flex items-center justify-evenly px-3 bg-primary">
        {/* Logo */}
        <Link
          href="/"
          className="min-w-36 hover:scale-105 transition-transform duration-300"
        >
          <Logo />
        </Link>

        {/* Buscador */}
        <Input
          className="w-full max-w-96"
          radius="xl"
          size="sm"
          placeholder="Buscar productos..."
          leftSection={
            <Search size={16} className="text-foreground-muted/50" />
          }
        />

        {/* Botones */}
        <div className="min-w-36 flex gap-3">
          <Link
            href="/carrito"
            title="Ver carrito de compras"
            className="size-9 grid place-items-center rounded-full bg-primary-5/80 hover:bg-primary-5"
          >
            <ShoppingCart size={16} className="text-white" />
          </Link>
          <Link
            href="/iniciar-sesion"
            title="Iniciar sesión"
            className="size-9 grid place-items-center rounded-full bg-primary-5/80 hover:bg-primary-5"
          >
            <User size={18} className="text-white" />
          </Link>
          {/* <Link
            href="/iniciar-sesion"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/iniciar-sesion"
                ? "text-primary-7"
                : "text-foreground hover:text-primary-7"
            }`}
          >
            Iniciar Sesión
          </Link> */}
        </div>
      </div>

      {/* Categorías y Subcategorías */}
      <div className="h-14 relative flex flex-col justify-center items-center px-3 bg-primary shadow-md">
        {/* Categorías */}
        <nav className="flex gap-10">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`font-normal hover:text-primary-9 transition-colors ${
                pathname === route.href ? "text-primary-7" : "text-background"
              }`}
            >
              {route.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
