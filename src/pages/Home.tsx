import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const progressData = [
  { day: 'Mon', weight: 70, steps: 8000 },
  { day: 'Tue', weight: 69.8, steps: 10000 },
  { day: 'Wed', weight: 69.5, steps: 7500 },
  { day: 'Thu', weight: 69.3, steps: 9000 },
  { day: 'Fri', weight: 69, steps: 11000 },
  { day: 'Sat', weight: 68.8, steps: 12000 },
  { day: 'Sun', weight: 68.5, steps: 9500 },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const [steps, setSteps] = useState(7842);
  const [waterIntake, setWaterIntake] = useState(1200);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

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
      onClick: () => {},
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
      onClick: () => {},
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
        {/* Analytics Section */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Progress
            </CardTitle>
            <CardDescription>Weekly performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="steps"
                    stroke="hsl(var(--wellness-teal))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    yAxisId="right"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Steps Counter */}
        <Card className="mb-6 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-hero p-3">
                  <Footprints className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{steps.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Steps today</p>
                </div>
              </div>
              <div className="text-right">
                <Progress value={(steps / 10000) * 100} className="mb-2 w-24" />
                <p className="text-xs text-muted-foreground">Goal: 10,000</p>
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