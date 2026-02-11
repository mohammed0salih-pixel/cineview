"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { PitchDeckDocument } from "@/components/pitch-deck-pdf";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

export default function PDFDownloadButton() {
  return (
    <PDFDownloadLink
      document={<PitchDeckDocument />}
      fileName="CineView-AI-Pitch-Deck-2026.pdf"
      className="inline-flex"
    >
      {({ loading }) => (
        <Button
          size="lg"
          className="bg-foreground hover:bg-foreground/90 text-background font-semibold px-8 py-6 text-lg gap-3"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download Pitch Deck (PDF)
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
