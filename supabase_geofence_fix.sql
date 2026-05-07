-- 1. Move all profiles to Mahindra University
update public.profiles set university_id = 'mahindra';

-- 2. Move all existing issues to Mahindra University
update public.issues set university_id = 'mahindra';

-- 3. Move all existing announcements to Mahindra University
update public.announcements set university_id = 'mahindra';