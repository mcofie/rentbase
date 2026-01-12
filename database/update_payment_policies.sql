-- Allow anonymous transactions (for guests)

-- 1. Drop strict policies (cleaning up old ones)
drop policy if exists "Users can create transactions" on rentbase.transactions;
drop policy if exists "Users can view own transactions" on rentbase.transactions;

-- 2. Drop new policies if they already exist (to avoid "already exists" errors)
drop policy if exists "Anyone can create transactions" on rentbase.transactions;
drop policy if exists "Anyone can view transactions" on rentbase.transactions;
drop policy if exists "Anyone can update transactions" on rentbase.transactions;

-- 3. Re-create the policies
-- Allow anyone to create transactions (including anonymous)
create policy "Anyone can create transactions"
  on rentbase.transactions for insert
  with check (true);

-- Allow anyone to view transactions (so we can check status)
create policy "Anyone can view transactions"
  on rentbase.transactions for select
  using (true); 

-- Allow anyone to update transactions (required for client-side success callback)
create policy "Anyone can update transactions"
  on rentbase.transactions for update
  using (true);
