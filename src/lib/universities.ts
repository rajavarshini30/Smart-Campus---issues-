// Full list of Indian Universities with GPS coordinates and geo-fence radius
export const UNIVERSITIES = [
  // Maharashtra
  { id: 'um', name: 'University of Mumbai', city: 'Mumbai', state: 'Maharashtra', lat: 18.9041, lng: 72.8347, radius_meters: 800 },
  { id: 'sppu', name: 'Savitribai Phule Pune University', city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, radius_meters: 1000 },
  { id: 'iitb', name: 'Indian Institute of Technology Bombay', city: 'Mumbai', state: 'Maharashtra', lat: 19.1326, lng: 72.9159, radius_meters: 1200 },
  { id: 'nagpur', name: 'Rashtrasant Tukadoji Maharaj Nagpur University', city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, radius_meters: 700 },
  { id: 'aurangabad', name: 'Dr. Babasaheb Ambedkar Marathwada University', city: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, radius_meters: 600 },
  { id: 'coep', name: 'College of Engineering Pune', city: 'Pune', state: 'Maharashtra', lat: 18.5308, lng: 73.8474, radius_meters: 500 },
  { id: 'vitpune', name: 'Vishwakarma Institute of Technology', city: 'Pune', state: 'Maharashtra', lat: 18.5074, lng: 73.8654, radius_meters: 400 },
  // Delhi / NCR
  { id: 'du', name: 'University of Delhi', city: 'New Delhi', state: 'Delhi', lat: 28.6970, lng: 77.2070, radius_meters: 1000 },
  { id: 'jnu', name: 'Jawaharlal Nehru University', city: 'New Delhi', state: 'Delhi', lat: 28.5413, lng: 77.1673, radius_meters: 900 },
  { id: 'iitd', name: 'Indian Institute of Technology Delhi', city: 'New Delhi', state: 'Delhi', lat: 28.5449, lng: 77.1926, radius_meters: 1100 },
  { id: 'aiims', name: 'All India Institute of Medical Sciences', city: 'New Delhi', state: 'Delhi', lat: 28.5672, lng: 77.2100, radius_meters: 600 },
  { id: 'jamia', name: 'Jamia Millia Islamia', city: 'New Delhi', state: 'Delhi', lat: 28.5605, lng: 77.2807, radius_meters: 700 },
  { id: 'ignou', name: 'Indira Gandhi National Open University', city: 'New Delhi', state: 'Delhi', lat: 28.5356, lng: 77.2501, radius_meters: 800 },
  { id: 'amity', name: 'Amity University Noida', city: 'Noida', state: 'Uttar Pradesh', lat: 28.9107, lng: 77.1100, radius_meters: 900 },
  // Karnataka
  { id: 'iisc', name: 'Indian Institute of Science', city: 'Bengaluru', state: 'Karnataka', lat: 13.0219, lng: 77.5671, radius_meters: 1000 },
  { id: 'iiitb', name: 'International Institute of Information Technology Bangalore', city: 'Bengaluru', state: 'Karnataka', lat: 13.0711, lng: 77.5022, radius_meters: 600 },
  { id: 'bu', name: 'Bangalore University', city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, radius_meters: 800 },
  { id: 'manipal', name: 'Manipal Academy of Higher Education', city: 'Manipal', state: 'Karnataka', lat: 13.3539, lng: 74.7932, radius_meters: 1200 },
  { id: 'rvce', name: 'RV College of Engineering', city: 'Bengaluru', state: 'Karnataka', lat: 12.9237, lng: 77.4985, radius_meters: 500 },
  // Tamil Nadu
  { id: 'annauniv', name: 'Anna University', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0099, lng: 80.2363, radius_meters: 900 },
  { id: 'iitm', name: 'Indian Institute of Technology Madras', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9917, lng: 80.2333, radius_meters: 1200 },
  { id: 'madrasuniv', name: 'University of Madras', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0563, lng: 80.2823, radius_meters: 700 },
  { id: 'vit', name: 'Vellore Institute of Technology', city: 'Vellore', state: 'Tamil Nadu', lat: 12.9692, lng: 79.1559, radius_meters: 1100 },
  { id: 'nit_t', name: 'NIT Tiruchirappalli', city: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7600, lng: 78.8131, radius_meters: 800 },
  // Andhra Pradesh & Telangana
  { id: 'osmania', name: 'Osmania University', city: 'Hyderabad', state: 'Telangana', lat: 17.4066, lng: 78.5384, radius_meters: 1000 },
  { id: 'iith', name: 'Indian Institute of Technology Hyderabad', city: 'Hyderabad', state: 'Telangana', lat: 17.5930, lng: 78.1218, radius_meters: 1100 },
  { id: 'uoh', name: 'University of Hyderabad', city: 'Hyderabad', state: 'Telangana', lat: 17.4556, lng: 78.3292, radius_meters: 900 },
  { id: 'au', name: 'Andhra University', city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.7326, lng: 83.3314, radius_meters: 800 },
  { id: 'svuniv', name: 'Sri Venkateswara University', city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, radius_meters: 700 },
  // Rajasthan
  { id: 'iitj', name: 'Indian Institute of Technology Jodhpur', city: 'Jodhpur', state: 'Rajasthan', lat: 26.4770, lng: 73.1143, radius_meters: 900 },
  { id: 'mnit', name: 'Malaviya National Institute of Technology', city: 'Jaipur', state: 'Rajasthan', lat: 26.8654, lng: 75.8189, radius_meters: 700 },
  { id: 'uor', name: 'University of Rajasthan', city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.8002, radius_meters: 600 },
  // Gujarat
  { id: 'iitgn', name: 'Indian Institute of Technology Gandhinagar', city: 'Gandhinagar', state: 'Gujarat', lat: 23.2161, lng: 72.6856, radius_meters: 900 },
  { id: 'msub', name: 'Maharaja Sayajirao University of Baroda', city: 'Vadodara', state: 'Gujarat', lat: 22.3119, lng: 73.1723, radius_meters: 800 },
  { id: 'gu', name: 'Gujarat University', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0395, lng: 72.5687, radius_meters: 700 },
  // West Bengal
  { id: 'cu', name: 'University of Calcutta', city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, radius_meters: 600 },
  { id: 'iitkgp', name: 'Indian Institute of Technology Kharagpur', city: 'Kharagpur', state: 'West Bengal', lat: 22.3190, lng: 87.3091, radius_meters: 1500 },
  { id: 'ju', name: 'Jadavpur University', city: 'Kolkata', state: 'West Bengal', lat: 22.4963, lng: 88.3711, radius_meters: 700 },
  // Punjab & Haryana
  { id: 'iitro', name: 'Indian Institute of Technology Roorkee', city: 'Roorkee', state: 'Uttarakhand', lat: 29.8659, lng: 77.8961, radius_meters: 900 },
  { id: 'nit_k', name: 'NIT Kurukshetra', city: 'Kurukshetra', state: 'Haryana', lat: 29.9695, lng: 76.8783, radius_meters: 700 },
  { id: 'pu', name: 'Panjab University', city: 'Chandigarh', state: 'Punjab', lat: 30.7652, lng: 76.7713, radius_meters: 900 },
  // UP & Bihar
  { id: 'bhu', name: 'Banaras Hindu University', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.2677, lng: 82.9990, radius_meters: 1500 },
  { id: 'amu', name: 'Aligarh Muslim University', city: 'Aligarh', state: 'Uttar Pradesh', lat: 27.9148, lng: 78.0785, radius_meters: 1000 },
  { id: 'lknu', name: 'University of Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, radius_meters: 700 },
  { id: 'pu_b', name: 'Patna University', city: 'Patna', state: 'Bihar', lat: 25.6093, lng: 85.1376, radius_meters: 600 },
  { id: 'iitpatna', name: 'Indian Institute of Technology Patna', city: 'Patna', state: 'Bihar', lat: 25.5138, lng: 84.8513, radius_meters: 800 },
  // Other IITs
  { id: 'iitguw', name: 'Indian Institute of Technology Guwahati', city: 'Guwahati', state: 'Assam', lat: 26.1887, lng: 91.6927, radius_meters: 1100 },
  { id: 'iitbhu', name: 'IIT (BHU) Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.2677, lng: 82.9990, radius_meters: 800 },
  { id: 'iitindore', name: 'Indian Institute of Technology Indore', city: 'Indore', state: 'Madhya Pradesh', lat: 22.5200, lng: 75.9200, radius_meters: 900 },
  // Private & Deemed
  { id: 'mahindra', name: 'Mahindra University', city: 'Hyderabad', state: 'Telangana', lat: 17.5939, lng: 78.4833, radius_meters: 15000 },
  { id: 'bits_pilani', name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', lat: 28.3643, lng: 75.5906, radius_meters: 900 },
  { id: 'bits_goa', name: 'BITS Pilani Goa Campus', city: 'Goa', state: 'Goa', lat: 15.3980, lng: 73.8793, radius_meters: 800 },
  { id: 'bits_hyd', name: 'BITS Pilani Hyderabad Campus', city: 'Hyderabad', state: 'Telangana', lat: 17.5455, lng: 78.5718, radius_meters: 800 },
  { id: 'srm', name: 'SRM Institute of Science and Technology', city: 'Chennai', state: 'Tamil Nadu', lat: 12.8231, lng: 80.0444, radius_meters: 900 },
  { id: 'lpu', name: 'Lovely Professional University', city: 'Phagwara', state: 'Punjab', lat: 31.2553, lng: 75.7049, radius_meters: 1200 },
  { id: 'symbiosis', name: 'Symbiosis International University', city: 'Pune', state: 'Maharashtra', lat: 18.5292, lng: 73.7847, radius_meters: 800 },
  { id: 'shoolini', name: 'Shoolini University', city: 'Solan', state: 'Himachal Pradesh', lat: 30.9045, lng: 77.0967, radius_meters: 500 },
  { id: 'christ', name: 'Christ University', city: 'Bengaluru', state: 'Karnataka', lat: 12.9249, lng: 77.6017, radius_meters: 500 },
]

export type University = typeof UNIVERSITIES[0]
