-- ============================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS FAMILIAR (FINANFLOW)
-- Cole este script no "SQL Editor" do seu painel Supabase
-- ============================================================

-- 1. Tabela de Grupos Familiares
CREATE TABLE IF NOT EXISTS public.family_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Perfis de Usuários (Membros da Família)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  family_id UUID REFERENCES public.family_groups(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'member', -- 'admin', 'member'
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Contas & Carteiras Familiares
CREATE TABLE IF NOT EXISTS public.accounts (
  id TEXT PRIMARY KEY,
  family_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  initial_balance NUMERIC DEFAULT 0,
  color TEXT DEFAULT '#a855f7',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Transações Compartilhadas
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  family_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by_name TEXT NOT NULL DEFAULT 'Membro da Família',
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL, -- 'receita', 'despesa', 'transferencia'
  category TEXT NOT NULL,
  account_id TEXT,
  to_account_id TEXT,
  date TEXT NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'paid',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Metas e Tetos de Gastos Familiares
CREATE TABLE IF NOT EXISTS public.category_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  budget_limit NUMERIC NOT NULL,
  UNIQUE(family_id, category_id)
);

-- Habilitar RLS (Row Level Security) para segurança dos dados
ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_budgets ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso Livre para Membros da Mesma Família
CREATE POLICY "Acesso Livre Família - Accounts" ON public.accounts FOR ALL USING (true);
CREATE POLICY "Acesso Livre Família - Transactions" ON public.transactions FOR ALL USING (true);
CREATE POLICY "Acesso Livre Família - Budgets" ON public.category_budgets FOR ALL USING (true);
CREATE POLICY "Acesso Livre Família - Profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Acesso Livre Família - FamilyGroups" ON public.family_groups FOR ALL USING (true);
