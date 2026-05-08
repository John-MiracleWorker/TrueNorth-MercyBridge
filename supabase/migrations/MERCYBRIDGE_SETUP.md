# MercyBridge Supabase Setup Guide

## Quick Start

1. **Run the migration in Supabase SQL Editor:**
   - Open Supabase Dashboard → SQL Editor
   - Copy/paste contents of `supabase/migrations/20260504000000_mercybridge_schema.sql`
   - Run the script

2. **Enable Storage bucket for bill documents:**
   ```sql
   -- Create bucket for bill uploads
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('mercybridge-documents', 'mercybridge-documents', false);
   
   -- Set bucket policies
   CREATE POLICY "Users can upload own documents" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'mercybridge-documents' AND auth.uid() = owner);
   
   CREATE POLICY "Users can read own documents" ON storage.objects
     FOR SELECT USING (bucket_id = 'mercybridge-documents' AND auth.uid() = owner);
   
   CREATE POLICY "Admins can read all documents" ON storage.objects
     FOR SELECT USING (bucket_id = 'mercybridge-documents' AND 
       EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND mercybridge_role IN ('admin', 'reviewer'))
     );
   ```

3. **Set up admin users:**
   ```sql
   -- Make a user an admin (replace with actual UUID)
   UPDATE profiles 
   SET mercybridge_role = 'admin' 
   WHERE id = 'your-user-uuid';
   ```

## Database Schema

### Tables Created
- `mercybridge_needs` — Bill help requests
- `mercybridge_contributions` — Sponsor contributions
- `mercybridge_admin_reviews` — Admin review history
- `mercybridge_stewardship_plans` — AI-generated plans
- `mercybridge_stewardship_tasks` — Individual tasks from plans
- `mercybridge_status_updates` — Status change notifications
- `mercybridge_audit_logs` — Admin action audit trail

### Custom Types
- `need_category`, `need_status`, `verification_level`, `urgency_level`
- `contribution_status`, `review_action`, `task_status`

### Functions
- `update_need_funding()` — Auto-updates need totals when contribution made
- `set_submitted_at()` — Sets timestamp on status change to submitted
- `is_mercybridge_admin()` — Checks if user has admin/reviewer role

### RLS Policies
- Public can view approved needs
- Requesters can view/manage their own needs
- Admins can view/manage all needs
- Sponsors can view their own contributions
- Private data protected via RLS

### Seed Data
3 sample needs for testing:
1. Electric bill (Michigan) — $184, partially funded
2. Rent shortfall (Ohio) — $320, submitted
3. Medical bill (Texas) — $450, partially funded

## Next Steps

1. **Deploy Edge Function for AI Coach:**
   ```bash
   supabase functions deploy mercybridge-stewardship-coach
   ```

2. **Configure Stripe (when ready):**
   - Add Stripe keys to Supabase secrets
   - Update `mercybridgeApi.ts` to use real payments

3. **Email notifications:**
   - Set up Supabase Hooks or Edge Functions
   - Notify on status changes, funding milestones

## Environment Variables

Add to `.env.local`:
```
VITE_MERCYBRIDGE_API_URL=https://your-project.supabase.co/rest/v1
```
