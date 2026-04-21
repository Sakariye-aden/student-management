import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { Loader } from "lucide-react";

import api from "../../lib/api/apiStore";
import useAuthStore from "../../lib/store/useStore";
import { extractErrorMessages } from "../../utility/errorUtility";

type FormValueType = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setformData] = useState<FormValueType>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  //  mutatation
  const loginMutation = useMutation({
    mutationFn: async (credentials: FormValueType) => {
      const response = await api.post("/Auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
        
      if (data) {
        setAuth(data);
  
        const roleRoutes: Record<string, string> = {
          principle: "/principal",
          "vice principle": "/vice-principal",
          "dean of student": "/dean",
          teacher: "/teacher",
          student: "/student",
        };

        const route = roleRoutes[data.role.toLowerCase()];
        if (route) {
          //  console.log('Route', route);
          navigate(route);
        } 
      }
    },
    onError: (error) => {
      setError(extractErrorMessages(error));
    },
  });

  //  onChange
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setformData({ ...formData, [name]: value });
  };

  //  onSubmit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("all fields are required");
      return;
    }

    // login mutation
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <Card className="rounded-md bg-background">
      <CardHeader className="text-center ">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            {error && (
              <p className="bg-destructive/50 p-2 rounded-md">{error}</p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-medium text-md">
                Email
              </Label>
              <Input
                className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-medium text-md">
                password
              </Label>
              <Input
                className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="***********"
              />
            </div>

            <Button className="p-2 rounded-md"
            //  disabled={error?.message?.error == "too"}
            >
              {loginMutation.isPending ? (
                <span className="flex justify-center items-center gap-2">
                  <Loader className="animate-spin" /> signing in...
                </span>
              ) : (
                "sign in"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center space-x-2">
        <span>Don't have an account ?</span>
        <span
          onClick={() => navigate("/register")}
          className="text-red-500 cursor-pointer"
        >
          sign up{" "}
        </span>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
