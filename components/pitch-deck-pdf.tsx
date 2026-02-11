"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Professional Pitch Deck Styles
const styles = StyleSheet.create({
  // Page layouts
  page: {
    backgroundColor: "#09090b",
    padding: 50,
    color: "#fafafa",
    position: "relative",
  },
  coverPage: {
    backgroundColor: "#09090b",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  
  // Cover elements
  coverAccent: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 300,
    height: 300,
    backgroundColor: "#d4af37",
    opacity: 0.05,
    borderBottomLeftRadius: 300,
  },
  coverContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
    zIndex: 1,
  },
  coverLogo: {
    width: 80,
    height: 80,
    backgroundColor: "#d4af37",
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  coverLogoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#09090b",
  },
  coverTitle: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#fafafa",
    marginBottom: 16,
    letterSpacing: -1,
  },
  coverTagline: {
    fontSize: 20,
    color: "#d4af37",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "bold",
  },
  coverSubtitle: {
    fontSize: 16,
    color: "#a1a1aa",
    textAlign: "center",
    maxWidth: 500,
    lineHeight: 1.6,
  },
  coverFooter: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  coverFooterItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  coverFooterLabel: {
    fontSize: 10,
    color: "#71717a",
    marginBottom: 4,
  },
  coverFooterValue: {
    fontSize: 14,
    color: "#d4af37",
    fontWeight: "bold",
  },

  // Slide headers
  slideHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 35,
  },
  slideNumber: {
    fontSize: 12,
    color: "#d4af37",
    fontWeight: "bold",
  },
  slideTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fafafa",
    letterSpacing: -0.5,
  },
  slideTitleAccent: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#d4af37",
    letterSpacing: -0.5,
  },

  // Content styles
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d4af37",
    marginTop: 25,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  paragraph: {
    fontSize: 13,
    color: "#e4e4e7",
    lineHeight: 1.7,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 12,
    color: "#a1a1aa",
    marginBottom: 8,
    marginLeft: 12,
    lineHeight: 1.6,
  },
  
  // Highlight boxes
  highlightBox: {
    backgroundColor: "#18181b",
    padding: 24,
    borderRadius: 12,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#d4af37",
  },
  highlightText: {
    fontSize: 15,
    color: "#fafafa",
    lineHeight: 1.7,
    fontWeight: "500",
  },

  // Stats
  statsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 16,
  },
  statCard: {
    backgroundColor: "#18181b",
    padding: 24,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#d4af37",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    color: "#71717a",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Feature grid
  featureGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 20,
  },
  featureCard: {
    backgroundColor: "#18181b",
    padding: 20,
    borderRadius: 12,
    width: "48%",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  featureCardFull: {
    backgroundColor: "#18181b",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#27272a",
    marginBottom: 12,
  },
  featureIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#d4af37",
    borderRadius: 8,
    marginBottom: 12,
    opacity: 0.15,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fafafa",
    marginBottom: 6,
  },
  featureText: {
    fontSize: 10,
    color: "#a1a1aa",
    lineHeight: 1.5,
  },

  // Timeline
  timelineContainer: {
    marginTop: 20,
  },
  timelineItem: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  timelinePhase: {
    backgroundColor: "#d4af37",
    color: "#09090b",
    padding: 10,
    borderRadius: 8,
    width: 80,
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  timelineContent: {
    marginLeft: 16,
    flex: 1,
    paddingTop: 2,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fafafa",
    marginBottom: 4,
  },
  timelineText: {
    fontSize: 10,
    color: "#a1a1aa",
    lineHeight: 1.5,
  },

  // Pricing table
  pricingRow: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    marginTop: 20,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: "#18181b",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  pricingCardHighlight: {
    flex: 1,
    backgroundColor: "#18181b",
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d4af37",
  },
  pricingTier: {
    fontSize: 11,
    color: "#d4af37",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fafafa",
    marginBottom: 12,
  },
  pricingFeature: {
    fontSize: 10,
    color: "#a1a1aa",
    marginBottom: 6,
    lineHeight: 1.4,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#27272a",
    paddingTop: 16,
  },
  footerText: {
    fontSize: 9,
    color: "#52525b",
  },
  footerLogo: {
    fontSize: 10,
    color: "#71717a",
    fontWeight: "bold",
  },

  // Two column layout
  twoColumn: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
  },
  column: {
    flex: 1,
  },

  // Contact
  contactBox: {
    backgroundColor: "#18181b",
    padding: 40,
    borderRadius: 16,
    marginTop: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d4af37",
    marginBottom: 20,
  },
  contactItem: {
    fontSize: 14,
    color: "#e4e4e7",
    marginBottom: 8,
  },

  // Comparison table
  comparisonRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    paddingVertical: 10,
  },
  comparisonHeader: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#d4af37",
    paddingBottom: 10,
    marginBottom: 8,
  },
  comparisonCell: {
    flex: 1,
    fontSize: 10,
    color: "#a1a1aa",
  },
  comparisonCellHeader: {
    flex: 1,
    fontSize: 10,
    color: "#d4af37",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  comparisonCellHighlight: {
    flex: 1,
    fontSize: 10,
    color: "#fafafa",
    fontWeight: "bold",
  },
});

