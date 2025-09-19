import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStore } from '@/store/user-store';
import { useToast } from '@/hooks/use-toast';
import { User, Activity, Heart, Target, ChevronRight } from 'lucide-react';
import type { HealthConcern, FitnessGoal } from '@/types/wellness';

const healthConcernOptions: { value: HealthConcern; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'pcod', label: 'PCOD/PCOS' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'stress', label: 'Stress/Anxiety' },
  { value: 'obesity', label: 'Obesity' },
  { value: 'hypertension', label: 'Hypertension' },
  { value: 'back_pain', label: 'Back Pain' },
  { value: 'thyroid', label: 'Thyroid Issues' },
  { value: 'heart_disease', label: 'Heart Disease' },
  { value: 'arthritis', label: 'Arthritis' },
];

const fitnessGoalOptions: { value: FitnessGoal; label: string }[] = [
  { value: 'weight_gain', label: 'Weight Gain' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'stamina', label: 'Build Stamina' },
  { value: 'flexibility', label: 'Improve Flexibility' },
  { value: 'strength', label: 'Build Strength' },
  { value: 'stress_reduction', label: 'Reduce Stress' },
  { value: 'general_wellness', label: 'General Wellness' },
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser } = useUserStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    age: '',
    weight: '',
    height: '',
    gender: 'male' as 'male' | 'female',
    healthConcerns: [] as HealthConcern[],
    fitnessGoals: [] as FitnessGoal[],
  });

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100; // Convert cm to m
    if (weight && height) {
      return Math.round((weight / (height * height)) * 10) / 10;
    }
    return 0;
  };

  const handleHealthConcernToggle = (concern: HealthConcern) => {
    setFormData((prev) => ({
      ...prev,
      healthConcerns: prev.healthConcerns.includes(concern)
        ? prev.healthConcerns.filter((c) => c !== concern)
        : [...prev.healthConcerns, concern],
    }));
  };

  const handleFitnessGoalToggle = (goal: FitnessGoal) => {
    setFormData((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter((g) => g !== goal)
        : [...prev.fitnessGoals, goal],
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const bmi = calculateBMI();
    updateUser({
      username: formData.username,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      bmi,
      gender: formData.gender,
      healthConcerns: formData.healthConcerns,
      fitnessGoals: formData.fitnessGoals,
      updatedAt: new Date(),
    });

    toast({
      title: "Profile Created Successfully!",
      description: "Your personalized wellness plan is ready.",
    });

    navigate('/home');
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.username && formData.age && formData.weight && formData.height;
      case 2:
        return formData.healthConcerns.length > 0;
      case 3:
        return formData.fitnessGoals.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-wellness py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Help us personalize your wellness journey
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    i <= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i === 1 && <User className="h-5 w-5" />}
                  {i === 2 && <Heart className="h-5 w-5" />}
                  {i === 3 && <Target className="h-5 w-5" />}
                </div>
                {i < 3 && (
                  <div
                    className={`mx-2 h-1 w-16 transition-colors ${
                      i < step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Health Concerns'}
              {step === 3 && 'Fitness Goals'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Tell us about yourself'}
              {step === 2 && 'Select any health concerns you have'}
              {step === 3 && 'What would you like to achieve?'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      placeholder="Enter age"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value as 'male' | 'female' })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      placeholder="Enter weight"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      placeholder="Enter height"
                      required
                    />
                  </div>
                </div>

                {formData.weight && formData.height && (
                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-sm text-muted-foreground">Your BMI</p>
                    <p className="text-2xl font-bold text-foreground">
                      {calculateBMI()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {calculateBMI() < 18.5 && 'Underweight'}
                      {calculateBMI() >= 18.5 && calculateBMI() < 25 && 'Normal weight'}
                      {calculateBMI() >= 25 && calculateBMI() < 30 && 'Overweight'}
                      {calculateBMI() >= 30 && 'Obese'}
                    </p>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {healthConcernOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={formData.healthConcerns.includes(option.value)}
                      onCheckedChange={() => handleHealthConcernToggle(option.value)}
                    />
                    <Label
                      htmlFor={option.value}
                      className="cursor-pointer font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                {fitnessGoalOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={formData.fitnessGoals.includes(option.value)}
                      onCheckedChange={() => handleFitnessGoalToggle(option.value)}
                    />
                    <Label
                      htmlFor={option.value}
                      className="cursor-pointer font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                variant="wellness"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="ml-auto"
              >
                {step === 3 ? 'Complete Setup' : 'Next'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}