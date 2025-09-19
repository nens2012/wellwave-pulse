export interface UserProfile {
  id: string;
  username: string;
  email: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  bmi: number;
  gender: 'male' | 'female';
  healthConcerns: HealthConcern[];
  fitnessGoals: FitnessGoal[];
  createdAt: Date;
  updatedAt: Date;
}

export type HealthConcern = 
  | 'pcod' 
  | 'diabetes' 
  | 'stress' 
  | 'obesity' 
  | 'hypertension' 
  | 'back_pain'
  | 'thyroid'
  | 'heart_disease'
  | 'arthritis'
  | 'none';

export type FitnessGoal = 
  | 'weight_gain' 
  | 'weight_loss' 
  | 'stamina' 
  | 'flexibility' 
  | 'strength' 
  | 'stress_reduction' 
  | 'general_wellness';

export type AgeGroup = 
  | 'child' 
  | 'teen' 
  | 'young_adult' 
  | 'adult' 
  | 'middle_aged' 
  | 'senior';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  targetMuscles: string[];
  frequency: string;
  intensity: 'low' | 'moderate' | 'high';
  sets?: number;
  reps?: string;
  duration: string;
  benefits: string[];
  precautions?: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  benefits: string[];
  targetAreas: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  breathingTechnique?: string;
  modifications?: string[];
  contraindications?: string[];
  imageUrl?: string;
}

export interface MeditationPractice {
  id: string;
  name: string;
  type: 'mindfulness' | 'guided' | 'mantra' | 'body_scan' | 'visualization' | 'breathing';
  description: string;
  duration: string;
  frequency: string;
  benefits: string[];
  instructions: string[];
  audioUrl?: string;
}

export interface WellnessPlan {
  id: string;
  userId: string;
  date: Date;
  morning: WellnessActivity[];
  afternoon: WellnessActivity[];
  evening: WellnessActivity[];
  quickVersion: WellnessActivity[];
  fullVersion: WellnessActivity[];
}

export interface WellnessActivity {
  type: 'exercise' | 'yoga' | 'meditation';
  activity: Exercise | YogaPose | MeditationPractice;
  duration: string;
  completed?: boolean;
}

export interface HealthMetrics {
  date: Date;
  weight?: number;
  steps?: number;
  waterIntake?: number; // in ml
  sleepHours?: number;
  caloriesBurned?: number;
  mood?: 'excellent' | 'good' | 'neutral' | 'stressed' | 'poor';
}

export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category: string;
}