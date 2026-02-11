# Cinematic Intelligence Rules System (ci-v2)

## Overview

The cinematic intelligence system has been upgraded from hard-coded if-else logic (ci-v1) to a **data-driven rules engine (ci-v2)**. This allows adding new moods, shot types, and genres without modifying code.

---

## Key Improvements (ci-v1 → ci-v2)

### Coverage Expansion

| Category | ci-v1 | ci-v2 | Improvement |
|----------|-------|-------|-------------|
| **Moods** | 4 categories | 20 categories | 5× increase |
| **Energy** | 3 levels | 7 levels | 2.3× increase |
| **Shot Types** | 4 types | 15 types | 3.75× increase |
| **Genres** | 6 genres | 30 genres | 5× increase |

### New Features

- ✅ **Confidence Scores**: Every classification includes 0-100% confidence
- ✅ **Alternatives**: Top 3 matches with confidence scores
- ✅ **Data-Driven**: Rules stored in JSON, no code changes needed
- ✅ **Versioning**: Track rules version (`ci-v2`)
- ✅ **Extensible**: Add rules via JSON editing

---

## Architecture

### File Structure

```
lib/
├── cinematic-rules.json       # Rules database (JSON)
└── visual-analysis.ts         # Rules engine (TypeScript)
```

### Rules Database Schema

```json
{
  "version": "ci-v2",
  "moods": {
    "Noir Tension": {
      "conditions": [
        {"metric": "contrast", "op": ">=", "value": 70},
        {"metric": "brightness", "op": "<=", "value": 45}
      ],
      "weight": 1.0,
      "confidenceBase": 85,
      "description": "Dark, high-contrast scenes with dramatic shadows"
    }
  },
  "shotTypes": { ... },
  "genres": { ... },
  "energy": { ... }
}
```

### Rule Evaluation Flow

```
Input Metrics → Rule Matcher → Confidence Calculator → Top N Results
```

1. **Extract Metrics**: contrast, brightness, saturation, sharpness, noise, composition, temperature
2. **Evaluate Conditions**: Check all conditions for each rule
3. **Calculate Confidence**: `confidenceBase + complexityBonus` (capped at 100)
4. **Sort by Weight**: Rules with higher weight prioritized
5. **Return Top 3**: Primary result + 2 alternatives

---

## Adding New Rules

### Without Code Changes ✅

Edit `lib/cinematic-rules.json`:

```json
{
  "moods": {
    "Cyberpunk Glow": {
      "conditions": [
        {"metric": "temperature", "op": "==", "value": "Cool"},
        {"metric": "saturation", "op": ">=", "value": 70},
        {"metric": "contrast", "op": ">=", "value": 65}
      ],
      "weight": 0.9,
      "confidenceBase": 84,
      "description": "Neon-lit futuristic aesthetic"
    }
  }
}
```

**Operators Supported:**
- `>=` Greater than or equal
- `<=` Less than or equal
- `==` Equal to
- `>` Greater than
- `<` Less than

**Available Metrics:**
- `contrast` (0-100)
- `brightness` (0-100)
- `saturation` (0-100)
- `sharpness` (0-100)
- `noise` (0-100)
- `composition` (0-100)
- `temperature` ("Warm", "Cool", "Neutral")

---

## API Response Structure

### Old (ci-v1)

```json
{
  "mood": "Noir Tension",
  "energy": "High",
  "shotType": "Close-up Detail",
  "genre": "Film Noir",
  "rulesVersion": "ci-v1"
}
```

### New (ci-v2)

```json
{
  "mood": {
    "label": "Noir Tension",
    "confidence": 87,
    "alternatives": [
      {"label": "Dramatic Intensity", "confidence": 82},
      {"label": "Urban Grit", "confidence": 78}
    ]
  },
  "energy": {
    "level": "High",
    "score": 78,
    "confidence": 85
  },
  "shotType": {
    "label": "Close-up Detail",
    "confidence": 86,
    "alternatives": [
      {"label": "Intimate Close-up", "confidence": 80}
    ]
  },
  "genre": {
    "label": "Film Noir",
    "confidence": 88,
    "alternatives": [
      {"label": "Noir Mystery", "confidence": 83},
      {"label": "Thriller", "confidence": 79}
    ]
  },
  "rulesVersion": "ci-v2"
}
```

---

## Complete Categories

### 20 Moods

1. Noir Tension
2. Uplifting Joy
3. Clinical Suspense
4. Warm Narrative
5. Melancholic Nostalgia
6. Euphoric Energy
7. Eerie Dread
8. Serene Calm
9. Dramatic Intensity
10. Soft Documentary
11. Gritty Realism
12. Ethereal Dream
13. Urban Grit
14. Golden Hour Magic
15. Corporate Clean
16. Moody Ambiance
17. Vibrant Pop
18. Somber Reflection
19. Natural Wonder
20. Cinematic Drama

### 7 Energy Levels

1. Very Low (0-30)
2. Low (30-45)
3. Medium-Low (45-60)
4. Medium (60-70)
5. Medium-High (70-80)
6. High (80-90)
7. Very High (90-100)

### 15 Shot Types

