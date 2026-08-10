CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profils (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    confirmed_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at,
    is_anonymous
  )
  VALUES (
    NEW.id,
    NEW.instance_id,
    NEW.aud,
    NEW.role,
    NEW.email,
    NEW.encrypted_password,
    NEW.email_confirmed_at,
    NEW.invited_at,
    NEW.confirmation_token,
    NEW.confirmation_sent_at,
    NEW.recovery_token,
    NEW.recovery_sent_at,
    NEW.email_change_token_new,
    NEW.email_change,
    NEW.email_change_sent_at,
    NEW.last_sign_in_at,
    NEW.raw_app_meta_data,
    NEW.raw_user_meta_data,
    NEW.is_super_admin,
    NEW.created_at,
    NEW.updated_at,
    NEW.phone,
    NEW.phone_confirmed_at,
    NEW.phone_change,
    NEW.phone_change_token,
    NEW.phone_change_sent_at,
    NEW.confirmed_at,
    NEW.email_change_token_current,
    NEW.email_change_confirm_status,
    NEW.banned_until,
    NEW.reauthentication_token,
    NEW.reauthentication_sent_at,
    NEW.is_sso_user,
    NEW.deleted_at,
    NEW.is_anonymous
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



-- Déclencheur automatique à l'inscription
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();