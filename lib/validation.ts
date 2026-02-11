import { z } from 'zod';

// Analysis payload validation schema
export const analysisPayloadSchema = z.object({
  project_id: z.string().uuid().optional(),
  project_name: z.string().min(1).max(200).optional(),
  project_type: z.string().max(50).optional(),
  platform: z.string().max(50).optional(),
  media: z.object({
    name: z.string().max(255).optional(),
    type: z.enum(['image', 'video']).optional(),
    size_bytes: z.number().positive().optional(),
    storage_path: z.string().max(500).optional(),
    preview_url: z.string().url().nullable().optional(),
    metadata: z.record(z.unknown()).optional(),
  }).optional(),
  analysis: z.record(z.unknown()),
  analysis_status: z.enum(['loading', 'analyzing', 'completed']).optional(),
  analysis_started_at: z.string().datetime().optional(),
  analysis_completed_at: z.string().datetime().optional(),
  pipeline_version: z.string().max(20).optional(),
  input_fingerprint: z.string().max(100).optional(),
});

// AI analyze request validation
export const aiAnalyzeSchema = z.object({
  prompt: z.string().min(1).max(2000),
  metadata: z.record(z.unknown()).optional(),
});

// Export PDF request validation
export const exportPdfSchema = z.object({
  analysis_run_id: z.string().uuid(),
  export_type: z.string().max(50).optional(),
  format: z.string().max(20).optional(),
});

// Export ZIP request validation
export const exportZipSchema = z.object({
  analysis_run_id: z.string().uuid(),
  export_type: z.string().max(50).optional(),
  format: z.string().max(20).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// KPI request validation
export const kpiFilterSchema = z.object({
  project_id: z.string().uuid().optional(),
  since: z
    .string()
    .min(1)
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Invalid date format',
    })
    .optional(),
});

// Metrics request validation
export const metricsPayloadSchema = z.object({
  project_id: z.string().uuid().optional(),
  analysis_run_id: z.string().uuid().optional(),
  request_id: z.string().max(200).optional(),
  provider: z.string().max(50).optional(),
  model: z.string().max(100).optional(),
  prompt_tokens: z.number().nonnegative().optional(),
  completion_tokens: z.number().nonnegative().optional(),
  total_tokens: z.number().nonnegative().optional(),
  price_per_1k_prompt: z.number().nonnegative().optional(),
  price_per_1k_completion: z.number().nonnegative().optional(),
  cost_usd: z.number().nonnegative().optional(),
  latency_ms: z.number().nonnegative().optional(),
  cache_hit: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Audit log request validation
export const auditLogSchema = z.object({
  action: z.string().min(1).max(200),
  entity_type: z.string().min(1).max(200),
  entity_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  analysis_run_id: z.string().uuid().optional(),
  trace_id: z.string().uuid().optional(),
  asset_id: z.string().uuid().optional(),
  insight_id: z.string().uuid().optional(),
  export_id: z.string().uuid().optional(),
  request_id: z.string().max(200).optional(),
  input_hash: z.string().max(200).optional(),
  output_hash: z.string().max(200).optional(),
  diff: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
  actor_id: z.string().uuid().optional(),
  actor_email: z.string().email().optional(),
  actor_role: z.string().max(100).optional(),
});

// Cron request validation
export const cronJobSchema = z.object({
  job: z.string().min(1).max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AnalysisPayload = z.infer<typeof analysisPayloadSchema>;
export type AIAnalyzeRequest = z.infer<typeof aiAnalyzeSchema>;
export type ExportPdfRequest = z.infer<typeof exportPdfSchema>;
export type ExportZipRequest = z.infer<typeof exportZipSchema>;
export type KpiFilter = z.infer<typeof kpiFilterSchema>;
export type MetricsPayload = z.infer<typeof metricsPayloadSchema>;
export type AuditLogRequest = z.infer<typeof auditLogSchema>;
export type CronJobRequest = z.infer<typeof cronJobSchema>;
