"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Home, List, PlusCircle, LogOut, Settings, Building2, ChevronRight, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { isAuthenticated, logout, role, name } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Tópicos", href: "/topics", icon: List },
    { name: "Novo Tópico", href: "/topics/new", icon: PlusCircle },
  ];

  if (role === "Admin") {
    navigation.push({ name: "Configurações", href: "/settings", icon: Settings });
  }

  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  // ---------- Desktop sidebar (always visible, md+) ----------
  const sidebarContent = (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white shadow-xl">
      {/* Logo */}
      <div className="flex h-16 items-center flex-shrink-0 px-5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/50">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Unanime</span>
        </div>
        {/* Close button — only on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-4 pb-4">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-slate-300"
                      )}
                    />
                    {item.name}
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-200" />}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* User area */}
      <div className="flex-shrink-0 border-t border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {initials}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                {name || "Morador"}
              </p>
              <p className="text-[10px] text-slate-500">
                {role === "Admin" ? "Síndico" : "Morador"}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 text-sm font-medium text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 group"
        >
          <LogOut className="h-4 w-4 flex-shrink-0 text-slate-500 group-hover:text-red-400 transition-colors" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: always shown ── */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden md:flex h-full flex-shrink-0"
      >
        {sidebarContent}
      </motion.aside>

      {/* ── Mobile: drawer overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />
            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 flex h-full"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
