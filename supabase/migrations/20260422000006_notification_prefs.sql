-- Add notification preferences column to profiles
alter table profiles add column if not exists notification_prefs jsonb default '{"confirmations":true,"arrival":true,"weather":true,"marketing":false}'::jsonb;
