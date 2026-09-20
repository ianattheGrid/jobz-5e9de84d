# Getting real emails sending from your own domain

## What you do in Resend (I can't do this part)

1. Sign in at resend.com, go to **Domains** and press **Add Domain**.
2. Enter the domain you want emails to come from — most likely `dgrid.co` (or a subdomain like `mail.dgrid.co`, which keeps it separate from your normal business email).
3. Resend shows a short list of DNS records (a few TXT records and usually one MX). Add these where your domain's DNS is managed.
4. Back in Resend, press **Verify**. It usually goes green within minutes, sometimes a few hours.
5. Tell me the verified domain and what you'd like the sender to read, e.g. "Jobz <hello@dgrid.co>" and a reply-to address.

## What I do once it's verified

Right now the app sends from three different, wrong addresses:

- Welcome email: still signed "JobConnect", sent from Resend's shared test address
- Referral invite: sent from Resend's test address
- Match notification: sent from a placeholder `yourdomain.com` address, so it fails outright
- Nightly test alert: sent from a made-up `jobz.test` address

I will:

- Put the sender address in one shared place so all emails use the same verified address and reply-to
- Update the welcome, referral invite, match notification and nightly alert emails to use it
- Fix the welcome email wording so it says Jobz, not JobConnect
- Send one live test of each to an address you give me, and confirm with you that they arrive in the inbox rather than spam

## Why it matters

Resend's test address only ever delivers to your own account email. Anyone else — a candidate you invite, a new signup — simply never receives the email. Until the domain is verified, invitations and welcome emails are effectively not being sent.

## Technical notes

- Sender values are currently hardcoded in `supabase/functions/send-welcome-email`, `send-referral-email`, `notify-match` and `nightly-e2e`. These become a single shared constant in `supabase/functions/_shared/`.
- `RESEND_API_KEY` is already configured, so no new secret is needed unless you create a fresh key for the verified domain.
