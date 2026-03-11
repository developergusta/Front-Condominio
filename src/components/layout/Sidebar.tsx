"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Home, List, PlusCircle, LogOut, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Tópicos", href: "/topics", icon: List },
    { name: "Novo Tópico", href: "/topics/new", icon: PlusCircle },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white shadow-xl">
      <div className="flex h-16 items-center flex-shrink-0 px-4 bg-slate-950">
        <h1 className="text-xl font-bold tracking-tight text-white">Condomínio Digital</h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white",
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors"
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white",
                    "mr-3 h-5 w-5 flex-shrink-0"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-shrink-0 bg-slate-800 p-4">
        <button
          onClick={logout}
          className="group block w-full flex-shrink-0 items-center text-left text-sm font-medium text-slate-300 hover:text-white focus:outline-none transition-colors px-2 py-2 rounded flex hover:bg-slate-700"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-white" />
          Sair
        </button>
      </div>
    </div>
  );
}
