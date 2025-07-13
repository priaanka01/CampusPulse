'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getRecommendations, type RecommendationState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
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
  const [state, formAction] = useActionState(getRecommendations, initialState);

  return (
    <section id="ai-recommendations" className="bg-secondary/30 py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Personalized for You</h2>
            <p className="mt-2 text-lg text-muted-foreground">Let our AI find events that match your vibe. Just tell us what you're into.</p>
        </div>
        <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-2">
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle>Tell Us Your Interests</CardTitle>
                <CardDescription>
                    Provide comma-separated interests and past events for the best results.
                </CardDescription>
                </CardHeader>
                <form action={formAction}>
                <CardContent className="space-y-4">
                    <div>
                    <Label htmlFor="interests">Your Interests</Label>
                    <Input id="interests" name="interests" placeholder="e.g., AI, Music, Startups" required />
                    {state.errors?.interests && (
                        <p className="text-sm text-destructive mt-1">{state.errors.interests[0]}</p>
                    )}
                    </div>
                    <div>
                    <Label htmlFor="pastEvents">Past Events You Liked (Optional)</Label>
                    <Textarea id="pastEvents" name="pastEvents" placeholder="e.g., Tech Summit 2023, Fall Music Fest" />
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
                </form>
            </Card>
            </div>
            <div className="md:col-span-3">
                {state.message && !state.recommendations?.length && (
                    <div className={`mb-4 text-sm p-3 rounded-md ${state.errors ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                        {state.message}
                    </div>
                )}
                
                {state.recommendations && state.recommendations.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                        {state.recommendations.map((event, index) => (
                            <Card key={index} className="flex flex-col bg-card/80 backdrop-blur-sm shadow-md">
                                <CardHeader>
                                    <CardTitle className="font-headline text-xl">{event.eventName}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col">
                                    <p className="text-foreground/80 text-sm flex-grow">{event.eventDescription}</p>
                                    <div className="mt-4">
                                        <Label className="text-xs text-muted-foreground">Relevance</Label>
                                        <div className="flex items-center gap-2">
                                            <Progress value={event.relevanceScore * 100} className="h-2" />
                                            <span className="text-xs font-semibold text-primary">{Math.round(event.relevanceScore * 100)}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-xl h-full flex flex-col justify-center items-center bg-card/50">
                        <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-lg font-semibold text-foreground/70">Your personalized event suggestions will appear here.</p>
                        <p className="text-sm text-foreground/50">Fill out the form to get started!</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default EventRecommendations;
