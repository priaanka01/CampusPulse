'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getRecommendations, type RecommendationState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Get Recommendations
    </Button>
  );
}

const EventRecommendations = () => {
  const initialState: RecommendationState = {
    message: '',
    recommendations: null,
  };
  const [state, formAction] = useFormState(getRecommendations, initialState);

  return (
    <section id="ai-recommendations" className="bg-accent/20 py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-start">
        <div className="md:col-span-1">
          <h2 className="font-headline text-4xl md:text-5xl font-bold">Discover Events</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Let our AI find events that match your vibe. Just tell us what you're into.
          </p>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
              <CardDescription>
                Provide comma-separated interests and past events for the best results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <div>
                  <Label htmlFor="interests">Interests</Label>
                  <Input id="interests" name="interests" placeholder="e.g., AI, Music, Startups" required />
                  {state.errors?.interests && (
                    <p className="text-sm text-destructive mt-1">{state.errors.interests[0]}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pastEvents">Past Events (Optional)</Label>
                  <Textarea id="pastEvents" name="pastEvents" placeholder="e.g., Tech Summit 2023, Fall Music Fest" />
                </div>
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
            {state.message && (
                <div className={`mb-4 text-sm p-3 rounded-md ${state.errors ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                    {state.message}
                </div>
            )}
            
            <div className="grid sm:grid-cols-2 gap-6">
            {state.recommendations && state.recommendations.map((event, index) => (
                <Card key={index} className="flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">{event.eventName}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <p className="text-foreground/80 text-sm flex-grow">{event.eventDescription}</p>
                    <div className="mt-4">
                        <Label className="text-xs text-muted-foreground">Relevance Score</Label>
                        <Progress value={event.relevanceScore * 100} className="h-2 mt-1" />
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
            {!state.recommendations && (
                 <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Wand2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-lg text-foreground/70">Your personalized event suggestions will appear here.</p>
                    <p className="text-sm text-foreground/50">Fill out the form to get started!</p>
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default EventRecommendations;
