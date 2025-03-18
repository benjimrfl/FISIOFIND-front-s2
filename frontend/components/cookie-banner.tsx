"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Para obtener la URL actual en Next.js

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname(); // Obtener la ruta actual

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");

    // Ocultar el banner si ya aceptó o está en la página de privacidad
    if (!cookieConsent && pathname !== "/privacy-policy") {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [pathname]); // Re-ejecutar cuando cambie la URL

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl border border-gray-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold text-[#1E5ACD] mb-4">
          Política de Cookies
        </h2>
        <div className="text-gray-700 dark:text-gray-300 mb-6">
          <p>
            Utilizamos cookies para mejorar tu experiencia en nuestra plataforma.
            <a 
              href="/privacy-policy" 
              className="text-[#1E5ACD] hover:underline ml-1"
            >
              Conoce más
            </a>
          </p>
        </div>
        <div className="flex gap-4 justify-end">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Rechazar
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 bg-[#1E5ACD] text-white rounded-md hover:bg-[#1848A3] transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
