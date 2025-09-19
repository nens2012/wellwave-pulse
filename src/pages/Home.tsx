import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadialProgress } from '@/components/RadialProgress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUserStore } from '@/store/user-store';
import {
  Activity,
  Droplets,
  Camera,
  Heart,
  Home as HomeIcon,
  Calendar,
  Bot,
  CalendarDays,
  TrendingUp,
  Footprints,
  ChefHat,
  TestTube,
  LogOut,
} from 'lucide-react';
// Removed line chart in favor of rounded progress

// No chart data needed for radial display

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const [steps, setSteps] = useState(0);
  const [needsPermission, setNeedsPermission] = useState(false);
  const lastMagRef = useRef<number>(0);
  const lastStepAtRef = useRef<number>(0);
  const motionHandlerRef = useRef<(e: DeviceMotionEvent) => void>();
  const [stepGoal, setStepGoal] = useState<number>(() => {
    const saved = localStorage.getItem('stepGoal');
    return saved ? parseInt(saved, 10) || 6000 : 6000;
  });
  const [waterIntake, setWaterIntake] = useState(1200);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    try {
      localStorage.setItem('stepGoal', String(stepGoal));
    } catch {}
  }, [stepGoal]);

  // Daily reset and persistence
  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    try {
      const stored = localStorage.getItem('steps:data');
      if (stored) {
        const parsed = JSON.parse(stored) as { date: string; steps: number };
        if (parsed.date === todayKey) {
          setSteps(parsed.steps || 0);
        } else {
          setSteps(0);
          localStorage.setItem('steps:data', JSON.stringify({ date: todayKey, steps: 0 }));
        }
      } else {
        localStorage.setItem('steps:data', JSON.stringify({ date: todayKey, steps: 0 }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem('steps:data', JSON.stringify({ date: todayKey, steps }));
    } catch {}
  }, [steps]);

  // Live step detection using accelerometer (auto-start if possible)
  const attachMotion = () => {
    const minIntervalMs = 350;
    const threshold = 2.2;
    if (motionHandlerRef.current) return; // already attached
    motionHandlerRef.current = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;
      const mag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      const delta = Math.abs(mag - (lastMagRef.current || mag));
      const now = Date.now();
      if (delta > threshold && now - (lastStepAtRef.current || 0) > minIntervalMs) {
        lastStepAtRef.current = now;
        setSteps((s) => s + 1);
      }
      lastMagRef.current = mag;
    };
    window.addEventListener('devicemotion', motionHandlerRef.current as EventListener);
  };

  useEffect(() => {
    let cleanup = () => {};
    const init = async () => {
      try {
        const DM: any = (window as any).DeviceMotionEvent;
        if (DM && typeof DM.requestPermission === 'function') {
          const res = await DM.requestPermission();
          if (res === 'granted') {
            attachMotion();
          } else {
            setNeedsPermission(true);
          }
        } else {
          attachMotion();
        }
      } catch {
        setNeedsPermission(true);
      }
      cleanup = () => {
        if (motionHandlerRef.current) {
          window.removeEventListener('devicemotion', motionHandlerRef.current as EventListener);
          motionHandlerRef.current = undefined;
        }
      };
    };
    init();
    return () => cleanup();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const features = [
    {
      icon: Droplets,
      title: 'Water Reminder',
      description: `${waterIntake}/2000 ml`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      onClick: () => setWaterIntake(waterIntake + 250),
    },
    {
      icon: Camera,
      title: 'Food Scanner',
      description: 'Track calories',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      onClick: () => navigate('/food-scanner'),
    },
    {
      icon: TestTube,
      title: 'Health Tests',
      description: 'Book tests',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      onClick: () => {},
    },
    {
      icon: ChefHat,
      title: 'Healthy Recipes',
      description: 'Discover meals',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      onClick: () => {},
    },
    {
      icon: Heart,
      title: 'BP Measurement',
      description: 'Track vitals',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      onClick: () => navigate('/bp'),
    },
    {
      icon: Activity,
      title: 'Workout Plan',
      description: 'View routine',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      onClick: () => navigate('/dashboard'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-wellness">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Welcome back,</p>
              <p className="text-lg font-bold">{user.username}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Analytics Section - Rounded consistency progress */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Progress
            </CardTitle>
            <CardDescription>Good, consistent progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <RadialProgress value={82} size={140} color="#10b981" />
                <div className="text-sm text-muted-foreground">Consistency: Good</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps Counter - Rounded with customizable goal + live sensor */}
        <Card className="mb-6 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-hero p-3">
                  <Footprints className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{steps.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Steps today</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <RadialProgress value={Math.min((steps / Math.max(stepGoal, 1)) * 100, 100)} size={80} color="#0ea5e9" />
                  <span className="mt-1 text-xs text-muted-foreground">{steps}/{stepGoal}</span>
                </div>
                <div className="w-28">
                  <label htmlFor="goal" className="block text-xs text-muted-foreground mb-1">Step goal</label>
                  <Input
                    id="goal"
                    type="number"
                    min={0}
                    value={stepGoal}
                    onChange={(e) => setStepGoal(Math.max(0, parseInt(e.target.value || '0', 10)))}
                  />
                </div>
                {needsPermission ? (
                  <div className="flex flex-col items-end">
                    <label className="block text-xs text-muted-foreground mb-1">Motion access</label>
                    <Button size="sm" variant="outline" onClick={() => {
                      const DM: any = (window as any).DeviceMotionEvent;
                      if (DM && typeof DM.requestPermission === 'function') {
                        DM.requestPermission().then((res: string) => {
                          if (res === 'granted') {
                            setNeedsPermission(false);
                            attachMotion();
                          }
                        }).catch(() => {});
                      }
                    }}>Enable</Button>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Tiles */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="cursor-pointer shadow-card transition-all hover:scale-105 hover:shadow-glow"
              onClick={feature.onClick}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className={`mb-3 rounded-full ${feature.bgColor} p-3`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-sm font-medium">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-card">
        <div className="flex justify-around py-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col gap-1 ${activeTab === 'home' ? 'text-primary' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <HomeIcon className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col gap-1 ${activeTab === 'schedule' ? 'text-primary' : ''}`}
            onClick={() => {
              setActiveTab('schedule');
              navigate('/dashboard');
            }}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Schedule</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col gap-1 ${activeTab === 'ai' ? 'text-primary' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <Bot className="h-5 w-5" />
            <span className="text-xs">AI Doctor</span>
          </Button>
          {user.gender === 'female' && (
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col gap-1 ${activeTab === 'period' ? 'text-primary' : ''}`}
              onClick={() => setActiveTab('period')}
            >
              <CalendarDays className="h-5 w-5" />
              <span className="text-xs">Period</span>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}