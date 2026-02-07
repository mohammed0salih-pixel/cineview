"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabaseBrowser } from "@/lib/supabase-browser";

const projects: Array<{
  id: string;
  name: string;
  status: string | null;
  description: string | null;
  created_at: string | null;
}> = [];

const shotList: Array<{
  id: number;
  scene: string;
  shot: string;
  description: string;
  duration: string;
  status: string;
  location: string;
  timeOfDay: string;
  gear: string;
}> = [];

const moodboardItems: Array<{
  id: number;
  type: "image" | "color";
  label: string;
  bg: string;
  span: string;
  src?: string;
  color?: string;
}> = [];

const storyboardFrames: Array<{ id: number; label: string }> = [];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [liveProjects, setLiveProjects] = useState<
    { id: string; name: string; status: string | null; description: string | null; created_at: string | null }[]
  >([]);
  const [liveStatus, setLiveStatus] = useState<"loading" | "authed" | "anon" | "error">("loading");
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveStoryboardFrames, setLiveStoryboardFrames] = useState(storyboardFrames);
  const [liveMoodboardItems, setLiveMoodboardItems] = useState(moodboardItems);
  const [liveShotList, setLiveShotList] = useState(shotList);

  useEffect(() => {
    let isMounted = true;
    supabaseBrowser.auth
      .getSession()
      .then(async ({ data }) => {
        if (!isMounted) return;
        if (!data.session) {
          setLiveStatus("anon");
          return;
        }
        setLiveStatus("authed");
        const { data: rows, error } = await supabaseBrowser
          .from("projects")
          .select("id,name,status,description,created_at")
          .order("created_at", { ascending: false });
        if (!isMounted) return;
        if (error) {
          setLiveError(error.message);
          setLiveStatus("error");
          return;
        }
        setLiveProjects(rows ?? []);
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        setLiveError(err.message);
        setLiveStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (liveStatus !== "authed" || !liveProjects.length) {
      setLiveStoryboardFrames(storyboardFrames);
      setLiveMoodboardItems(moodboardItems);
      setLiveShotList(shotList);
      return () => {
        isMounted = false;
      };
    }

    const projectId = liveProjects[0]?.id;
    if (!projectId) return;

    const fetchBoards = async () => {
      const { data: storyboardRows } = await supabaseBrowser
        .from("storyboards")
        .select("frames,created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!isMounted) return;
      const frames = storyboardRows?.[0]?.frames as Array<Record<string, unknown>> | undefined;
      if (frames?.length) {
        const mappedFrames = frames.map((frame, idx) => ({
          id: (frame.id as number) ?? idx + 1,
          label: (frame.label as string) || `Frame ${idx + 1}`,
        }));
        setLiveStoryboardFrames(mappedFrames);
        setLiveShotList(
          frames.map((frame, idx) => ({
            id: (frame.id as number) ?? idx + 1,
            scene: `Scene ${idx + 1}`,
            shot: (frame.shot as string) || (frame.label as string) || "Shot",
            description: (frame.notes as string) || "Storyboard frame",
            duration: "—",
            status: "pending",
            location: "—",
            timeOfDay: "—",
            gear: "—",
          }))
        );
      } else {
        setLiveStoryboardFrames(storyboardFrames);
        setLiveShotList(shotList);
      }

      const { data: moodboardRows } = await supabaseBrowser
        .from("moodboards")
        .select("items,created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!isMounted) return;
      const items = moodboardRows?.[0]?.items as Array<Record<string, unknown>> | undefined;
      if (items?.length) {
        setLiveMoodboardItems(
          items.map((item, idx) => ({
            id: (item.id as number) ?? idx + 1,
            type: (item.type as "image" | "color") || "image",
            label: (item.label as string) || "",
            bg: item.type === "color" ? "" : "bg-white/10",
            span: "col-span-1 row-span-1",
            src: (item.src as string) || (item.image as string),
            color: (item.color as string),
          }))
        );
      } else {
        setLiveMoodboardItems(moodboardItems);
      }
    };

    void fetchBoards();

    return () => {
      isMounted = false;
    };
  }, [liveProjects, liveStatus]);

  const displayProjects = liveStatus === "authed" ? liveProjects : projects;
  const displayStoryboardFrames = liveStatus === "authed" ? liveStoryboardFrames : storyboardFrames;
  const displayMoodboardItems = liveStatus === "authed" ? liveMoodboardItems : moodboardItems;
  const displayShotList = liveStatus === "authed" ? liveShotList : shotList;

  const resolveProjectType = (project: { description: string | null }) => {
    const description = (project.description ?? "").toLowerCase();
    if (description.includes("campaign")) return "Campaign";
    if (description.includes("brand")) return "Brand";
    return "Film";
  };

  const resolveProjectStatus = (status: string | null) => {
    const normalized = (status ?? "").toLowerCase();
    if (normalized.includes("export")) return "Exported";
    if (normalized.includes("insight")) return "Insights";
    return "Analysis";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24">
        <div className="mx-auto max-w-7xl px-4 pb-20 lg:px-8 fade-soft">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-semibold text-white/60 uppercase tracking-[0.4em]">Project Hub</div>
              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-white font-display tracking-tight">Project Slate</h1>
              <p className="mt-2 text-white/60">Organize shoots, create shot lists, and collaborate with your team</p>
            </div>

            <div className="flex items-center gap-3">
              <Button className="bg-white/5 text-white hover:bg-white/10">New Project</Button>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Input
                className="h-11 rounded-none border-transparent bg-transparent px-0 text-white placeholder:text-white/40"
                placeholder="Search projects..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Button className="h-10 bg-transparent text-white/60 hover:text-white">
                Filter
              </Button>
            </div>
          </div>

          <div className="mb-6 inline-flex flex-wrap gap-3 text-sm">
            {[
              { key: "overview", label: "Projects Overview" },
              { key: "shot", label: "Shot List" },
              { key: "storyboard", label: "Storyboard" },
              { key: "mood", label: "Mood Board" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  activeTab === tab.key ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Saved Projects</h2>
              {liveStatus === "authed" && (
                <Link href="/upload" className="text-sm font-medium text-white/70 hover:text-white">
                  Start new analysis
                </Link>
              )}
            </div>
            {liveStatus === "loading" && (
              <div className="py-6 text-sm text-white/60">
                Loading your saved projects...
              </div>
            )}
            {liveStatus === "anon" && (
              <div className="py-6 text-sm text-white/60 flex flex-col items-start gap-3">
                Sign in to see your saved projects from analysis runs.
                <Link href="/auth">
                  <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/80">
                    Sign in
                  </Button>
                </Link>
              </div>
            )}
            {liveStatus === "error" && (
              <div className="py-6 text-sm text-white/60">
                Unable to load projects{liveError ? `: ${liveError}` : "."}
              </div>
            )}
            {liveStatus === "authed" && liveProjects.length === 0 && (
              <div className="py-6 text-sm text-white/60 flex flex-col items-start gap-3">
                No saved projects yet. Run your first analysis to create one.
                <Link href="/upload">
                  <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/80">
                    Upload & Analyze
                  </Button>
                </Link>
              </div>
            )}
            {liveStatus === "authed" && liveProjects.length > 0 && (
              <div className="space-y-12">
                {liveProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block py-6"
                  >
                    <div className="space-y-3">
                      <p className="text-2xl sm:text-3xl font-semibold text-white">
                        {project.name || "Untitled Project"}
                      </p>
                      <div className="text-sm text-white/60">
                        <span>Type: {resolveProjectType(project)}</span>
                        <span className="mx-2 text-white/40">·</span>
                        <span>Status: {resolveProjectStatus(project.status)}</span>
                        <span className="mx-2 text-white/40">·</span>
                        <span>Confidence: —</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-12">
              {displayProjects.length ? (
                displayProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block py-6"
                  >
                    <div className="space-y-3">
                      <p className="text-2xl sm:text-3xl font-semibold text-white">
                        {project.name}
                      </p>
                      <div className="text-sm text-white/60">
                        <span>Type: {resolveProjectType(project)}</span>
                        <span className="mx-2 text-white/40">·</span>
                        <span>Status: {resolveProjectStatus(project.status)}</span>
                        <span className="mx-2 text-white/40">·</span>
                        <span>Confidence: —</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-6 text-sm text-white/60">
                  {liveStatus === "authed" ? "No projects available yet." : "Sign in to view projects."}
                </div>
              )}
            </div>
          )}

          {activeTab === "shot" && (
            <section className="space-y-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">Shot List</p>
                  <h2 className="text-2xl font-semibold text-white">Production Sequence</h2>
                  <p className="text-sm text-white/60">
                    {displayShotList.length ? `${displayShotList.length} shots listed` : "No shot list yet"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                <Button className="h-9 bg-transparent text-white/60 hover:text-white">
                  Share with Client
                </Button>
                <Button className="h-9 bg-white text-black hover:bg-white/80">Export PDF</Button>
              </div>
              </div>

              {displayShotList.length ? (
                <div className="space-y-8">
                  {displayShotList.map((shot) => (
                    <div key={shot.id} className="flex flex-wrap items-start gap-4">
                      <Checkbox className="mt-1" checked={shot.status === "completed"} />
                      <div className="flex-1 space-y-2">
                        <div className="text-sm text-white/60">{shot.scene}</div>
                        <div className="text-lg font-semibold text-white">{shot.shot}</div>
                        <p className="text-sm text-white/60">{shot.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                          <span>{shot.duration}</span>
                          <span>{shot.location}</span>
                          <span>{shot.timeOfDay}</span>
                          <span>{shot.gear}</span>
                        </div>
                      </div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                        {shot.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-sm text-white/60">No shot list available yet.</div>
              )}
            </section>
          )}

          {activeTab === "mood" && (
            <section className="space-y-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">Mood Direction</p>
                  <h2 className="text-2xl font-semibold text-white">Reference Palette</h2>
                  <p className="text-sm text-white/60 max-w-2xl">Atmospheric references that prioritize light, texture, and tonal direction.</p>
                </div>
                <Button className="h-9 bg-transparent text-white/60 hover:text-white">
                  Share with Client
                </Button>
              </div>
              <div className="flex flex-wrap gap-6">
                {displayMoodboardItems.length ? (
                  displayMoodboardItems.map((item) => (
                    <div
                      key={item.id}
                      className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] space-y-2"
                    >
                      <div className="h-52 overflow-hidden rounded-3xl bg-black/40">
                        {item.type === "image" ? (
                          item.src ? (
                            <img src={item.src} alt={item.label} className="h-full w-full object-cover" />
                          ) : (
                            <div className={`h-full w-full ${item.bg}`} />
                          )
                        ) : (
                          <div className="h-full w-full" style={{ backgroundColor: item.color || "#d4af37" }} />
                        )}
                      </div>
                      {item.label ? (
                        <p className="text-xs uppercase tracking-[0.2em] text-white/50">{item.label}</p>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-white/60">No moodboard items available yet.</div>
                )}
              </div>
            </section>
          )}

          {activeTab === "storyboard" && (
            <section className="space-y-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">Storyboard</p>
                  <h2 className="text-2xl font-semibold text-white">Visual Sequence</h2>
                  <p className="text-sm text-white/60 max-w-2xl">A director’s shot list with a clean, cinematic presentation.</p>
                </div>
                <Button className="h-9 bg-white text-black hover:bg-white/80">Export PDF</Button>
              </div>
              <div className="space-y-10">
                {displayStoryboardFrames.length ? (
                  displayStoryboardFrames.map((frame) => (
                    <div key={frame.id} className="space-y-3">
                      <div className="aspect-[21/9] overflow-hidden rounded-3xl bg-black/40" />
                      <p className="text-xs uppercase tracking-[0.3em] text-white/60">{frame.label}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-white/60">No storyboard available yet.</div>
                )}
              </div>
            </section>
          )}

          <div className="mt-16 p-2">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Stay updated</h3>
                <p className="text-white/60">Get the latest features, tips, and creator news.</p>
              </div>
              <div className="flex w-full max-w-md items-center gap-3">
                <Input
                  className="h-11 rounded-none border-transparent bg-transparent text-white placeholder:text-white/40"
                  placeholder="Enter your email"
                />
                <Button className="h-11 bg-white px-6 text-black hover:bg-white/80">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
