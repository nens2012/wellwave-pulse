import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MotivationalSlider } from '@/components/MotivationalSlider';
import { useUserStore } from '@/store/user-store';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUser = useUserStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - replace with actual authentication
    setTimeout(() => {
      if (formData.email && formData.password) {
        const mockUser = {
          id: '1',
          username: formData.email.split('@')[0],
          email: formData.email,
          age: 0,
          weight: 0,
          height: 0,
          bmi: 0,
          gender: 'male' as const,
          healthConcerns: [],
          fitnessGoals: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setUser(mockUser);
        toast({
          title: "Welcome to Wellness Wave!",
          description: "Let's set up your profile to get personalized recommendations.",
        });
        navigate('/profile-setup');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Login",
      description: "Google authentication will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <div className="flex min-h-screen">
        {/* Left Side - Motivational Slider (Desktop) / Top (Mobile) */}
        <div className="hidden lg:block lg:w-1/2">
          <MotivationalSlider />
        </div>

        {/* Mobile Slider */}
        <div className="h-[40vh] lg:hidden">
          <MotivationalSlider />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-1 items-center justify-center px-4 py-8 lg:w-1/2">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground">
                Wellness Wave
              </h1>
              <p className="mt-2 text-muted-foreground">
                Your journey to wellness begins here
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email or Phone Number</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="wellness"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80 hover:underline"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}