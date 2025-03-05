import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/use-auth";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";

import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import HealthRecords from "@/pages/health-records";
import AIAssistant from "@/pages/ai-assistant";
import Appointments from "@/pages/appointments";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/app-layout";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={() => (
        <AppLayout>
          <Dashboard />
        </AppLayout>
      )} />
      <ProtectedRoute path="/health-records" component={() => (
        <AppLayout>
          <HealthRecords />
        </AppLayout>
      )} />
      <ProtectedRoute path="/ai-assistant" component={() => (
        <AppLayout>
          <AIAssistant />
        </AppLayout>
      )} />
      <ProtectedRoute path="/appointments" component={() => (
        <AppLayout>
          <Appointments />
        </AppLayout>
      )} />
      <ProtectedRoute path="/profile" component={() => (
        <AppLayout>
          <Profile />
        </AppLayout>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;