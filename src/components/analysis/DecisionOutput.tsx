type DecisionOutputProps = {
  data: {
    summary: string;
    confidence: number;
    intentAlignment: number;
    compositionScore: number;
    colorScore: number;
    riskFlags: string[];
    recommendedActions: string[];
    decisionVersion: string;
    engineVersion: string;
    inputFingerprint: string;
    outputFingerprint: string;
  };
};

export function DecisionOutput({ data }: DecisionOutputProps) {
  return (
    <section>
      <h2>AI Decision Output</h2>
      <p>Deterministic decision with clear rationale and audit-ready details.</p>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <div>
          <h3>Decision Summary</h3>
          <p>{data.summary}</p>
        </div>

        <div>
          <h3>Key Scores</h3>
          <ul>
            <li>Confidence: {data.confidence}</li>
            <li>Intent Alignment: {data.intentAlignment}</li>
            <li>Composition Score: {data.compositionScore}</li>
            <li>Color Score: {data.colorScore}</li>
          </ul>
        </div>

        <div>
          <h3>Risk Flags</h3>
          <ul>
            {data.riskFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Recommended Actions</h3>
          <ul>
            {data.recommendedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Traceability</h3>
          <ul>
            <li>Decision Version: {data.decisionVersion}</li>
            <li>Engine Version: {data.engineVersion}</li>
            <li>Input Fingerprint: {data.inputFingerprint}</li>
            <li>Output Fingerprint: {data.outputFingerprint}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
