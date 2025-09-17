import React from 'react';
import { MarketingIntent } from '../../data/marketingIntents';

interface ContentPreviewProps {
  intent: MarketingIntent;
  platform: string;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  intent,
  platform
}) => {
  // Generate sample content based on intent and platform
  const getSampleContent = () => {
    const samples = {
      instagram: {
        awareness: `🏥 #HealthTip of the Day\n\nDid you know? Regular health check-ups can detect potential issues before they become serious.\n\n✨ Key benefits:\n• Early detection\n• Prevention focus\n• Peace of mind\n\n📅 Book your check-up today!\n\n#Healthcare #Wellness #Prevention`,
        appointment: `🗓️ Limited slots available!\n\nDon't wait until it's too late. Book your appointment this week and get:\n\n✨ Comprehensive consultation\n🏷️ Special early bird pricing\n⚡ Priority scheduling\n\nDM us or call now!\n\n#Healthcare #Booking #HealthFirst`,
        education: `📚 Understanding Your Health\n\nMyth vs Reality: Common health misconceptions debunked!\n\n❌ Myth: Antibiotics cure all infections\n✅ Fact: Only bacterial infections\n\nLearn more in our latest blog!\n\n#HealthEducation #MythBusters`,
      },
      facebook: {
        awareness: `🌟 Health Awareness Month Special 🌟\n\nJoin us for a month of health education and wellness tips. Our expert team will be sharing daily insights on:\n\n✅ Preventive care\n✅ Healthy lifestyle choices\n✅ Common health myths\n\nFollow our page for updates!`,
        appointment: `🏥 Simplified Appointment Booking\n\nWe've made it easier than ever to book your appointments:\n\n1️⃣ Click the Book Now button\n2️⃣ Choose your preferred time\n3️⃣ Confirm your slot\n\nLimited slots available this week!`,
        education: `Understanding Your Health: A Comprehensive Guide\n\nToday's Topic: Blood Pressure Management\n\n🔍 What affects blood pressure?\n💊 Natural ways to maintain healthy levels\n🥗 Diet recommendations\n\nRead more in the comments!`,
      },
    };

    return samples[platform as keyof typeof samples]?.[intent.category as keyof (typeof samples)['instagram']] || 
      'Sample content preview will be shown here based on your selection.';
  };

  return (
    <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
      <h4 className="text-sm font-medium text-sky-300 mb-2">
        Sample {platform} Content Preview
      </h4>
      <div className="bg-slate-800/50 p-3 rounded-md">
        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
          {getSampleContent()}
        </pre>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        * This is a sample preview. Generated content will be customized to your specific needs.
      </p>
    </div>
  );
};
