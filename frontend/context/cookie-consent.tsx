"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type CookieConsentContextType = {
  hasConsent: boolean;
  showConsentBanner: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextType>({
  hasConsent: false,
  showConsentBanner: () => {},
});

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [cookieBannerKey, setCookieBannerKey] = useState(0);

  const showConsentBanner = () => {
    setCookieBannerKey(prev => prev + 1);
  };

  const hasConsent = typeof window !== 'undefined' && localStorage.getItem('cookieConsent') === 'accepted';

  return (
    <CookieConsentContext.Provider value={{ hasConsent, showConsentBanner }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export const useCookieConsent = () => useContext(CookieConsentContext);