import { AnalysisLayout } from '@/src/components/layout/AnalysisLayout';
import { VisualSummary } from '@/src/components/analysis/VisualSummary';
import { TechnicalDetails } from '@/src/components/analysis/TechnicalDetails';
import { DecisionOutput } from '@/src/components/analysis/DecisionOutput';

export default function AnalysisPage() {
  const analysis = {
    mood: 'Cinematic',
    energy: 'Medium',
    shotType: 'Medium',
    genre: 'Editorial',
    composition: {
      balance: 'Stable',
      framing: 'Centered subject with soft lead room',
      focalClarity: 'Clear subject isolation',
    },
    color: {
      temperature: 'Neutral',
      palette: ['#e0d7cf', '#a78b73', '#3a3a3a'],
      contrastFeel: 'Moderate contrast',
    },
    technical: {
      brightness: 74,
      contrast: 100,
      highlights: 100,
      shadows: 5,
      saturation: 46,
      noise: 12,
      sharpness: 62,
    },
    media: {
      name: 'sample-image.jpg',
      type: 'image',
      mime: 'image/jpeg',
      size: '2.62 MB',
      resolution: '3515 × 3882',
    },
    status: {
      modifiedValues: 1,
      favorite: 'No',
      bookmarked: 'No',
      analysis: 'completed',
    },
    decision: {
      summary:
        'Prioritize balanced exposure and keep the neutral temperature for a clean editorial feel.',
      confidence: 0.82,
      intentAlignment: 0.76,
      compositionScore: 0.71,
      colorScore: 0.67,
      riskFlags: ['High contrast risk'],
      recommendedActions: ['Add subtle fill light to protect shadow detail.'],
      decisionVersion: 'v1',
      engineVersion: 'decision-v1',
      inputFingerprint: 'f91c…e2a4',
      outputFingerprint: 'a88d…09ff',
    },
  };

  return (
    <AnalysisLayout>
      <VisualSummary data={analysis} />
      <TechnicalDetails data={analysis} />
      <DecisionOutput data={analysis.decision} />
    </AnalysisLayout>
  );
}
