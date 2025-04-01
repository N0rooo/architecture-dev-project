import { Suspense } from "react";
import LoginForm from "./_views/authForm";

export default async function LoginPage() {

  return (
    <div className="flex justify-center items-center h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}