export interface HealthcareClient {
  id: string;
  name: string;
  type: 'clinic' | 'hospital' | 'doctor' | 'pharmacy' | 'diagnostic_center' | 'wellness_center';
  specialty: string;
  location: {
    city: string;
    state: string;
    area?: string;
  };
  brandVoice: 'professional' | 'friendly' | 'authoritative' | 'compassionate' | 'modern';
  targetDemographics: string[];
  services: string[];
  uniqueSellingPoints: string[];
  competitorAdvantages: string[];
}

export const HEALTHCARE_SPECIALTIES = [
  'Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Gynecology',
  'Neurology', 'Oncology', 'Gastroenterology', 'Pulmonology', 'Nephrology',
  'Endocrinology', 'Psychiatry', 'Ophthalmology', 'ENT', 'Radiology',
  'Pathology', 'Anesthesiology', 'Emergency Medicine', 'General Surgery',
  'Plastic Surgery', 'Dental', 'Physiotherapy', 'Nutrition', 'IVF/Fertility',
  'Homeopathy', 'Ayurveda', 'General Medicine', 'Multi-Specialty'
];

export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
  'Nagpur', 'Indore', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Coimbatore', 'Madurai', 'Guwahati', 'Chandigarh'
];

export const CLIENT_TEMPLATES: HealthcareClient[] = [
  {
    id: 'template_cardio_clinic',
    name: 'Heart Care Clinic',
    type: 'clinic',
    specialty: 'Cardiology',
    location: { city: 'Mumbai', state: 'Maharashtra', area: 'Bandra' },
    brandVoice: 'professional',
    targetDemographics: ['Adults 35-65', 'Heart patients', 'Health-conscious individuals'],
    services: ['Cardiac consultation', 'ECG', 'Echo', 'Stress tests', 'Preventive cardiology'],
    uniqueSellingPoints: ['Latest cardiac equipment', 'Experienced cardiologists', '24/7 emergency care'],
    competitorAdvantages: ['Faster appointment booking', 'Comprehensive packages', 'Insurance accepted']
  },
  {
    id: 'template_dental_clinic',
    name: 'Smile Dental Care',
    type: 'clinic',
    specialty: 'Dental',
    location: { city: 'Bangalore', state: 'Karnataka', area: 'Koramangala' },
    brandVoice: 'friendly',
    targetDemographics: ['Families with children', 'Young professionals', 'Seniors'],
    services: ['General dentistry', 'Cosmetic dentistry', 'Orthodontics', 'Implants', 'Root canal'],
    uniqueSellingPoints: ['Painless treatments', 'Advanced technology', 'Family-friendly environment'],
    competitorAdvantages: ['Flexible payment plans', 'Weekend appointments', 'Kids play area']
  },
  {
    id: 'template_ivf_center',
    name: 'New Life IVF Center',
    type: 'clinic',
    specialty: 'IVF/Fertility',
    location: { city: 'Delhi', state: 'Delhi', area: 'Greater Kailash' },
    brandVoice: 'compassionate',
    targetDemographics: ['Couples trying to conceive', 'Women 25-40', 'PCOS patients'],
    services: ['IVF', 'IUI', 'Fertility consultation', 'Egg freezing', 'Male fertility'],
    uniqueSellingPoints: ['High success rates', 'Personalized treatment', 'Emotional support'],
    competitorAdvantages: ['Transparent pricing', 'EMI options', 'Success guarantee programs']
  },
  {
    id: 'template_ortho_clinic',
    name: 'Bone & Joint Clinic',
    type: 'clinic',
    specialty: 'Orthopedics',
    location: { city: 'Pune', state: 'Maharashtra', area: 'Aundh' },
    brandVoice: 'authoritative',
    targetDemographics: ['Athletes', 'Elderly patients', 'Arthritis patients', 'Sports enthusiasts'],
    services: ['Joint replacement', 'Sports medicine', 'Arthroscopy', 'Physiotherapy', 'Pain management'],
    uniqueSellingPoints: ['Minimally invasive procedures', 'Sports injury specialists', 'Advanced rehabilitation'],
    competitorAdvantages: ['Same-day consultations', 'Insurance partnerships', 'Post-op home care']
  },
  {
    id: 'template_pediatric_clinic',
    name: 'Little Stars Pediatrics',
    type: 'clinic',
    specialty: 'Pediatrics',
    location: { city: 'Chennai', state: 'Tamil Nadu', area: 'Adyar' },
    brandVoice: 'friendly',
    targetDemographics: ['Parents with children 0-18', 'New parents', 'School-going children'],
    services: ['Well-child visits', 'Vaccinations', 'Growth monitoring', 'Developmental assessments'],
    uniqueSellingPoints: ['Child-friendly environment', 'Experienced pediatricians', '24/7 helpline'],
    competitorAdvantages: ['Flexible appointment times', 'Play area for kids', 'Parent education programs']
  },
  {
    id: 'template_eye_clinic',
    name: 'Clear Vision Eye Care',
    type: 'clinic',
    specialty: 'Ophthalmology',
    location: { city: 'Hyderabad', state: 'Telangana', area: 'Jubilee Hills' },
    brandVoice: 'professional',
    targetDemographics: ['Working professionals', 'Students', 'Elderly patients', 'Diabetic patients'],
    services: ['Comprehensive eye exams', 'Cataract surgery', 'LASIK', 'Glaucoma treatment', 'Retina care'],
    uniqueSellingPoints: ['Latest diagnostic equipment', 'Experienced surgeons', 'Quick recovery procedures'],
    competitorAdvantages: ['Online appointment booking', 'Insurance accepted', 'Follow-up care packages']
  },
  {
    id: 'template_dermatology_clinic',
    name: 'Skin & Glow Dermatology',
    type: 'clinic',
    specialty: 'Dermatology',
    location: { city: 'Kolkata', state: 'West Bengal', area: 'Salt Lake' },
    brandVoice: 'modern',
    targetDemographics: ['Young adults 20-40', 'Beauty-conscious individuals', 'Acne patients', 'Anti-aging seekers'],
    services: ['Acne treatment', 'Anti-aging procedures', 'Laser treatments', 'Skin consultations', 'Cosmetic procedures'],
    uniqueSellingPoints: ['Advanced laser technology', 'Customized treatment plans', 'Skincare education'],
    competitorAdvantages: ['Results-oriented approach', 'Flexible payment options', 'Satisfaction guarantee']
  },
  {
    id: 'template_gynecology_clinic',
    name: 'Women\'s Wellness Center',
    type: 'clinic',
    specialty: 'Gynecology',
    location: { city: 'Ahmedabad', state: 'Gujarat', area: 'Satellite' },
    brandVoice: 'compassionate',
    targetDemographics: ['Women 18-60', 'Pregnant women', 'Post-menopausal women', 'PCOS patients'],
    services: ['Prenatal care', 'Gynecological consultations', 'Family planning', 'Menopause management', 'Cancer screening'],
    uniqueSellingPoints: ['Women-only environment', 'Holistic approach', 'Latest technology', 'Emotional support'],
    competitorAdvantages: ['Comfortable atmosphere', 'Extended hours', 'Comprehensive women\'s health packages']
  },
  {
    id: 'template_neurology_clinic',
    name: 'Brain & Nerve Center',
    type: 'clinic',
    specialty: 'Neurology',
    location: { city: 'Jaipur', state: 'Rajasthan', area: 'Malviya Nagar' },
    brandVoice: 'authoritative',
    targetDemographics: ['Headache patients', 'Stroke survivors', 'Parkinson\'s patients', 'Epilepsy patients'],
    services: ['Neurological consultations', 'EEG/ECG', 'Stroke management', 'Movement disorder treatment', 'Headache clinic'],
    uniqueSellingPoints: ['Expert neurologists', 'Advanced diagnostics', 'Multidisciplinary approach', 'Research-backed treatments'],
    competitorAdvantages: ['Quick diagnosis', 'Personalized treatment plans', 'Support groups', 'Telemedicine follow-ups']
  },
  {
    id: 'template_multi_specialty_hospital',
    name: 'City General Hospital',
    type: 'hospital',
    specialty: 'Multi-Specialty',
    location: { city: 'Surat', state: 'Gujarat', area: 'Adajan' },
    brandVoice: 'professional',
    targetDemographics: ['Local community', 'Emergency patients', 'Insurance holders', 'Corporate employees'],
    services: ['Emergency care', 'Surgery', 'Internal medicine', 'Diagnostics', 'Pharmacy', 'Ambulance service'],
    uniqueSellingPoints: ['24/7 emergency care', 'Modern facilities', 'Experienced medical team', 'Comprehensive services'],
    competitorAdvantages: ['Affordable pricing', 'Quick admissions', 'Quality care standards', 'Patient-centered approach']
  },
  {
    id: 'template_psychiatry_clinic',
    name: 'Mind Wellness Clinic',
    type: 'clinic',
    specialty: 'Psychiatry',
    location: { city: 'Lucknow', state: 'Uttar Pradesh', area: 'Gomti Nagar' },
    brandVoice: 'compassionate',
    targetDemographics: ['Young adults', 'Working professionals', 'Students', 'Families seeking mental health support'],
    services: ['Mental health consultations', 'Depression treatment', 'Anxiety management', 'Couples therapy', 'Stress management'],
    uniqueSellingPoints: ['Confidential environment', 'Evidence-based treatments', 'Holistic approach', 'Patient education'],
    competitorAdvantages: ['Flexible scheduling', 'Online consultations', 'Affordable therapy packages', 'Supportive community']
  },
  {
    id: 'template_physiotherapy_center',
    name: 'Active Life Physiotherapy',
    type: 'clinic',
    specialty: 'Physiotherapy',
    location: { city: 'Coimbatore', state: 'Tamil Nadu', area: 'RS Puram' },
    brandVoice: 'friendly',
    targetDemographics: ['Sports enthusiasts', 'Post-surgery patients', 'Elderly patients', 'Office workers with pain'],
    services: ['Sports physiotherapy', 'Post-operative rehab', 'Pain management', 'Ergonomic consultations', 'Fitness training'],
    uniqueSellingPoints: ['Experienced therapists', 'Modern equipment', 'Personalized programs', 'Home visit options'],
    competitorAdvantages: ['Quick pain relief', 'Long-term results', 'Flexible timing', 'Package deals']
  }
];

