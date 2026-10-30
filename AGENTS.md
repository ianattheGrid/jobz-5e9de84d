# Architecture rules
- Keep beta visitor access and launch-interest presentation centralised in the beta wrapper; original public demos remain usable without exposing authenticated profiles.
- Save launch interest through a validated public edge function with service credentials, a unique app/email key, and admin-only read access; never expose registrations to visitors.
- During beta, an app-owned auth lifecycle trigger blocks new users, preserving existing admin accounts; hosted Supabase auth settings remain separately managed by the owner.