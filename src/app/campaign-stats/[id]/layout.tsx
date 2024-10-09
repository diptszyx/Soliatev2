import React from 'react';

export default function CampaignStatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen ">
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  );
}
