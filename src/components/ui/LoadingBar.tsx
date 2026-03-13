"use client";

import { useLoading } from "@/hooks/use-loading";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingBar() {
  const isLoading = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[9999] shadow-[0_0_10px_rgba(37,99,235,0.5)]"
        />
      )}
    </AnimatePresence>
  );
}
