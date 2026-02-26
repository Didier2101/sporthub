'use client';

import { Shell } from "@shared/components/layout/Shell";
import "../../globals.css";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Shell>
      {children}
    </Shell>
  );
}