export interface MarketingIntent {
  id: string;
  category: 'awareness' | 'appointment' | 'education' | 'promotion' | 'emergency' | 'engagement';
  title: string;
  description: string;
  targetOutcomes: string[];
  contentTypes: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  seasonality?: string;
  compliance: string[];
}

export const MARKETING_INTENTS: MarketingIntent[] = [
  {
    id: 'health_awareness',
    category: 'awareness',
    title: '🎯 Health Awareness Campaign',
    description: 'Educate audience about specific health conditions or preventive care',
    targetOutcomes: ['Increase health knowledge', 'Build brand authority', 'Drive engagement'],
    contentTypes: ['Educational posts', 'Infographics', 'Health tips', 'Myth busters'],
    urgencyLevel: 'medium',
    seasonality: 'Year-round with seasonal focus',
    compliance: ['Medical accuracy', 'No fear-mongering', 'Cite credible sources']
  },
  {
    id: 'appointment_booking',
    category: 'appointment',
    title: '📅 Drive Appointment Bookings',
    description: 'Encourage patients to schedule consultations or procedures',
    targetOutcomes: ['Increase appointments', 'Fill schedule gaps', 'Convert leads'],
    contentTypes: ['Call-to-action posts', 'Availability updates', 'Booking incentives'],
    urgencyLevel: 'high',
    compliance: ['Clear pricing', 'No unrealistic promises', 'Transparent process']
  },
  {
    id: 'new_service_launch',
    category: 'promotion',
    title: '🚀 New Service/Treatment Launch',
    description: 'Announce and promote new medical services or treatments',
    targetOutcomes: ['Service awareness', 'Early adopters', 'Competitive advantage'],
    contentTypes: ['Announcement posts', 'Behind-the-scenes', 'Expert interviews'],
    urgencyLevel: 'high',
    compliance: ['Regulatory approval', 'Evidence-based claims', 'Cost transparency']
  },
  {
    id: 'patient_testimonials',
    category: 'engagement',
    title: '💝 Patient Success Stories',
    description: 'Share patient testimonials and success stories (with consent)',
    targetOutcomes: ['Build trust', 'Social proof', 'Emotional connection'],
    contentTypes: ['Video testimonials', 'Before/after stories', 'Thank you posts'],
    urgencyLevel: 'medium',
    compliance: ['Patient consent', 'Privacy protection', 'Authentic stories']
  },
  {
    id: 'emergency_communication',
    category: 'emergency',
    title: '🚨 Emergency/Urgent Communication',
    description: 'Communicate urgent health information or emergency services',
    targetOutcomes: ['Immediate awareness', 'Public safety', 'Emergency response'],
    contentTypes: ['Alert posts', 'Emergency procedures', 'Contact information'],
    urgencyLevel: 'high',
    compliance: ['Accuracy critical', 'Clear instructions', 'Official sources']
  },
  {
    id: 'seasonal_health',
    category: 'awareness',
    title: '🌟 Seasonal Health Tips',
    description: 'Provide health advice relevant to current season or events',
    targetOutcomes: ['Timely relevance', 'Preventive care', 'Engagement'],
    contentTypes: ['Seasonal tips', 'Weather-related advice', 'Festival health'],
    urgencyLevel: 'medium',
    seasonality: 'Season-specific',
    compliance: ['Regional relevance', 'Cultural sensitivity', 'Practical advice']
  },
  {
    id: 'community_engagement',
    category: 'engagement',
    title: '🤝 Community Health Engagement',
    description: 'Engage with local community on health initiatives',
    targetOutcomes: ['Community presence', 'Social responsibility', 'Local awareness'],
    contentTypes: ['Community events', 'Health camps', 'Local partnerships'],
    urgencyLevel: 'low',
    compliance: ['Community consent', 'Inclusive messaging', 'Local regulations']
  }
];

export const CONTENT_GOALS = [
  'Increase brand awareness',
  'Drive appointment bookings',
  'Educate patients',
  'Build trust and credibility',
  'Promote new services',
  'Engage community',
  'Emergency communication',
  'Seasonal relevance',
  'Patient retention',
  'Competitive positioning'
];
