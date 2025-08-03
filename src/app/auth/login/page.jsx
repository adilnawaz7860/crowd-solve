"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import { useAuth } from "../../../hooks/useAuth";



export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth()
  const router = useRouter();
  const { refetchUser } = useContext(AuthContext);

 

const formik = useFormik({
  initialValues: {
 
    email: "",
    password: "",
  },
    validationSchema: Yup.object({
     
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
  onSubmit: async (values) => {
  setLoading(true);
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data?.message || "Login failed");
      return;
    }

   
    sessionStorage.setItem("token", data.token);

    toast.success("Logged In Successfully");
    
    await refetchUser();
    router.push("/");

  } catch (err) {
    console.error("login error:", err);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
},



  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (userId && token) {
      router.push("/");
    }
  }, [userId, router]);


  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full border border-gray-300 max-w-sm space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-sm text-muted-foreground">Enter Your Credentials</p>
        </div>


    

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="min-h-[1.25rem]">
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="min-h-[1.25rem]">
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging In...
            </>
          ) : (
            "Login"
          )}
        </Button>

           <p className="text-center text-sm text-muted-foreground">
          Do not have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
