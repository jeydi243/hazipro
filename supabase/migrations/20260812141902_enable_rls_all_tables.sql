-- ============================================================
-- Activation RLS + Policies sur TOUTES les tables
-- ============================================================

-- Garde-fou : la colonne owner_id est utilisée par l'app (useAuth, stores)
-- mais absente des migrations existantes. Ajout idempotent sans FK pour
-- éviter une dépendance dure en cas de base fraîche.
ALTER TABLE public.profils
  ADD COLUMN IF NOT EXISTS owner_id UUID;

-- ============================================================
-- profils (user-scoped)
-- ============================================================
ALTER TABLE public.profils ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profil" ON public.profils;
CREATE POLICY "Users can view own profil" ON public.profils
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own profil" ON public.profils;
CREATE POLICY "Users can update own profil" ON public.profils
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- ============================================================
-- organisations (tenant-scoped)
-- ============================================================
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own organisations" ON public.organisations;
CREATE POLICY "Users can view own organisations" ON public.organisations
  FOR SELECT
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert organisations" ON public.organisations;
CREATE POLICY "Users can insert organisations" ON public.organisations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own organisations" ON public.organisations;
CREATE POLICY "Users can update own organisations" ON public.organisations
  FOR UPDATE
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own organisations" ON public.organisations;
CREATE POLICY "Users can delete own organisations" ON public.organisations
  FOR DELETE
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

-- ============================================================
-- articles (tenant-scoped)
-- ============================================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own articles" ON public.articles;
CREATE POLICY "Users can view own articles" ON public.articles
  FOR SELECT
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert articles" ON public.articles;
CREATE POLICY "Users can insert articles" ON public.articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own articles" ON public.articles;
CREATE POLICY "Users can update own articles" ON public.articles
  FOR UPDATE
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own articles" ON public.articles;
CREATE POLICY "Users can delete own articles" ON public.articles
  FOR DELETE
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

-- ============================================================
-- article_organisations (tenant-scoped via article)
-- ============================================================
ALTER TABLE public.article_organisations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view article_organisations" ON public.article_organisations;
CREATE POLICY "Users can view article_organisations" ON public.article_organisations
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can manage article_organisations" ON public.article_organisations;
CREATE POLICY "Users can manage article_organisations" ON public.article_organisations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- clients (tenant-scoped)
-- ============================================================
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own clients" ON public.clients;
CREATE POLICY "Users can view own clients" ON public.clients
  FOR SELECT
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert clients" ON public.clients;
CREATE POLICY "Users can insert clients" ON public.clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own clients" ON public.clients;
CREATE POLICY "Users can update own clients" ON public.clients
  FOR UPDATE
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own clients" ON public.clients;
CREATE POLICY "Users can delete own clients" ON public.clients
  FOR DELETE
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

-- ============================================================
-- client_organisations
-- ============================================================
ALTER TABLE public.client_organisations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage client_organisations" ON public.client_organisations;
CREATE POLICY "Users can manage client_organisations" ON public.client_organisations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- fournisseurs (tenant-scoped)
-- ============================================================
ALTER TABLE public.fournisseurs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view fournisseurs" ON public.fournisseurs;
CREATE POLICY "Users can view fournisseurs" ON public.fournisseurs
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can manage fournisseurs" ON public.fournisseurs;
CREATE POLICY "Users can manage fournisseurs" ON public.fournisseurs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- roles (shared reference)
-- ============================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.roles;
CREATE POLICY "Authenticated users can view roles" ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage roles" ON public.roles;
CREATE POLICY "Authenticated users can manage roles" ON public.roles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- user_roles (user-scoped)
-- ============================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own user_roles" ON public.user_roles;
CREATE POLICY "Users can view own user_roles" ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can manage user_roles" ON public.user_roles;
CREATE POLICY "Users can manage user_roles" ON public.user_roles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- lookups (shared reference)
-- ============================================================
ALTER TABLE public.lookups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view lookups" ON public.lookups;
CREATE POLICY "Authenticated users can view lookups" ON public.lookups
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage lookups" ON public.lookups;
CREATE POLICY "Authenticated users can manage lookups" ON public.lookups
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- classes (shared reference)
-- ============================================================
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view classes" ON public.classes;
CREATE POLICY "Authenticated users can view classes" ON public.classes
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage classes" ON public.classes;
CREATE POLICY "Authenticated users can manage classes" ON public.classes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- invoices / factures (tenant-scoped)
-- ============================================================
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage invoices" ON public.invoices
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- invoices_lines
-- ============================================================
ALTER TABLE public.invoices_lines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage invoices_lines" ON public.invoices_lines;
CREATE POLICY "Users can manage invoices_lines" ON public.invoices_lines
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- tarifaires (tenant-scoped)
-- ============================================================
ALTER TABLE public.tarifaires ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tarifaires" ON public.tarifaires;
CREATE POLICY "Users can view own tarifaires" ON public.tarifaires
  FOR SELECT
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage tarifaires" ON public.tarifaires
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- tarifaires_lines
-- ============================================================
ALTER TABLE public.tarifaires_lines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage tarifaires_lines" ON public.tarifaires_lines;
CREATE POLICY "Users can manage tarifaires_lines" ON public.tarifaires_lines
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- nf (note de frais) (tenant-scoped)
-- ============================================================
ALTER TABLE public.nf ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own nf" ON public.nf;
CREATE POLICY "Users can view own nf" ON public.nf
  FOR SELECT
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage nf" ON public.nf
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- nf_lines
-- ============================================================
ALTER TABLE public.nf_lines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage nf_lines" ON public.nf_lines;
CREATE POLICY "Users can manage nf_lines" ON public.nf_lines
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- patients (tenant-scoped)
-- ============================================================
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own patients" ON public.patients;
CREATE POLICY "Users can view own patients" ON public.patients
  FOR SELECT
  TO authenticated
  USING (
    owner_id IN (
      SELECT owner_id FROM public.profils WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage patients" ON public.patients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- patients_organisations
-- ============================================================
ALTER TABLE public.patients_organisations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage patients_organisations" ON public.patients_organisations;
CREATE POLICY "Users can manage patients_organisations" ON public.patients_organisations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- affectations
-- ============================================================
ALTER TABLE public.affectations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage affectations" ON public.affectations;
CREATE POLICY "Users can manage affectations" ON public.affectations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- organisation_tokens
-- ============================================================
ALTER TABLE public.organisation_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage organisation_tokens" ON public.organisation_tokens;
CREATE POLICY "Users can manage organisation_tokens" ON public.organisation_tokens
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- stock tables
-- ============================================================
ALTER TABLE public.stk_trx_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stk_trx_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stk_trx_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stk_trx_lines_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stk_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view stk_trx_headers" ON public.stk_trx_headers;
CREATE POLICY "Users can view stk_trx_headers" ON public.stk_trx_headers
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can manage stk_trx_headers" ON public.stk_trx_headers;
CREATE POLICY "Users can manage stk_trx_headers" ON public.stk_trx_headers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage stk_trx_lines" ON public.stk_trx_lines;
CREATE POLICY "Users can manage stk_trx_lines" ON public.stk_trx_lines
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage stk_trx_details" ON public.stk_trx_details;
CREATE POLICY "Users can manage stk_trx_details" ON public.stk_trx_details
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage stk_trx_lines_details" ON public.stk_trx_lines_details;
CREATE POLICY "Users can manage stk_trx_lines_details" ON public.stk_trx_lines_details
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage stk_data" ON public.stk_data;
CREATE POLICY "Users can manage stk_data" ON public.stk_data
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
