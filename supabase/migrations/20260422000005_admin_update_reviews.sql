-- Allow admins to update reviews (for replying)
create policy "Admins update reviews" on reviews for update using (is_admin());
