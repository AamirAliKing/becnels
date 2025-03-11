// components/client-provider.jsx
'use client';

import { ClerkProvider } from '@clerk/nextjs';

export function ClientProvider({ children }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}