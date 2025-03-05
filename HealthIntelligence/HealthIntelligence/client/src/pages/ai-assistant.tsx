import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Brain, ChevronRight, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

type AIResponse = {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
};

export default function AIAssistant() {
  const { toast } = useToast();
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);

  const form = useForm({
    defaultValues: {
      symptoms: "",
    },
  });

  const aiMutation = useMutation({
    mutationFn: async (data: { symptoms: string }) => {
      const res = await apiRequest("POST", "/api/ai-assistant", data);
      return res.json();
    },
    onSuccess: (data: AIResponse) => {
      setAiResponse(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Health Assistant</h1>
        <p className="text-muted-foreground">Get instant health advice powered by AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => aiMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe your symptoms in detail..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={aiMutation.isPending}>
                  {aiMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Get AI Analysis
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {aiMutation.isPending ? (
              <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing your symptoms...</p>
              </div>
            ) : aiResponse ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Preliminary Diagnosis</p>
                  <p className="text-lg font-medium">{aiResponse.diagnosis}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
                  <Progress value={aiResponse.confidence * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.round(aiResponse.confidence * 100)}% confidence
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Recommendations</p>
                  <div className="space-y-2">
                    {aiResponse.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    This is an AI-generated preliminary analysis. Please consult with a healthcare professional for accurate
                    diagnosis and treatment.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center space-y-4">
                <Brain className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">
                    Describe your symptoms and our AI will provide a preliminary analysis
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
