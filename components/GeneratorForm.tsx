
import React, { useState } from 'react';
import { ContentGenerationParams } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea'; 
import { Lightbulb } from 'lucide-react';

interface GeneratorFormProps {
  onSubmit: (params: ContentGenerationParams) => void;
  isLoading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const [params, setParams] = useState<ContentGenerationParams>({
    specialty: '',
    location: '',
    targetAudience: '',
    topic: '',
    tone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation for required fields
    if (!params.specialty || !params.location || !params.targetAudience) {
      alert("Please fill in Specialty, Location, and Target Audience fields."); // Simple validation
      return;
    }
    onSubmit(params);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-sky-300 mb-6 flex items-center">
        <Lightbulb className="mr-3 h-7 w-7 text-yellow-400" />
        Content Generation Hub
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Client's Specialty"
          name="specialty"
          value={params.specialty}
          onChange={handleChange}
          placeholder="e.g., Cardiology, Dermatology, Pediatrics"
          required
        />
        <Input
          label="Location Focus"
          name="location"
          value={params.location}
          onChange={handleChange}
          placeholder="e.g., Jayanagar, Bangalore; South Delhi"
          required
        />
        <Textarea
          label="Target Audience Description"
          name="targetAudience"
          value={params.targetAudience}
          onChange={handleChange}
          placeholder="e.g., New mothers, senior citizens (45+), IT professionals"
          required
          rows={3}
        />
        <Input
          label="Topic / Theme (Optional)"
          name="topic"
          id="topic"
          value={params.topic}
          onChange={handleChange}
          placeholder="e.g., Women's Day, Monsoon Health, New Service Launch"
          containerClassName="mt-1"
        />
        <Input
          label="Desired Tone (Optional)"
          name="tone"
          id="tone"
          value={params.tone}
          onChange={handleChange}
          placeholder="e.g., Celebratory, Informative, Empathetic, Urgent"
          containerClassName="mt-1"
        />
        <div className="pt-3">
          <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
            {isLoading ? 'Generating...' : '✨ Generate All Content ✨'}
          </Button>
        </div>
      </form>
    </div>
  );
};