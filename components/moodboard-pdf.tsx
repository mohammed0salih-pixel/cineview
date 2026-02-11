"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

type MoodboardPdfItem =
  | {
      id: number;
      type: 'image';
      label?: string;
      notes?: string;
    }
  | {
      id: number;
      type: 'color';
      label?: string;
      color?: string;
      role?: string;
      harmony?: string;
    };

type MoodboardPdfProps = {
  projectName: string;
  items: MoodboardPdfItem[];
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
  itemCard: {
    borderWidth: 1,
    borderColor: '#E7E9EC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E7E9EC',
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  label: {
    fontSize: 9,
    color: palette.mist,
  },
});

const safe = (value?: string) => (value && value.trim().length ? value : '—');

export function MoodboardPdfDocument({ projectName, items, generatedAt }: MoodboardPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.cover}>
        <Text style={styles.eyebrow}>CineView AI — Moodboard Export</Text>
        <Text style={styles.title}>{projectName || 'Project Moodboard'}</Text>
        <Text style={styles.subtitle}>Reference palette and visual direction</Text>
        <Text style={styles.meta}>Generated at {generatedAt}</Text>
        <Text style={styles.meta}>Total items: {items.length}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Moodboard Items</Text>
        {items.map((item) => (
          <View key={`item-${item.id}`} style={styles.itemCard}>
            <View style={styles.row}>
              <Text style={styles.bodyText}>{safe(item.label)}</Text>
              {item.type === 'color' ? (
                <View style={[styles.swatch, { backgroundColor: item.color || '#d4af37' }]} />
              ) : null}
            </View>
            {item.type === 'image' ? (
              <Text style={styles.label}>Image reference</Text>
            ) : (
              <Text style={styles.label}>Color swatch</Text>
            )}
            {'notes' in item && item.notes ? (
              <Text style={styles.bodyText}>{item.notes}</Text>
            ) : null}
            {'role' in item && item.role ? (
              <Text style={styles.bodyText}>Role: {item.role}</Text>
            ) : null}
            {'harmony' in item && item.harmony ? (
              <Text style={styles.bodyText}>Harmony: {item.harmony}</Text>
            ) : null}
          </View>
        ))}
      </Page>
    </Document>
  );
}
