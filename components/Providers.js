"use client";

import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import TermsCheckModal from "./TermsCheckModal";

export default function Providers({ children }) {
  return (
    <I18nProvider>
      <SessionProvider>
        {children}
        <TermsCheckModal />
      </SessionProvider>
    </I18nProvider>
  );
}
