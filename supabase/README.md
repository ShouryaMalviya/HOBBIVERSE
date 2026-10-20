# Hobbiverse Supabase Migrations & Configuration

This directory contains the database migrations and configuration assets for Hobbiverse.

## Migration Files

1. [`migrations/20261019000000_create_hobbiverse_schema.sql`](file:///c:/Users/SHOURYA/HOBBIVERSE/supabase/migrations/20261019000000_create_hobbiverse_schema.sql) — Core tables, constraints, foreign keys, and indexes.
2. [`migrations/20261019000001_row_level_security.sql`](file:///c:/Users/SHOURYA/HOBBIVERSE/supabase/migrations/20261019000001_row_level_security.sql) — 100% table RLS policies, enforcing strict client-isolated private reflections.
3. [`migrations/20261019000002_seed_data.sql`](file:///c:/Users/SHOURYA/HOBBIVERSE/supabase/migrations/20261019000002_seed_data.sql) — Seeds categories, hobbies, learning steps, groups, events, and challenges.

## Setup Guide

For the full architectural breakdown, environment variable configuration, and migration execution steps, see [`docs/supabase-setup-guide.md`](file:///c:/Users/SHOURYA/HOBBIVERSE/docs/supabase-setup-guide.md).
