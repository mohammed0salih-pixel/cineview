# System Overview

## Purpose

Provide creative decision support for visual content using deterministic analysis signals and explainable recommendations.

## Core Capabilities

- Visual analysis ingestion
- Decision summary + recommendations
- Exportable deliverables
- Audit + metrics tracking

## Components

- Next.js App (UI + API routes)
- Decision Engine (lib/decision-engine.ts)
- Supabase (auth, storage, data)

## Operational Notes

- API routes validate auth and ownership.
- Decision engine remains isolated from UI logic.
- Exports are generated server-side.