// PDF Document Component
export const PitchDeckDocument = () => (
  <Document>
    {/* Slide 1: Cover */}
    <Page size="A4" orientation="landscape" style={styles.coverPage}>
      <View style={styles.coverAccent} />
      <View style={styles.coverContent}>
        <View style={styles.coverLogo}>
          <Text style={styles.coverLogoText}>CV</Text>
        </View>
        <Text style={styles.coverTitle}>CineView AI</Text>
        <Text style={styles.coverTagline}>The Complete Creative Intelligence Platform</Text>
        <Text style={styles.coverSubtitle}>
          AI-powered visual analysis, social media optimization, project management, 
          and team collaboration for photographers, videographers, and content creators.
        </Text>
      </View>
      <View style={styles.coverFooter}>
        <View style={styles.coverFooterItem}>
          <Text style={styles.coverFooterLabel}>SEEKING</Text>
          <Text style={styles.coverFooterValue}>$2.5M Seed</Text>
        </View>
        <View style={styles.coverFooterItem}>
          <Text style={styles.coverFooterLabel}>MARKET</Text>
          <Text style={styles.coverFooterValue}>$3.2B TAM</Text>
        </View>
        <View style={styles.coverFooterItem}>
          <Text style={styles.coverFooterLabel}>ALIGNED WITH</Text>
          <Text style={styles.coverFooterValue}>Vision 2030</Text>
        </View>
      </View>
    </Page>

    {/* Slide 2: Problem */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.slideHeader}>
        <View>
          <Text style={styles.slideTitle}>The Problem</Text>
        </View>
        <Text style={styles.slideNumber}>02</Text>
      </View>
      
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          Creative professionals waste 40% of their time on repetitive technical tasks, 
          struggling with fragmented tools while missing opportunities to grow their audience 
          and monetize their work effectively.
        </Text>
      </View>

      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Creator Pain Points</Text>
          <Text style={styles.bulletPoint}>• Manual color grading and analysis takes hours per project</Text>
          <Text style={styles.bulletPoint}>• No unified platform for analysis, editing, and publishing</Text>
          <Text style={styles.bulletPoint}>• Difficulty understanding what makes content perform well</Text>
          <Text style={styles.bulletPoint}>• Limited tools designed for Arabic-speaking creators</Text>
          <Text style={styles.bulletPoint}>• Expensive software subscriptions eating into profits</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Market Reality</Text>
          <Text style={styles.bulletPoint}>• 78% of creators use 5+ separate tools daily</Text>
          <Text style={styles.bulletPoint}>• Average creator spends $200+/month on software</Text>
          <Text style={styles.bulletPoint}>• Only 12% understand their content analytics deeply</Text>
          <Text style={styles.bulletPoint}>• Saudi creative sector growing 45% YoY</Text>
          <Text style={styles.bulletPoint}>• 500K+ active creators in Saudi Arabia alone</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>CineView AI</Text>
        <Text style={styles.footerText}>Confidential - Investor Presentation 2026</Text>
      </View>
    </Page>

    {/* Slide 3: Solution */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.slideHeader}>
        <View>
          <Text style={styles.slideTitle}>Our Solution</Text>
        </View>
        <Text style={styles.slideNumber}>03</Text>
      </View>

      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          CineView AI is an all-in-one creative intelligence platform that combines AI-powered 
          visual analysis, social media optimization, project management, and team collaboration 
          - everything creators need in one place.
        </Text>
      </View>

      <View style={styles.featureGrid}>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Advanced Analysis Tools</Text>
          <Text style={styles.featureText}>
            RGB histograms, composition guides, color harmony detection, 
            lens recommendations, and professional grading insights.
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Social Media Optimizer</Text>
          <Text style={styles.featureText}>
            Platform-specific exports, thumbnail CTR prediction, hashtag 
            suggestions, best posting times, and engagement forecasting.
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Project Management</Text>
          <Text style={styles.featureText}>
            Shot lists, storyboards, mood boards, deadline tracking, 
            and complete pre-production planning tools.
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Team Collaboration</Text>
          <Text style={styles.featureText}>
            Real-time chat, file sharing, approval workflows, client portals, 
            and role-based access control.
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Learning Hub</Text>
          <Text style={styles.featureText}>
            Expert courses, technique guides, before/after comparisons, 
            skill assessments, and personalized learning paths.
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Export Integrations</Text>
          <Text style={styles.featureText}>
            Direct export to Lightroom, DaVinci, Premiere, Final Cut. 
            Cloud sync with Google Drive, Dropbox, iCloud.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>CineView AI</Text>
        <Text style={styles.footerText}>Confidential - Investor Presentation 2026</Text>
      </View>
    </Page>

    {/* Slide 4: Market Opportunity */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.slideHeader}>
        <View>
          <Text style={styles.slideTitle}>Market Opportunity</Text>
        </View>
        <Text style={styles.slideNumber}>04</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$3.2B</Text>
          <Text style={styles.statLabel}>Total Addressable Market</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$850M</Text>
          <Text style={styles.statLabel}>Serviceable Addressable Market</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$120M</Text>
          <Text style={styles.statLabel}>Serviceable Obtainable Market</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>32%</Text>
          <Text style={styles.statLabel}>CAGR Through 2030</Text>
        </View>
      </View>

      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Target Segments</Text>
          <Text style={styles.bulletPoint}>• Professional photographers (180K in MENA)</Text>
          <Text style={styles.bulletPoint}>• Videographers and filmmakers (95K active)</Text>
          <Text style={styles.bulletPoint}>• Social media content creators (2M+)</Text>
          <Text style={styles.bulletPoint}>• Production companies (3,500+ in Saudi)</Text>
          <Text style={styles.bulletPoint}>• Marketing agencies and brands</Text>
          <Text style={styles.bulletPoint}>• Educational institutions</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Growth Drivers</Text>
          <Text style={styles.bulletPoint}>• Vision 2030 creative sector investment</Text>
          <Text style={styles.bulletPoint}>• Saudi Film Commission initiatives</Text>
          <Text style={styles.bulletPoint}>• Neom and Red Sea entertainment projects</Text>
          <Text style={styles.bulletPoint}>• Rising influencer economy</Text>
          <Text style={styles.bulletPoint}>• Digital transformation acceleration</Text>
          <Text style={styles.bulletPoint}>• E-commerce visual content demand</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>CineView AI</Text>
        <Text style={styles.footerText}>Confidential - Investor Presentation 2026</Text>
      </View>
    </Page>

    {/* Slide 5: Product Demo */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.slideHeader}>
        <View>
          <Text style={styles.slideTitle}>Platform Overview</Text>
        </View>
        <Text style={styles.slideNumber}>05</Text>
      </View>

      <View style={styles.featureCardFull}>
        <Text style={styles.featureTitle}>Unified Creative Workflow</Text>
        <Text style={styles.featureText}>
          Upload → Analyze → Optimize → Collaborate → Export → Publish - All in one seamless experience
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Core Modules</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>AI-Powered Features</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Export Formats</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Social Platforms</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Key Differentiators</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Text style={styles.bulletPoint}>• AI that understands cinematic language</Text>
          <Text style={styles.bulletPoint}>• Real-time collaboration for creative teams</Text>
          <Text style={styles.bulletPoint}>• Arabic-first with full RTL support</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.bulletPoint}>• Predictive analytics for content performance</Text>
          <Text style={styles.bulletPoint}>• One-click export to all major editing software</Text>
          <Text style={styles.bulletPoint}>• Built-in learning from industry experts</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>CineView AI</Text>
        <Text style={styles.footerText}>Confidential - Investor Presentation 2026</Text>
      </View>
    </Page>

    {/* Slide 6: Business Model */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.slideHeader}>
        <View>
          <Text style={styles.slideTitle}>Business Model</Text>
        </View>
        <Text style={styles.slideNumber}>06</Text>
      </View>

      <View style={styles.pricingRow}>
        <View style={styles.pricingCard}>
          <Text style={styles.pricingTier}>Free</Text>
          <Text style={styles.pricingPrice}>$0</Text>
          <Text style={styles.pricingFeature}>• 5 analyses per month</Text>
          <Text style={styles.pricingFeature}>• Basic social optimization</Text>
          <Text style={styles.pricingFeature}>• Limited learning content</Text>
          <Text style={styles.pricingFeature}>• Community support</Text>
        </View>
        <View style={styles.pricingCardHighlight}>
          <Text style={styles.pricingTier}>Pro</Text>
          <Text style={styles.pricingPrice}>$29/mo</Text>
          <Text style={styles.pricingFeature}>• Unlimited analyses</Text>
          <Text style={styles.pricingFeature}>• All social platforms</Text>
          <Text style={styles.pricingFeature}>• Project management</Text>
          <Text style={styles.pricingFeature}>• Full learning access</Text>
          <Text style={styles.pricingFeature}>• Priority support</Text>
        </View>
        <View style={styles.pricingCard}>
          <Text style={styles.pricingTier}>Team</Text>
          <Text style={styles.pricingPrice}>$79/mo</Text>
          <Text style={styles.pricingFeature}>• Everything in Pro</Text>
          <Text style={styles.pricingFeature}>• 5 team members</Text>
          <Text style={styles.pricingFeature}>• Client portals</Text>
          <Text style={styles.pricingFeature}>• Approval workflows</Text>
          <Text style={styles.pricingFeature}>• Advanced analytics</Text>
        </View>
        <View style={styles.pricingCard}>
          <Text style={styles.pricingTier}>Enterprise</Text>
          <Text style={styles.pricingPrice}>Custom</Text>
          <Text style={styles.pricingFeature}>• Unlimited members</Text>
          <Text style={styles.pricingFeature}>• API access</Text>
          <Text style={styles.pricingFeature}>• White-label options</Text>
          <Text style={styles.pricingFeature}>• Dedicated support</Text>
          <Text style={styles.pricingFeature}>• Custom integrations</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Additional Revenue Streams</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Text style={styles.bulletPoint}>• Marketplace commission (15% on preset/LUT sales)</Text>
          <Text style={styles.bulletPoint}>• Educational partnerships with institutions</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.bulletPoint}>• Brand partnership programs</Text>
          <Text style={styles.bulletPoint}>• Premium AI model training services</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>CineView AI</Text>
        <Text style={styles.footerText}>Confidential - Investor Presentation 2026</Text>
      </View>
    </Page>

    {/* Slide 7: Traction & Projections */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.slideHeader}>
        <View>
          <Text style={styles.slideTitle}>Traction & Projections</Text>
        </View>
        <Text style={styles.slideNumber}>07</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>15K</Text>
          <Text style={styles.statLabel}>Beta Waitlist</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>89%</Text>
          <Text style={styles.statLabel}>Beta Retention</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>User Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>LOIs Signed</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Revenue Projections</Text>
      <View style={styles.comparisonHeader}>
        <Text style={styles.comparisonCellHeader}>Metric</Text>
        <Text style={styles.comparisonCellHeader}>Year 1</Text>
        <Text style={styles.comparisonCellHeader}>Year 2</Text>
        <Text style={styles.comparisonCellHeader}>Year 3</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={styles.comparisonCell}>Paid Users</Text>
        <Text style={styles.comparisonCellHighlight}>5,000</Text>
        <Text style={styles.comparisonCellHighlight}>25,000</Text>
        <Text style={styles.comparisonCellHighlight}>80,000</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={styles.comparisonCell}>ARR</Text>
        <Text style={styles.comparisonCellHighlight}>$1.2M</Text>
        <Text style={styles.comparisonCellHighlight}>$6M</Text>
        <Text style={styles.comparisonCellHighlight}>$18M</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={styles.comparisonCell}>MRR Growth</Text>
        <Text style={styles.comparisonCellHighlight}>15%</Text>
        <Text style={styles.comparisonCellHighlight}>12%</Text>
        <Text style={styles.comparisonCellHighlight}>10%</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={styles.comparisonCell}>Team Size</Text>
        <Text style={styles.comparisonCellHighlight}>12</Text>
        <Text style={styles.comparisonCellHighlight}>35</Text>
        <Text style={styles.comparisonCellHighlight}>75</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>CineView AI</Text>
        <Text style={styles.footerText}>Confidential - Investor Presentation 2026</Text>
      </View>
    </Page>

    {/* Slide 8: Competitive Landscape */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.slideHeader}>
        <View>
          <Text style={styles.slideTitle}>Competitive Advantage</Text>
        </View>
        <Text style={styles.slideNumber}>08</Text>
      </View>

      <Text style={styles.sectionTitle}>Comparison Matrix</Text>
      <View style={styles.comparisonHeader}>
        <Text style={styles.comparisonCellHeader}>Feature</Text>
        <Text style={styles.comparisonCellHeader}>CineView AI</Text>
        <Text style={styles.comparisonCellHeader}>Adobe</Text>
        <Text style={styles.comparisonCellHeader}>Canva</Text>
        <Text style={styles.comparisonCellHeader}>Later</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={styles.comparisonCell}>AI Visual Analysis</Text>
        <Text style={styles.comparisonCellHighlight}>Full</Text>
        <Text style={styles.comparisonCell}>Basic</Text>
        <Text style={styles.comparisonCell}>None</Text>
        <Text style={styles.comparisonCell}>None</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={styles.comparisonCell}>Social Optimization</Text>
        <Text style={styles.comparisonCellHighlight}>Full</Text>
        <Text style={styles.comparisonCell}>None</Text>
        <Text style={styles.comparisonCell}>Basic</Text>
        <Text style={styles.comparisonCellHighlight}>Full</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={styles.comparisonCell}>Team Collaboration</Text>
        <Text style={styles.comparisonCellHighlight}>Full</Text>
        <Text style={styles.comparisonCell}>Basic</Text>
        <Text style={styles.comparisonCellHighlight}>Full</Text>
        <Text style={styles.comparisonCell}>Basic</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={styles.comparisonCell}>Arabic Support</Text>
        <Text style={styles.comparisonCellHighlight}>Native</Text>
        <Text style={styles.comparisonCell}>Basic</Text>
        <Text style={styles.comparisonCell}>Basic</Text>
        <Text style={styles.comparisonCell}>None</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={styles.comparisonCell}>Learning Platform</Text>
        <Text style={styles.comparisonCellHighlight}>Built-in</Text>
        <Text style={styles.comparisonCell}>Separate</Text>
        <Text style={styles.comparisonCell}>Basic</Text>
        <Text style={styles.comparisonCell}>None</Text>
      </View>

      <Text style={styles.sectionTitle}>Our Moat</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Text style={styles.bulletPoint}>• First Saudi-built creative AI platform</Text>
          <Text style={styles.bulletPoint}>• Proprietary cinematic analysis models</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.bulletPoint}>• Integrated all-in-one workflow</Text>
          <Text style={styles.bulletPoint}>• Deep regional market understanding</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>CineView AI</Text>
        <Text style={styles.footerText}>Confidential - Investor Presentation 2026</Text>
      </View>
    </Page>

    {/* Slide 9: Roadmap */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.slideHeader}>
        <View>
          <Text style={styles.slideTitle}>Product Roadmap</Text>
        </View>
        <Text style={styles.slideNumber}>09</Text>
      </View>

      <View style={styles.timelineContainer}>
        <View style={styles.timelineItem}>
          <Text style={styles.timelinePhase}>Q2 2026</Text>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Public Launch</Text>
            <Text style={styles.timelineText}>
              Full platform release with all 6 core modules. iOS and Android mobile apps. 
              Marketing campaign targeting Saudi creators.
            </Text>
          </View>
        </View>
        <View style={styles.timelineItem}>
          <Text style={styles.timelinePhase}>Q3 2026</Text>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Enterprise & API</Text>
            <Text style={styles.timelineText}>
              Enterprise tier launch. Public API for developers. 
              Partnerships with major Saudi brands and agencies.
            </Text>
          </View>
        </View>
        <View style={styles.timelineItem}>
          <Text style={styles.timelinePhase}>Q4 2026</Text>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>GCC Expansion</Text>
            <Text style={styles.timelineText}>
              Launch in UAE, Kuwait, Bahrain, Qatar, Oman. 
              Localized content and regional partnerships. Educational licensing.
            </Text>
          </View>
        </View>
        <View style={styles.timelineItem}>
          <Text style={styles.timelinePhase}>2027</Text>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Global Scale</Text>
            <Text style={styles.timelineText}>
              MENA-wide expansion. Advanced AI features (video analysis, generative tools). 
              Series A fundraise. 100K+ paid users target.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>CineView AI</Text>
        <Text style={styles.footerText}>Confidential - Investor Presentation 2026</Text>
      </View>
    </Page>

    {/* Slide 10: The Ask */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.slideHeader}>
        <View>
          <Text style={styles.slideTitle}>Investment Opportunity</Text>
        </View>
        <Text style={styles.slideNumber}>10</Text>
      </View>

      <View style={styles.highlightBox}>
        <Text style={[styles.highlightText, { textAlign: "center", fontSize: 20 }]}>
          Raising $2.5M Seed Round
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Use of Funds</Text>
      <View style={styles.featureGrid}>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>45% - Product & Engineering</Text>
          <Text style={styles.featureText}>
            AI model development, platform features, mobile apps, 
            infrastructure scaling.
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>30% - Growth & Marketing</Text>
          <Text style={styles.featureText}>
            User acquisition, brand partnerships, creator programs, 
            regional expansion.
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>20% - Team</Text>
          <Text style={styles.featureText}>
            Engineering, design, sales, customer success, 
            and operations hires.
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>5% - Operations</Text>
          <Text style={styles.featureText}>
            Legal, compliance, accounting, and administrative 
            infrastructure.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Key Milestones This Round Enables</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Text style={styles.bulletPoint}>• 25,000 paid subscribers by end of Year 2</Text>
          <Text style={styles.bulletPoint}>• $6M ARR run rate</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.bulletPoint}>• GCC market presence established</Text>
          <Text style={styles.bulletPoint}>• Series A readiness with strong metrics</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>CineView AI</Text>
        <Text style={styles.footerText}>Confidential - Investor Presentation 2026</Text>
      </View>
    </Page>

    {/* Slide 11: Contact */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.slideHeader}>
        <View>
          <Text style={styles.slideTitle}>Let’s Build Together</Text>
        </View>
        <Text style={styles.slideNumber}>11</Text>
      </View>

      <View style={styles.contactBox}>
        <Text style={styles.contactTitle}>CineView AI</Text>
        <Text style={styles.contactItem}>contact@cineview.ai</Text>
        <Text style={styles.contactItem}>www.cineview.ai</Text>
        <Text style={[styles.contactItem, { marginTop: 20, color: "#71717a" }]}>
          Riyadh, Saudi Arabia
        </Text>
      </View>

      <View style={[styles.statsRow, { marginTop: 40 }]}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$2.5M</Text>
          <Text style={styles.statLabel}>Raising</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$18M</Text>
          <Text style={styles.statLabel}>Year 3 ARR Target</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>80K</Text>
          <Text style={styles.statLabel}>Year 3 Users Target</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>CineView AI</Text>
        <Text style={styles.footerText}>Confidential - Investor Presentation 2026</Text>
      </View>
    </Page>
  </Document>
);
