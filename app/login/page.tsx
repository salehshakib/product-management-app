"use client";

import { api } from "@/api/endpoints/api";
import { showToastNotification } from "@/components/toast/show-toast-notification";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePostData } from "@/hooks/mutations/use-post-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const { mutate, isPending } = usePostData({
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem("token", data?.token);
      router.push("/");
      showToastNotification({
        message: "Logged in successfully",
        variant: "success",
      });
    },
    doNotShowToast: true,
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutate({
      url: api.auth,
      postData: values,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your email to access the dashboard
          </p>
        </div>

        <div className="mt-8 bg-card py-8 px-6 shadow-lg rounded-lg border border-border sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Project prepared for{" "}
            <span className="font-semibold text-foreground">BitechX LLC</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Developed by{" "}
            <span className="font-semibold text-foreground">Saleh Shakib</span>
          </p>
        </div>
      </div>
    </div>
  );
}
