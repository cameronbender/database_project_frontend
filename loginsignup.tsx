import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

interface LoginSignupPageProps {
  setIsAuthenticated: (authenticated: boolean) => void;
}

export default function LoginSignupPage({ setIsAuthenticated }: LoginSignupPageProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (type: 'login' | 'signup') => {
    // Basic validation
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      if (type === 'login') {
        // Check for valid username/password combinations
        const validUsers = [
          { username: 'cameron', password: 'bender' },
          { username: 'joshua', password: 'schaff' },
          { username: 'isaac', password: 'campbell' }
        ];

        const isValidUser = validUsers.some(user => 
          user.username === username && user.password === password
        );

        if (isValidUser) {
          setIsAuthenticated(true);
          toast.success('Login successful');
          router.push('/');
        } else {
          toast.error('Invalid username or password');
        }
      } else if (type === 'signup') {
        // Signup validation
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        // Simulated signup logic - replace with actual registration
        if (username.length >= 3 && password.length >= 6) {
          setIsAuthenticated(true);
          toast.success('Signup successful');
          router.push('/');
        } else {
          toast.error('Username must be at least 3 characters, password at least 6 characters');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Please log in or sign up to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input 
                    id="login-username"
                    type="text" 
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password"
                    type="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleSubmit('login')}
                >
                  Log In
                </Button>
              </div>
            </TabsContent>
            
            {/* Signup Tab */}
            <TabsContent value="signup">
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input 
                    id="signup-username"
                    type="text" 
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password"
                    type="password" 
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input 
                    id="signup-confirm-password"
                    type="password" 
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleSubmit('signup')}
                >
                  Sign Up
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}