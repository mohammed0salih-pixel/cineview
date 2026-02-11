type VisualSummaryProps = {
  data: {
    mood: string;
    energy: string;
    shotType: string;
    genre: string;
    composition: {
      balance: string;
      framing: string;
      focalClarity: string;
    };
    color: {
      temperature: string;
      palette: string[];
      contrastFeel: string;
    };
  };
};

export function VisualSummary({ data }: VisualSummaryProps) {
  return (
    <section>
      <h2>Visual Analysis Summary</h2>
      <p>Overall mood, style, and composition with a quick-read view.</p>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <div>
          <h3>Overview</h3>
          <ul>
            <li>Primary Mood: {data.mood}</li>
            <li>Energy: {data.energy}</li>
            <li>Shot Type: {data.shotType}</li>
            <li>Genre Lean: {data.genre}</li>
          </ul>
        </div>

        <div>
          <h3>Composition</h3>
          <ul>
            <li>Balance: {data.composition.balance}</li>
            <li>Framing Strength: {data.composition.framing}</li>
            <li>Focal Clarity: {data.composition.focalClarity}</li>
          </ul>
        </div>

        <div>
          <h3>Color & Tone</h3>
          <ul>
            <li>Temperature: {data.color.temperature}</li>
            <li>Dominant Palette: {data.color.palette.join(', ')}</li>
            <li>Contrast Feel: {data.color.contrastFeel}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
