"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Sparkles,
  Camera,
  TrendingUp,
  Users,
  FileText,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
  BarChart3,
  Upload,
  Palette,
} from "lucide-react";

export default function DashboardPage() {
  const [aiStatus, setAiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [stats] = useState({
    imagesAnalyzed: 24,
    projectsActive: 3,
    aiRequestsToday: 12,
  });

  useEffect(() => {
    // Check AI Engine status
    fetch("/api/health")
      .then((res) => res.json())
      .then(() => {
        setAiStatus("online");
      })
      .catch(() => {
        setAiStatus("offline");
      });

  }, []);

  const quickActions = [
    {
      title: "AI Tools",
      description: "Analyze images with AI",
      icon: Sparkles,
      href: "/tools",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Upload Media",
      description: "Upload new content",
      icon: Upload,
      href: "/upload",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Projects",
      description: "Manage your projects",
      icon: FileText,
      href: "/projects",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Analytics",
      description: "View insights",
      icon: BarChart3,
      href: "/analysis",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const recentActivity = [
    { action: "Image analyzed", time: "2 minutes ago", icon: Camera },
    { action: "AI analysis completed", time: "15 minutes ago", icon: Sparkles },
    { action: "Project created", time: "1 hour ago", icon: FileText },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <LayoutDashboard className="h-8 w-8 text-primary" />
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here&apos;s what&apos;s happening with your projects.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={aiStatus === "online" ? "default" : "secondary"}
                className="flex items-center gap-1.5"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    aiStatus === "online"
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-400"
                  }`}
                />
                AI {aiStatus === "online" ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Images Analyzed
                </CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.imagesAnalyzed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium">+12%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Projects
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projectsActive}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All on track
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  AI Requests Today
                </CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aiRequestsToday}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Powered by Gemini 2.5
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-accent/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-4`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & AI Features */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Features */}
          <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI-Powered Features
              </CardTitle>
              <CardDescription>
                Unlock the full potential with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Smart image analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Composition suggestions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Color palette extraction</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Technical quality assessment</span>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/tools">
                  Try AI Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
