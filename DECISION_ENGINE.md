# Decision Engine

## Location

- lib/decision-engine.ts

## Inputs

- Analysis snapshot (technical, composition, cinematic, color signals)
- Decision context (project type, platform, objective, media metadata)

## Outputs

- decision_summary
- risk_flags
- recommended_actions
- confidence / intent_alignment
- composition_score / color_score

## Determinism

The engine is rule-based and uses no random sources. Identical inputs produce identical outputs.

## Explainability

Each decision includes:

- summary text
- risk flags
- recommended actions
- metrics that justify the recommendation

## Extension Points

- Adjust thresholds in score bands
- Add new risk mappings
- Extend platform-specific goals
