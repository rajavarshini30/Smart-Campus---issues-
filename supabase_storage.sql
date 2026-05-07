-- 1. Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public) 
values ('issue-images', 'issue-images', true)
on conflict (id) do nothing;

-- 2. Allow anyone to view images
create policy "Allow public viewing of issues" 
on storage.objects for select 
using (bucket_id = 'issue-images');

-- 3. Allow authenticated users to upload images
create policy "Allow authenticated uploads" 
on storage.objects for insert 
with check (
  bucket_id = 'issue-images' 
  and auth.role() = 'authenticated'
);

-- 4. Allow users to update/delete their own uploaded images (optional)
create policy "Allow users to update own images"
on storage.objects for update
using ( bucket_id = 'issue-images' and auth.uid() = owner )
with check ( bucket_id = 'issue-images' and auth.uid() = owner );

create policy "Allow users to delete own images"
on storage.objects for delete
using ( bucket_id = 'issue-images' and auth.uid() = owner );
