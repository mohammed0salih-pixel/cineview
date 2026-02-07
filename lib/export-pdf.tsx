import React from "react"
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"

export type ExportPdfInput = {
  project: {
    id: string
    name: string
    description?: string | null
    status?: string | null
    created_at?: string | null
  }
  analysisRun: {
    id: string
    status?: string | null
    created_at?: string | null
    completed_at?: string | null
  }
  technical?: {
    contrast?: number
    saturation?: number
    brightness?: number
    sharpness?: number
    noise?: number
  }
  cinematic?: {
    mood?: string
    energy?: string
    shotType?: string
    genre?: string
  }
  decision?: {
    decision_summary?: string
    risk_flags?: string[]
    recommended_actions?: string[]
    confidence?: number
    intent_alignment?: number
    composition_score?: number
    color_score?: number
    engine_version?: string
  }
  exportedAt: string
}

const palette = {
  base: "#0B0B0C",
  carbon: "#111214",
  ash: "#1A1B1E",
  mist: "#5C5F66",
  fog: "#8B9097",
  ivory: "#EDEFF2",
  white: "#F7F8FA",
}

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: palette.ash,
    backgroundColor: palette.white,
  },
  cover: {
    padding: 56,
    fontFamily: "Helvetica",
    backgroundColor: palette.base,
    color: palette.white,
  },
  coverEyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: palette.fog,
  },
  coverTitle: {
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.1,
    marginTop: 18,
  },
  coverProject: {
    fontSize: 20,
    fontWeight: 600,
    marginTop: 18,
  },
  coverNarrative: {
    fontSize: 12,
    lineHeight: 1.6,
    color: palette.ivory,
    marginTop: 16,
    maxWidth: 420,
  },
  coverMeta: {
    marginTop: 24,
    fontSize: 10,
    color: palette.fog,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    color: palette.mist,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: palette.mist,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: palette.ash,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    color: palette.mist,
  },
  value: {
    fontWeight: 600,
  },
  bullet: {
    marginBottom: 3,
  },
  divider: {
    marginTop: 8,
    marginBottom: 12,
    height: 1,
    backgroundColor: "#E7E9EC",
  },
})

const safe = (value?: string | number | null, fallback = "—") =>
  value === null || value === undefined || value === "" ? fallback : String(value)

export async function buildExportPdf(input: ExportPdfInput) {
  const narrative =
    input.project.description?.trim() ||
    "A cinematic narrative shaped by visual intelligence and strategic creative direction."
  const confidence =
    input.decision?.confidence !== undefined
      ? `${Math.round(input.decision.confidence * 100)}%`
      : "—"

  const doc = (
    <Document>
      <Page size="A4" style={styles.cover}>
        <Text style={styles.coverEyebrow}>CineView AI — Creative Intelligence</Text>
        <Text style={styles.coverTitle}>Director’s Deck</Text>
        <Text style={styles.coverProject}>{safe(input.project.name)}</Text>
        <Text style={styles.coverNarrative}>{narrative}</Text>
        <Text style={styles.coverMeta}>Prepared on {input.exportedAt}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Creative Brief</Text>
          <Text style={styles.subtitle}>Cinematic intelligence for visual decisions.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creative Direction</Text>
          <Text style={styles.bodyText}>
            {safe(input.decision?.decision_summary, "Decision summary unavailable.")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Opportunities</Text>
          {input.decision?.recommended_actions?.length ? (
            input.decision.recommended_actions.map((action) => (
              <Text key={action} style={styles.bullet}>• {action}</Text>
            ))
          ) : (
            <Text style={styles.bodyText}>No immediate opportunities noted.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risks &amp; Trade-offs</Text>
          {input.decision?.risk_flags?.length ? (
            input.decision.risk_flags.map((risk) => (
              <Text key={risk} style={styles.bullet}>• {risk}</Text>
            ))
          ) : (
            <Text style={styles.bodyText}>No major risks detected.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visual Intelligence</Text>
          {[
            ["Contrast", input.technical?.contrast],
            ["Saturation", input.technical?.saturation],
            ["Brightness", input.technical?.brightness],
            ["Sharpness", input.technical?.sharpness],
            ["Noise", input.technical?.noise],
          ].map(([label, value]) => (
            <View style={styles.row} key={label as string}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{safe(value as number, "—")}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cinematic Reading</Text>
          {[
            ["Mood", input.cinematic?.mood],
            ["Energy", input.cinematic?.energy],
            ["Shot Type", input.cinematic?.shotType],
            ["Genre", input.cinematic?.genre],
          ].map(([label, value]) => (
            <View style={styles.row} key={label as string}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{safe(value as string)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidence</Text>
          <Text style={styles.bodyText}>{confidence}</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Intent alignment</Text>
            <Text style={styles.value}>
              {input.decision?.intent_alignment !== undefined
                ? `${Math.round(input.decision.intent_alignment * 100)}%`
                : "—"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Composition</Text>
            <Text style={styles.value}>
              {input.decision?.composition_score !== undefined
                ? `${Math.round(input.decision.composition_score * 100)}%`
                : "—"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Color</Text>
            <Text style={styles.value}>
              {input.decision?.color_score !== undefined
                ? `${Math.round(input.decision.color_score * 100)}%`
                : "—"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )

  const buffer = await pdf(doc).toBuffer()
  return buffer
}