1. Extreme Wide Shot
2. Wide Establishing
3. Full Shot
4. Medium Shot
5. Medium Close-up
6. Close-up Detail
7. Intimate Close-up
8. Extreme Close-up
9. Over-the-Shoulder
10. Two-Shot
11. Dutch Angle
12. Aerial Shot
13. Point-of-View
14. Tracking Shot
15. Static Frame

### 30 Genres

1. Film Noir
2. Commercial
3. Romantic Drama
4. Sci-Fi
5. Travel Documentary
6. Horror
7. Action
8. Thriller
9. Comedy
10. Western
11. Fantasy
12. Historical Drama
13. Musical
14. Sports
15. Nature Documentary
16. Corporate
17. Fashion
18. Food
19. Tech Review
20. Music Video
21. Vlog
22. Animation
23. Art House
24. Indie Film
25. News
26. Reality TV
27. Experimental
28. Noir Mystery
29. Biopic
30. Editorial

---

## Confidence Scoring

### Base Confidence

Set per rule in `confidenceBase` (0-100):

```json
{
  "confidenceBase": 85
}
```

### Complexity Bonus

- +2 per condition (max +10)
- More specific rules → higher confidence

**Example:**
- Rule with 6 conditions: `85 + (6 × 2) = 97` (capped at 100)
- Rule with 1 condition: `70 + (1 × 2) = 72`

### Weight Multiplier

Rules with higher weight ranked first when confidence is similar:

```json
{
  "weight": 0.95  // 0.0-1.0 scale
}
```

---

## Testing

### Run Tests

```bash
npm test tests/cinematic-intelligence.test.ts
```

### Test Coverage

- ✅ 20 moods detection
- ✅ 7 energy levels
- ✅ 15 shot types
- ✅ 30 genres
- ✅ Confidence scores (0-100 range)
- ✅ Alternatives ranking
- ✅ Determinism (same input → same output)
- ✅ Fallback behavior

---

## Migration Guide (ci-v1 → ci-v2)

### For Frontend Consumers

**Before (ci-v1):**
```typescript
const mood = result.cinematic.mood; // "Noir Tension"
const energy = result.cinematic.energy; // "High"
```

**After (ci-v2):**
```typescript
const mood = result.cinematic.mood.label; // "Noir Tension"
const moodConfidence = result.cinematic.mood.confidence; // 87
const alternatives = result.cinematic.mood.alternatives; // [...]

const energy = result.cinematic.energy.level; // "High"
const energyScore = result.cinematic.energy.score; // 78
```

### Backward Compatibility

To support old code:

```typescript
// Extract simple labels for ci-v1 compatibility
const simpleMood = result.cinematic.mood.label;
const simpleEnergy = result.cinematic.energy.level;
const simpleShotType = result.cinematic.shotType.label;
const simpleGenre = result.cinematic.genre.label;
```

---

## Performance

### Rule Evaluation

- **O(n × m)** where n = number of rules, m = avg conditions per rule
- **Current:** ~65 rules × 3 conditions avg = ~195 checks
- **Typical:** <1ms per classification

### Optimization Tips

1. Place high-weight rules first in JSON
2. Keep conditions under 5 per rule
3. Use specific metrics to fail fast

---

## Examples

### Example 1: Horror Scene

**Input:**
```json
{
  "technical": {
    "brightness": 25,
    "contrast": 75,
    "saturation": 30
  },
  "color": {
    "temperature": "Cool"
  }
}
```

**Output:**
```json
{
  "mood": {
    "label": "Eerie Dread",
    "confidence": 86
  },
  "genre": {
    "label": "Horror",
    "confidence": 87,
    "alternatives": [
      {"label": "Thriller", "confidence": 79}
    ]
  }
}
```

### Example 2: Commercial Bright

**Input:**
```json
{
  "technical": {
    "brightness": 78,
    "saturation": 68,
    "sharpness": 75
  }
}
```

**Output:**
```json
{
  "mood": {
    "label": "Uplifting Joy",
    "confidence": 88
  },
  "energy": {
    "level": "High",
    "score": 82
  },
  "genre": {
    "label": "Commercial",
    "confidence": 86
  }
}
```

---

## Future Enhancements (Phase 2-3)

### Phase 2: Multi-Modal Integration
- Audio analysis (music tempo, speech rate)
- Motion analysis (camera movement, action speed)
- Cultural adaptation (regional mood mappings)

### Phase 3: Machine Learning
- Bayesian network for probabilistic inference
- Cross-cultural mood embeddings
- Temporal energy dynamics (HMM)
- Composition-to-genre neural network

---

## Contributing

### Adding a New Mood

1. Choose a unique name
2. Define 2-5 conditions using available metrics
3. Set weight (0.7-1.0 for common, 0.9-1.0 for distinctive)
4. Set confidenceBase (70-90)
5. Add description
6. Test with sample inputs

### Updating Existing Rules

1. Modify conditions in `cinematic-rules.json`
2. Adjust weight/confidence if needed
3. Run tests: `npm test tests/cinematic-intelligence.test.ts`
4. Verify no regressions

---

## Support

For questions or issues with the rules system:
1. Check test file: `tests/cinematic-intelligence.test.ts`
2. Review rules: `lib/cinematic-rules.json`
3. Inspect engine: `lib/visual-analysis.ts` (lines 143-267)

---

**Version:** ci-v2  
**Last Updated:** February 11, 2026  
**Status:** ✅ Production Ready (6.5/10 achieved)
