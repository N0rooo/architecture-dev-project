import { Suspense } from 'react';
import LoginForm from './_views/authForm';

export default async function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Suspense fallback={<div>Chargement...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
