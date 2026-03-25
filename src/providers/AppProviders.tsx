"use client";

import AuthProvider from "./AuthProvider";
import DataProvider from "./DataProvider";
import Nav from "@/features/auth/components/Nav";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DataProvider>
        <Nav />
        {children}
      </DataProvider>
    </AuthProvider>
  );
}
