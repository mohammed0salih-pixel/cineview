"use client";
// ...existing code from [id]/page.tsx...
export default function ProjectPage() {
  return <div>Project details will appear here.</div>;
}

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PDFDownloadLink } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StoryboardPdfDocument } from '@/components/storyboard-pdf';
import { MoodboardPdfDocument } from '@/components/moodboard-pdf';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabaseBrowser } from '@/lib/supabase-browser';

const mockProject = {
  id: '1',
  name: 'Saudi Tourism Campaign',
  client: 'Ministry of Tourism',
  status: 'in-progress',
  lastUpdated: '2026-02-03',
  owner: 'Ahmed Al-Rashid',
  summary:
    'Hero visual campaign for Visit Saudi featuring heritage sites and modern experiences.',
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const buildPdfFileName = (name: string, suffix: string) =>
  `${name || 'project'}-${suffix}`.replace(/\s+/g, '-');

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

// ...rest of the file unchanged...
