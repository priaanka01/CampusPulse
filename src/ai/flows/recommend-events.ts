// src/ai/flows/recommend-events.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending events to users
 * based on their interests and past attendance.
 *
 * - recommendEvents - A function that takes user interests and past events as input and returns a list of recommended events.
 * - RecommendEventsInput - The input type for the recommendEvents function.
 * - RecommendEventsOutput - The output type for the recommendEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendEventsInputSchema = z.object({
  userInterests: z
    .string()
    .describe("A comma-separated list of the user's interests, e.g., 'AI, Music, Startups'."),
  pastEvents: z
    .string()
    .describe('A comma-separated list of event names the user has attended in the past.'),
});

export type RecommendEventsInput = z.infer<typeof RecommendEventsInputSchema>;

const RecommendedEventSchema = z.object({
  eventName: z.string().describe('The name of the recommended event.'),
  eventDescription: z.string().describe('A short description of the event.'),
  relevanceScore: z
    .number()
    .describe('A score (0-1) indicating how relevant the event is to the user.'),
});

const RecommendEventsOutputSchema = z.array(RecommendedEventSchema).describe('A list of recommended events.');

export type RecommendEventsOutput = z.infer<typeof RecommendEventsOutputSchema>;

export async function recommendEvents(input: RecommendEventsInput): Promise<RecommendEventsOutput> {
  return recommendEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendEventsPrompt',
  input: {schema: RecommendEventsInputSchema},
  output: {schema: RecommendEventsOutputSchema},
  prompt: `You are an AI event recommendation system.

  Based on the user's interests and past attendance, recommend a list of events.
  Each event should have a name, a short description, and a relevance score (0-1).
  Return the events as a JSON array.

  User Interests: {{{userInterests}}}
  Past Events: {{{pastEvents}}}

  Consider a wide range of possible events.  Ensure the relevance scores are reasonable given the stated interests and past events.
  `,
});

const recommendEventsFlow = ai.defineFlow(
  {
    name: 'recommendEventsFlow',
    inputSchema: RecommendEventsInputSchema,
    outputSchema: RecommendEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
