-- This script will instantly move all existing demo users to Mahindra University 
-- so the GeoFence successfully matches your physical location in Hyderabad.

update public.profiles 
set university_id = 'mahindra';