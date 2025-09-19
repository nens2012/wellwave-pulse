import type { 
  UserProfile, 
  Exercise, 
  YogaPose, 
  MeditationPractice, 
  AgeGroup,
  HealthConcern,
  FitnessGoal 
} from '@/types/wellness';

// Helper function to determine age group
export function getAgeGroup(age: number): AgeGroup {
  if (age < 13) return 'child';
  if (age < 18) return 'teen';
  if (age < 30) return 'young_adult';
  if (age < 45) return 'adult';
  if (age < 60) return 'middle_aged';
  return 'senior';
}

// Exercise recommendations database
const exerciseDatabase: Record<string, Exercise[]> = {
  weight_loss: [
    {
      id: 'hiit-1',
      name: 'High-Intensity Interval Training',
      description: 'Alternating between intense bursts of activity and fixed periods of less-intense activity',
      targetMuscles: ['Full body'],
      frequency: '3-4 times per week',
      intensity: 'high',
      duration: '20-30 minutes',
      benefits: ['Burns calories efficiently', 'Boosts metabolism', 'Improves cardiovascular health'],
      precautions: ['Start slowly if beginner', 'Stay hydrated'],
    },
    {
      id: 'cardio-1',
      name: 'Brisk Walking',
      description: 'Fast-paced walking that raises heart rate',
      targetMuscles: ['Legs', 'Core'],
      frequency: 'Daily',
      intensity: 'moderate',
      duration: '30-45 minutes',
      benefits: ['Low impact', 'Improves heart health', 'Burns calories'],
    },
  ],
  weight_gain: [
    {
      id: 'strength-1',
      name: 'Compound Weightlifting',
      description: 'Multi-joint exercises like squats, deadlifts, and bench press',
      targetMuscles: ['Full body'],
      frequency: '3-4 times per week',
      intensity: 'moderate',
      sets: 3,
      reps: '8-12',
      duration: '45-60 minutes',
      benefits: ['Builds muscle mass', 'Increases strength', 'Boosts metabolism'],
      precautions: ['Focus on form', 'Progressive overload'],
    },
    {
      id: 'strength-2',
      name: 'Push-ups and Pull-ups',
      description: 'Bodyweight exercises for upper body strength',
      targetMuscles: ['Chest', 'Back', 'Arms'],
      frequency: '3 times per week',
      intensity: 'moderate',
      sets: 3,
      reps: '10-15',
      duration: '20-30 minutes',
      benefits: ['Builds upper body muscle', 'Improves functional strength'],
    },
  ],
  strength: [
    {
      id: 'resistance-1',
      name: 'Resistance Band Training',
      description: 'Using elastic bands for resistance exercises',
      targetMuscles: ['Full body'],
      frequency: '3-4 times per week',
      intensity: 'moderate',
      sets: 3,
      reps: '12-15',
      duration: '30-40 minutes',
      benefits: ['Builds strength', 'Low impact on joints', 'Portable'],
    },
  ],
  flexibility: [
    {
      id: 'stretch-1',
      name: 'Dynamic Stretching Routine',
      description: 'Active movements that stretch muscles through their range of motion',
      targetMuscles: ['Full body'],
      frequency: 'Daily',
      intensity: 'low',
      duration: '15-20 minutes',
      benefits: ['Improves flexibility', 'Reduces injury risk', 'Enhances performance'],
    },
  ],
  stamina: [
    {
      id: 'endurance-1',
      name: 'Steady-State Cardio',
      description: 'Maintaining a steady pace for extended periods',
      targetMuscles: ['Cardiovascular system', 'Legs'],
      frequency: '4-5 times per week',
      intensity: 'moderate',
      duration: '30-60 minutes',
      benefits: ['Builds endurance', 'Improves heart health', 'Burns fat'],
    },
  ],
};

