# Switch the app's emails to your verified mail.dgrid.co domain

Your Resend account already has **mail.dgrid.co** verified, so nothing more is needed on the Resend side. The app just isn't using it yet.

## What's wrong today

Each email in the app uses a different, wrong sender:

- **Welcome email** — sent from Resend's shared test address, and still signed "JobConnect"
- **Referral invite** — sent from Resend's shared test address
- **Job match notification** — sent from a placeholder `notifications@yourdomain.com`, so it fails outright
- **Nightly self-test alert** — sent from a made-up `alerts@jobz.test` address

The shared test address only ever delivers to your own Resend account email. That's why the three delivered messages in your log all went to ian@the-grid.uk and nobody else receives anything.

## What I'll change

1. Put the sender in one shared place: **Jobz &lt;hello@mail.dgrid.co&gt;**, with replies going to an address you choose.
2. Point the welcome email, referral invite, match notification and nightly alert at it.
3. Fix the welcome email wording so it says Jobz, not JobConnect.
4. Send one live test of the welcome and referral emails to an address you give me, and check the Resend log shows "Delivered" and it lands in the inbox, not spam.

## Separate item: your sign-in code emails still say "Localz"

The three delivered emails in your log are subject "Your Localz sign-in code". Those come from Supabase's own auth email templates, not from the app's code. To fix the wording you'd edit them in Supabase under Authentication → Emails. Say the word and I'll give you the exact replacement text to paste in.

## Technical notes

- Sender strings are currently hardcoded in `supabase/functions/send-welcome-email`, `send-referral-email`, `notify-match` and `nightly-e2e`; these move to a single constant in `supabase/functions/_shared/`.
- `RESEND_API_KEY` is already configured, so no new secret is needed.
- Affected functions get redeployed automatically.

## What I need from you

- Which address replies should go to (e.g. ian@the-grid.uk)
- An address to send the live test to
