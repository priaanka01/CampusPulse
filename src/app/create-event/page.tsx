// src/app/create-event/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, PartyPopper } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import SiteHeader from '@/components/site-header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const eventFormSchema = z.object({
  name: z.string().min(3, { message: 'Event name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  location: z.string().min(3, { message: 'Location is required.' }),
  date: z.date({ required_error: 'A date is required.' }),
  category: z.string({ required_error: 'Please select a category.' }),
  image: z.string().url({ message: 'Please enter a valid image URL.' }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const categories = ['Tech', 'Music', 'Art', 'Career', 'Sports', 'Social'];

export default function CreateEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      category: '',
      image: '',
    },
  });

  const onSubmit = (data: EventFormValues) => {
    console.log('New event created:', data);
    toast({
      title: 'Event Created Successfully!',
      description: `Your event "${data.name}" has been posted.`,
    });
    // Here you would typically send the data to your backend
    // For now, we'll just redirect to the homepage
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-grow py-12 md:py-20">
        <div className="container max-w-2xl mx-auto px-4">
            <Button asChild variant="ghost" className="mb-8" onClick={() => router.back()}>
                <span>
                    <ArrowLeft className="mr-2" />
                    Back
                </span>
            </Button>
          <Card className="shadow-2xl">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <PartyPopper className="h-8 w-8 text-primary"/>
                    </div>
                    <div>
                        <CardTitle className="font-headline text-4xl">Create New Event</CardTitle>
                        <CardDescription>Fill out the details below to get your event on the calendar.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tech Innovators Summit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us more about your event..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Grand Auditorium" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Date & Time</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                 
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an event category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://placehold.co/600x400.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full">
                    Create Event
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