// Yoga recommendations database
const yogaDatabase: Record<string, YogaPose[]> = {
  pcod: [
    {
      id: 'yoga-pcod-1',
      name: 'Butterfly Pose',
      sanskritName: 'Baddha Konasana',
      description: 'Seated pose with soles of feet together, knees bent outward',
      benefits: ['Stimulates reproductive organs', 'Reduces menstrual discomfort', 'Opens hips'],
      targetAreas: ['Hips', 'Inner thighs', 'Reproductive organs'],
      difficulty: 'beginner',
      duration: '1-3 minutes',
      breathingTechnique: 'Deep abdominal breathing',
    },
    {
      id: 'yoga-pcod-2',
      name: 'Bridge Pose',
      sanskritName: 'Setu Bandhasana',
      description: 'Lying on back, lifting hips while keeping feet and shoulders grounded',
      benefits: ['Stimulates thyroid', 'Strengthens pelvic floor', 'Reduces stress'],
      targetAreas: ['Back', 'Glutes', 'Core'],
      difficulty: 'beginner',
      duration: '30-60 seconds',
    },
  ],
  stress: [
    {
      id: 'yoga-stress-1',
      name: 'Child\'s Pose',
      sanskritName: 'Balasana',
      description: 'Kneeling forward fold with arms extended or by sides',
      benefits: ['Calms mind', 'Relieves tension', 'Gentle stretch for back'],
      targetAreas: ['Back', 'Hips', 'Shoulders'],
      difficulty: 'beginner',
      duration: '1-5 minutes',
      breathingTechnique: 'Slow, deep breathing',
    },
    {
      id: 'yoga-stress-2',
      name: 'Corpse Pose',
      sanskritName: 'Shavasana',
      description: 'Lying flat on back in complete relaxation',
      benefits: ['Deep relaxation', 'Reduces anxiety', 'Lowers blood pressure'],
      targetAreas: ['Full body relaxation'],
      difficulty: 'beginner',
      duration: '5-10 minutes',
    },
  ],
  back_pain: [
    {
      id: 'yoga-back-1',
      name: 'Cat-Cow Pose',
      sanskritName: 'Marjaryasana-Bitilasana',
      description: 'Alternating between arching and rounding the spine on hands and knees',
      benefits: ['Improves spine flexibility', 'Relieves back tension', 'Massages organs'],
      targetAreas: ['Spine', 'Core', 'Neck'],
      difficulty: 'beginner',
      duration: '5-10 rounds',
      breathingTechnique: 'Inhale on cow, exhale on cat',
    },
  ],
};

// Meditation recommendations database
const meditationDatabase: Record<string, MeditationPractice[]> = {
  stress_reduction: [
    {
      id: 'med-stress-1',
      name: 'Body Scan Meditation',
      type: 'body_scan',
      description: 'Progressive relaxation through focused attention on different body parts',
      duration: '10-20 minutes',
      frequency: 'Daily',
      benefits: ['Reduces tension', 'Improves body awareness', 'Promotes relaxation'],
      instructions: [
        'Lie down comfortably',
        'Close your eyes',
        'Focus on your breath',
        'Slowly scan from toes to head',
        'Notice sensations without judgment',
      ],
    },
    {
      id: 'med-stress-2',
      name: 'Mindful Breathing',
      type: 'breathing',
      description: 'Focused attention on the breath',
      duration: '5-15 minutes',
      frequency: 'Multiple times daily',
      benefits: ['Calms nervous system', 'Reduces anxiety', 'Improves focus'],
      instructions: [
        'Sit comfortably',
        'Focus on natural breath',
        'Count breaths if helpful',
        'Return focus when mind wanders',
      ],
    },
  ],
  weight_loss: [
    {
      id: 'med-weight-1',
      name: 'Mindful Eating Meditation',
      type: 'mindfulness',
      description: 'Bringing full awareness to the eating experience',
      duration: '10-15 minutes per meal',
      frequency: 'Every meal',
      benefits: ['Reduces overeating', 'Improves digestion', 'Enhances satisfaction'],
      instructions: [
        'Eat without distractions',
        'Observe food appearance and aroma',
        'Chew slowly and mindfully',
        'Notice hunger and fullness cues',
      ],
    },
  ],
  general_wellness: [
    {
      id: 'med-general-1',
      name: 'Loving-Kindness Meditation',
      type: 'guided',
      description: 'Cultivating compassion for self and others',
      duration: '15-20 minutes',
      frequency: '3-4 times per week',
      benefits: ['Increases positivity', 'Improves relationships', 'Reduces negative emotions'],
      instructions: [
        'Sit comfortably',
        'Start with self-compassion',
        'Extend to loved ones',
        'Include neutral people',
        'Embrace all beings',
      ],
    },
  ],
};

