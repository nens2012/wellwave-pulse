import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/user-store';
import {
  getExerciseRecommendations,
  getYogaRecommendations,
  getMeditationRecommendations,
  createDailyPlan,
} from '@/lib/wellness-recommendations';
import { Activity, Heart, Brain, ArrowLeft, Clock, Zap } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const exercises = getExerciseRecommendations(user);
    const yoga = getYogaRecommendations(user);
    const meditation = getMeditationRecommendations(user);
    const dailyPlan = createDailyPlan(user, exercises, yoga, meditation);

    setRecommendations({
      exercises,
      yoga,
      meditation,
      dailyPlan,
    });
  }, [user, navigate]);

  if (!user || !recommendations) return null;

  return (
    <div className="min-h-screen bg-gradient-wellness pb-20">
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Your Wellness Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily">Daily Plan</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="yoga">Yoga</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your personalized wellness routine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['morning', 'afternoon', 'evening'].map((time) => (
                  <div key={time}>
                    <h3 className="mb-2 font-semibold capitalize">{time}</h3>
                    {recommendations.dailyPlan[time].map((activity: any, idx: number) => (
                      <div key={idx} className="mb-2 rounded-lg bg-accent p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{activity.activity.name}</span>
                          <Badge variant="outline">{activity.duration}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercise" className="space-y-4">
            {recommendations.exercises.map((exercise: any) => (
              <Card key={exercise.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {exercise.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{exercise.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{exercise.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>Intensity: {exercise.intensity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="yoga" className="space-y-4">
            {recommendations.yoga.map((pose: any) => (
              <Card key={pose.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    {pose.name}
                  </CardTitle>
                  <CardDescription>{pose.sanskritName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{pose.description}</p>
                  <Badge>{pose.difficulty}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="meditation" className="space-y-4">
            {recommendations.meditation.map((practice: any) => (
              <Card key={practice.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {practice.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{practice.description}</p>
                  <Badge variant="outline">{practice.duration}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}