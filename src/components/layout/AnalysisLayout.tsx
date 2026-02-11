export function AnalysisLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 32,
        display: 'grid',
        gap: 24,
      }}
    >
      <header>
        <h1>AI Visual Analysis Report</h1>
        <p>Single-page, deterministic output with clear reasoning and traceable inputs.</p>
      </header>
      {children}
    </main>
  );
}
