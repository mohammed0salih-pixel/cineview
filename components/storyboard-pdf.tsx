"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

type StoryboardPdfFrame = {
  frame: number;
  shotType?: string;
  notes?: string;
  timing?: string;
  cameraSetup?: {
    lens?: string;
    aperture?: string;
    iso?: string;
    shutterSpeed?: string;
    movement?: string;
    height?: string;
  };
  lighting?: {
    key?: string;
    fill?: string;
    back?: string;
    kelvin?: string;
    ratio?: string;
  };
  composition?: {
    rule?: string;
    leadingLines?: string;
    depth?: string;
    focus?: string;
  };
  talent?: {
    blocking?: string;
    expression?: string;
    wardrobe?: string;
  };
  transitionIn?: string;
  transitionOut?: string;
};

type StoryboardPdfProps = {
  projectName: string;
  frames: StoryboardPdfFrame[];
  generatedAt: string;
};

const palette = {
  ink: '#0B0B0C',
  ash: '#1A1B1E',
  mist: '#5C5F66',
  fog: '#8B9097',
  ivory: '#EDEFF2',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: palette.ash,
    backgroundColor: palette.white,
  },
  cover: {
    padding: 48,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: palette.ivory,
    backgroundColor: palette.ink,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: palette.fog,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    marginTop: 14,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 10,
    color: palette.ivory,
  },
  meta: {
    marginTop: 18,
    fontSize: 10,
    color: palette.fog,
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: palette.mist,
    marginBottom: 6,
  },
  frameCard: {
    borderWidth: 1,
    borderColor: '#E7E9EC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  frameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  frameTitle: {
    fontSize: 12,
    fontWeight: 700,
  },
  frameMeta: {
    fontSize: 9,
    color: palette.mist,
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  label: {
    fontSize: 9,
    color: palette.mist,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  column: {
    flexGrow: 1,
    flexBasis: 0,
  },
  listItem: {
    marginBottom: 2,
  },
});

const safe = (value?: string) => (value && value.trim().length ? value : '—');

export function StoryboardPdfDocument({ projectName, frames, generatedAt }: StoryboardPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.cover}>
        <Text style={styles.eyebrow}>CineView AI — Storyboard Export</Text>
        <Text style={styles.title}>{projectName || 'Project Storyboard'}</Text>
        <Text style={styles.subtitle}>Production-ready frame sequence</Text>
        <Text style={styles.meta}>Generated at {generatedAt}</Text>
        <Text style={styles.meta}>Total frames: {frames.length}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Storyboard Frames</Text>
        {frames.map((frame) => (
          <View key={`frame-${frame.frame}`} style={styles.frameCard}>
            <View style={styles.frameHeader}>
              <Text style={styles.frameTitle}>Frame {frame.frame}</Text>
              <Text style={styles.frameMeta}>{safe(frame.timing)}</Text>
            </View>
            <Text style={styles.bodyText}>{safe(frame.notes)}</Text>
            <Text style={styles.frameMeta}>{safe(frame.shotType)}</Text>

            <View style={[styles.row, { marginTop: 8 }]}>
              <View style={styles.column}>
                <Text style={styles.label}>Camera</Text>
                <Text style={styles.listItem}>Lens: {safe(frame.cameraSetup?.lens)}</Text>
                <Text style={styles.listItem}>Aperture: {safe(frame.cameraSetup?.aperture)}</Text>
                <Text style={styles.listItem}>ISO: {safe(frame.cameraSetup?.iso)}</Text>
                <Text style={styles.listItem}>Shutter: {safe(frame.cameraSetup?.shutterSpeed)}</Text>
                <Text style={styles.listItem}>Movement: {safe(frame.cameraSetup?.movement)}</Text>
                <Text style={styles.listItem}>Height: {safe(frame.cameraSetup?.height)}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Lighting</Text>
                <Text style={styles.listItem}>Key: {safe(frame.lighting?.key)}</Text>
                <Text style={styles.listItem}>Fill: {safe(frame.lighting?.fill)}</Text>
                <Text style={styles.listItem}>Back: {safe(frame.lighting?.back)}</Text>
                <Text style={styles.listItem}>Kelvin: {safe(frame.lighting?.kelvin)}</Text>
                <Text style={styles.listItem}>Ratio: {safe(frame.lighting?.ratio)}</Text>
              </View>
            </View>

            <View style={[styles.row, { marginTop: 8 }]}>
              <View style={styles.column}>
                <Text style={styles.label}>Composition</Text>
                <Text style={styles.listItem}>Rule: {safe(frame.composition?.rule)}</Text>
                <Text style={styles.listItem}>Lines: {safe(frame.composition?.leadingLines)}</Text>
                <Text style={styles.listItem}>Depth: {safe(frame.composition?.depth)}</Text>
                <Text style={styles.listItem}>Focus: {safe(frame.composition?.focus)}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Talent</Text>
                <Text style={styles.listItem}>Blocking: {safe(frame.talent?.blocking)}</Text>
                <Text style={styles.listItem}>Expression: {safe(frame.talent?.expression)}</Text>
                <Text style={styles.listItem}>Wardrobe: {safe(frame.talent?.wardrobe)}</Text>
              </View>
            </View>

            {(frame.transitionIn || frame.transitionOut) && (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.label}>Transitions</Text>
                <Text style={styles.listItem}>In: {safe(frame.transitionIn)}</Text>
                <Text style={styles.listItem}>Out: {safe(frame.transitionOut)}</Text>
              </View>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
}
