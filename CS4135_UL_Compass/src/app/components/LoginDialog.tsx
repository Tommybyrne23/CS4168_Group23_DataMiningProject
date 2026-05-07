import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login, register } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [loginCaptchaToken, setLoginCaptchaToken] = useState<string | null>(null);
  const [registerCaptchaToken, setRegisterCaptchaToken] = useState<string | null>(null);
  
  const loginRecaptchaRef = useRef<ReCAPTCHA>(null);
  const registerRecaptchaRef = useRef<ReCAPTCHA>(null);

  // Get reCAPTCHA site key from environment variables
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginCaptchaToken) {
      toast.error("Please complete the security check");
      return;
    }
    
    const success = await login(loginEmail, loginPassword);
    if (success) {
      toast.success("Successfully logged in!");
      onOpenChange(false);
      setLoginEmail("");
      setLoginPassword("");
      setLoginCaptchaToken(null);
      loginRecaptchaRef.current?.reset();
    } else {
      toast.error("Login failed. Please try again.");
      setLoginCaptchaToken(null);
      loginRecaptchaRef.current?.reset();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerCaptchaToken) {
      toast.error("Please complete the security check");
      return;
    }
    
    const success = await register(registerEmail, registerPassword, registerName);
    if (success) {
      toast.success("Account created successfully!");
      onOpenChange(false);
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterName("");
      setRegisterCaptchaToken(null);
      registerRecaptchaRef.current?.reset();
    } else {
      toast.error("Registration failed. Please try again.");
      setRegisterCaptchaToken(null);
      registerRecaptchaRef.current?.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to UL Compass</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your.email@ul.ie"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={loginRecaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => setLoginCaptchaToken(token)}
                  onExpired={() => setLoginCaptchaToken(null)}
                />
              </div>
              
              <Button type="submit" className="w-full bg-[#00843D] hover:bg-[#006B2D]">
                Login
              </Button>
              <p className="text-xs text-slate-500 text-center">
                Login to save your favorite locations
              </p>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your.email@ul.ie"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={registerRecaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRegisterCaptchaToken(token)}
                  onExpired={() => setRegisterCaptchaToken(null)}
                />
              </div>
              
              <Button type="submit" className="w-full bg-[#00843D] hover:bg-[#006B2D]">
                Create Account
              </Button>
              <p className="text-xs text-slate-500 text-center">
                Create an account to access personalized features
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}