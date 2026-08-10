-- Création directe de la table 'profils' identique à 'auth.users'
CREATE TABLE public.profils (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    instance_id UUID,
    aud VARCHAR(255),
    role VARCHAR(255),
    email VARCHAR(255),
    email_confirmed_at TIMESTAMPTZ,
    confirmation_token VARCHAR(255),
    email_change_token_new VARCHAR(255),
    email_change VARCHAR(255),
    last_sign_in_at TIMESTAMPTZ,
    raw_app_meta_data JSONB,
    raw_user_meta_data JSONB,
    is_super_admin BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    phone TEXT,
    phone_confirmed_at TIMESTAMPTZ,
    phone_change TEXT,
    phone_change_sent_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    email_change_token_current VARCHAR(255),
    email_change_confirm_status SMALLINT,
    deleted_at TIMESTAMPTZ,
    is_anonymous BOOLEAN DEFAULT FALSE NOT NULL
);

-- Activation de la sécurité niveau ligne (RLS) recommandée par Supabase
ALTER TABLE public.profils ENABLE ROW LEVEL SECURITY;

-- Définition de la clé étrangère vers auth.users pour l'intégrité référentielle
ALTER TABLE public.profils
    ADD CONSTRAINT fk_profils_user
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;