// Main recommendation engine
export function getExerciseRecommendations(profile: UserProfile): Exercise[] {
  const recommendations: Exercise[] = [];
  const ageGroup = getAgeGroup(profile.age);
  
  // Get exercises based on fitness goals
  profile.fitnessGoals.forEach(goal => {
    const exercises = exerciseDatabase[goal] || [];
    recommendations.push(...exercises);
  });
  
  // Adjust based on age
  if (ageGroup === 'senior' || ageGroup === 'middle_aged') {
    // Filter high-intensity exercises for older adults
    return recommendations.filter(ex => ex.intensity !== 'high').map(ex => ({
      ...ex,
      duration: ex.duration.split('-')[0] + ' minutes', // Use lower end of duration
      precautions: [...(ex.precautions || []), 'Consult doctor before starting'],
    }));
  }
  
  // Adjust for health concerns
  if (profile.healthConcerns.includes('heart_disease') || profile.healthConcerns.includes('hypertension')) {
    return recommendations.filter(ex => ex.intensity !== 'high').map(ex => ({
      ...ex,
      precautions: [...(ex.precautions || []), 'Monitor heart rate', 'Avoid sudden intense movements'],
    }));
  }
  
  return recommendations;
}

export function getYogaRecommendations(profile: UserProfile): YogaPose[] {
  const recommendations: YogaPose[] = [];
  
  // Get yoga poses based on health concerns
  profile.healthConcerns.forEach(concern => {
    const poses = yogaDatabase[concern] || [];
    recommendations.push(...poses);
  });
  
  // Add general wellness poses
  if (profile.fitnessGoals.includes('flexibility') || profile.fitnessGoals.includes('general_wellness')) {
    recommendations.push(...(yogaDatabase.stress || []));
  }
  
  // Adjust difficulty based on age
  const ageGroup = getAgeGroup(profile.age);
  if (ageGroup === 'senior') {
    return recommendations.filter(pose => pose.difficulty === 'beginner');
  }
  
  return recommendations;
}

export function getMeditationRecommendations(profile: UserProfile): MeditationPractice[] {
  const recommendations: MeditationPractice[] = [];
  
  // Get meditation practices based on goals
  if (profile.fitnessGoals.includes('stress_reduction')) {
    recommendations.push(...(meditationDatabase.stress_reduction || []));
  }
  
  if (profile.fitnessGoals.includes('weight_loss')) {
    recommendations.push(...(meditationDatabase.weight_loss || []));
  }
  
  // Add general wellness meditations
  recommendations.push(...(meditationDatabase.general_wellness || []));
  
  return recommendations;
}

// Create personalized daily plan
export function createDailyPlan(
  profile: UserProfile,
  exercises: Exercise[],
  yogaPoses: YogaPose[],
  meditations: MeditationPractice[]
) {
  const morningActivities = [];
  const afternoonActivities = [];
  const eveningActivities = [];
  
  // Morning: Light exercise or yoga
  if (yogaPoses.length > 0) {
    morningActivities.push({
      type: 'yoga' as const,
      activity: yogaPoses[0],
      duration: yogaPoses[0].duration,
    });
  }
  
  // Afternoon: Main exercise
  if (exercises.length > 0) {
    afternoonActivities.push({
      type: 'exercise' as const,
      activity: exercises[0],
      duration: exercises[0].duration,
    });
  }
  
  // Evening: Meditation
  if (meditations.length > 0) {
    eveningActivities.push({
      type: 'meditation' as const,
      activity: meditations[0],
      duration: meditations[0].duration,
    });
  }
  
  // Quick version - just 15-20 minutes total
  const quickVersion = [
    morningActivities[0],
  ].filter(Boolean);
  
  // Full version - complete routine
  const fullVersion = [
    ...morningActivities,
    ...afternoonActivities,
    ...eveningActivities,
  ].filter(Boolean);
  
  return {
    morning: morningActivities,
    afternoon: afternoonActivities,
    evening: eveningActivities,
    quickVersion,
    fullVersion,
  };
}