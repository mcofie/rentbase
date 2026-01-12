-- Allow anonymous transactions (for guests)
-- First drop existing strict policies
drop policy if exists "Users can create transactions" on rentbase.transactions;
drop policy if exists "Users can view own transactions" on rentbase.transactions;

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
