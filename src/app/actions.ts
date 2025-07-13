// src/app/actions.ts
'use server';

import { recommendEvents, type RecommendEventsInput, type RecommendEventsOutput } from '@/ai/flows/recommend-events';
import { z } from 'zod';

const FormSchema = z.object({
  interests: z.string().min(1, 'Please enter at least one interest.'),
  pastEvents: z.string().optional(),
});

export type RecommendationState = {
  message: string;
  recommendations: RecommendEventsOutput | null;
  errors?: {
    interests?: string[];
    pastEvents?: string[];
  };
};

export async function getRecommendations(
  prevState: RecommendationState,
  formData: FormData
): Promise<RecommendationState> {
  const validatedFields = FormSchema.safeParse({
    interests: formData.get('interests'),
    pastEvents: formData.get('pastEvents'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check your inputs.',
      recommendations: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const input: RecommendEventsInput = {
      userInterests: validatedFields.data.interests,
      pastEvents: validatedFields.data.pastEvents || '',
    };
    const recommendations = await recommendEvents(input);
    
    if (!recommendations || recommendations.length === 0) {
      return { message: 'No recommendations found for your interests. Try broadening your search terms.', recommendations: [] };
    }
    
    return { message: 'Success! Here are your tailored event recommendations.', recommendations };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { message: 'An unexpected error occurred on our end. Please try again later.', recommendations: null };
  }
}
