import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google"; // Switched from useGoogleLogin
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !email.includes("@")) {
      toast.error("Please enter valid details");
      return;
    }
    sessionStorage.setItem("quiz_user", JSON.stringify({ username, email }));
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold tracking-tight">Quiz</h1>
        </div>

        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="font-heading text-xl">Sign In</CardTitle>
            <CardDescription>Enter your details to start the quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  try {
                    if (credentialResponse.credential) {
                      const userObject: any = jwtDecode(credentialResponse.credential);
                      
                      sessionStorage.setItem("quiz_user", JSON.stringify({ 
                        username: userObject.name, 
                        email: userObject.email 
                      }));
                      
                      toast.success(`Welcome, ${userObject.name}!`);
                      navigate("/quiz");
                    }
                  } catch (error) {
                    toast.error("Failed to process Google account data");
                  }
                }}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
                width="100%"
                size="large"
                theme="outline"
                shape="rectangular"
              />
            </div>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                or
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 font-semibold">
                Start Quiz
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}