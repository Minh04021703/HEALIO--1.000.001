import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { HealthRecord, Appointment } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, Calendar, Bell } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: healthRecords } = useQuery<HealthRecord[]>({
    queryKey: [`/api/health-records/${user?.id}`],
  });

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: [`/api/appointments/${user?.id}`],
  });

  const upcomingAppointments = appointments?.filter(
    (apt) => new Date(apt.date) > new Date()
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to Healio</h1>
        <p className="text-muted-foreground">Your personal health management platform</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-1 bg-blue-500 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Vitals Today</CardTitle>
            <p className="text-sm opacity-80">Last updated: 2 hours ago</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Heart Rate</span>
                <span className="text-xl">72 bpm</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Blood Pressure</span>
                <span className="text-xl">120/80</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-sm text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">AI Health Assistant</CardTitle>
            <Brain className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">24/7 Support</p>
            <p className="text-sm text-muted-foreground">Ask health-related questions anytime</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Health Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Blood Test Results</p>
                  <p className="text-sm text-muted-foreground">Lab Results</p>
                </div>
                <p className="text-sm text-muted-foreground">Yesterday</p>
              </div>
              <div className="flex justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Annual Checkup</p>
                  <p className="text-sm text-muted-foreground">Examination</p>
                </div>
                <p className="text-sm text-muted-foreground">1 week ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Medication Reminder</p>
                  <p className="text-sm text-muted-foreground">Take your evening medication</p>
                </div>
                <p className="text-sm text-muted-foreground">30m ago</p>
              </div>
              <div className="flex justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Appointment Confirmed</p>
                  <p className="text-sm text-muted-foreground">Dr. Smith - Tomorrow 10:00 AM</p>
                </div>
                <p className="text-sm text-muted-foreground">2h ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}