-- ============================================================
-- Fix 1: Suppression du trigger et de la fonction SECURITY DEFINER
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================================
-- Fix 2: Suppression des colonnes sensibles de public.profils
-- ============================================================
ALTER TABLE public.profils
  DROP COLUMN IF EXISTS encrypted_password,
  DROP COLUMN IF EXISTS confirmation_token,
  DROP COLUMN IF EXISTS confirmation_sent_at,
  DROP COLUMN IF EXISTS recovery_token,
  DROP COLUMN IF EXISTS recovery_sent_at,
  DROP COLUMN IF EXISTS email_change_token_new,
  DROP COLUMN IF EXISTS email_change_token_current,
  DROP COLUMN IF EXISTS email_change_confirm_status,
  DROP COLUMN IF EXISTS reauthentication_token,
  DROP COLUMN IF EXISTS reauthentication_sent_at,
  DROP COLUMN IF EXISTS invited_at,
  DROP COLUMN IF EXISTS phone_change_token,
  DROP COLUMN IF EXISTS phone_change_sent_at,
  DROP COLUMN IF EXISTS is_sso_user,
  DROP COLUMN IF EXISTS is_super_admin,
  DROP COLUMN IF EXISTS deleted_at,
  DROP COLUMN IF EXISTS is_anonymous,
  DROP COLUMN IF EXISTS instance_id,
  DROP COLUMN IF EXISTS aud,
  DROP COLUMN IF EXISTS role;

-- ============================================================
-- Fix 3: Recréer la fonction en SECURITY INVOKER (safe only)
-- Ne copie que les colonnes non-sensibles
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profils (
    id,
    email,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    confirmed_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email_confirmed_at,
    NEW.last_sign_in_at,
    NEW.raw_app_meta_data,
    NEW.raw_user_meta_data,
    NEW.created_at,
    NEW.updated_at,
    NEW.phone,
    NEW.phone_confirmed_at,
    NEW.phone_change,
    NEW.confirmed_at
  );
  RETURN NEW;
END;
$$;

-- Révoquer l'exécution publique pour empêcher les appels directs via supabase.rpc()
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- ============================================================
-- Fix 4: Recréer le trigger
-- ============================================================
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