export const AUDIENCE_PRESETS = [
  {
    id: 'young_professionals',
    label: 'Young Professionals (25-35)',
    description: 'Tech-savvy, busy, health-conscious urban professionals',
    characteristics: ['Time-constrained', 'Digital natives', 'Prevention-focused', 'Quality-seeking'],
    preferredChannels: ['Instagram', 'LinkedIn', 'WhatsApp'],
    communicationStyle: 'Modern, efficient, data-driven'
  },
  {
    id: 'families_with_children',
    label: 'Families with Children',
    description: 'Parents concerned about family health and wellness',
    characteristics: ['Safety-focused', 'Value-conscious', 'Research-oriented', 'Community-driven'],
    preferredChannels: ['Facebook', 'WhatsApp', 'Google Business'],
    communicationStyle: 'Caring, detailed, trustworthy'
  },
  {
    id: 'senior_citizens',
    label: 'Senior Citizens (55+)',
    description: 'Mature adults with specific healthcare needs',
    characteristics: ['Experience-valued', 'Relationship-focused', 'Traditional', 'Health-priority'],
    preferredChannels: ['Facebook', 'WhatsApp', 'Google Business'],
    communicationStyle: 'Respectful, clear, personal'
  },
  {
    id: 'chronic_patients',
    label: 'Chronic Disease Patients',
    description: 'Individuals managing long-term health conditions',
    characteristics: ['Support-seeking', 'Information-hungry', 'Cost-conscious', 'Compliance-focused'],
    preferredChannels: ['Facebook', 'WhatsApp', 'Blog'],
    communicationStyle: 'Empathetic, educational, encouraging'
  },
  {
    id: 'health_enthusiasts',
    label: 'Health & Wellness Enthusiasts',
    description: 'Proactive individuals focused on preventive healthcare',
    characteristics: ['Trend-aware', 'Lifestyle-focused', 'Social-sharing', 'Innovation-adopting'],
    preferredChannels: ['Instagram', 'Facebook', 'LinkedIn'],
    communicationStyle: 'Inspiring, trendy, evidence-based'
  }
];
