'use client';
import React, { useState, useEffect } from 'react';
import SiteHeader from '@/components/site-header';
import Footer from '@/components/footer';
import EventCard from '@/components/event-card';
import EventFilters from '@/components/event-filters';
import EventRecommendations from '@/components/event-recommendations';
import { events as allEvents } from '@/lib/events';
import type { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth.tsx';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

const categories = [...new Set(allEvents.map((event) => event.category))];

export default function Home() {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(allEvents);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { user } = useAuth();


  useEffect(() => {
    let events = allEvents;
    if (selectedCategory) {
      events = events.filter((event) => event.category === selectedCategory);
    }
    if (selectedDate) {
      events = events.filter(
        (event) => event.date.toDateString() === selectedDate.toDateString()
      );
    }
    setFilteredEvents(events);
  }, [selectedCategory, selectedDate]);


  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <SiteHeader />
        <main className="flex-grow">
          <section className="relative text-center py-20 md:py-32 px-4 bg-secondary/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
            <div className="relative max-w-4xl mx-auto">
              <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">
                CampusPulse
              </h1>
              <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
                Your vibrant guide to campus life. Discover events, connect with peers, and find your rhythm.
              </p>
              <div className="mt-8 flex gap-4 justify-center">
                  <Button asChild size="lg">
                      <a href="#upcoming-events">Browse Events</a>
                  </Button>
                  {user &&
                    <Button asChild size="lg" variant="outline">
                        <a href="#ai-recommendations">Get AI Suggestions</a>
                    </Button>
                  }
              </div>
            </div>
          </section>

          {user && <EventRecommendations /> }
          
          <section id="upcoming-events" className="py-16 md:py-24 px-4 bg-background">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                  <h2 className="font-headline text-4xl md:text-5xl font-bold">
                  Upcoming Events
                  </h2>
                  <p className="mt-2 text-lg text-muted-foreground">Stay in the loop with what's happening on campus.</p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <EventFilters
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    onClear={() => {
                    setSelectedCategory(null);
                    setSelectedDate(undefined);
                    }}
                />
                 {user?.role === 'organizer' && (
                    <Button asChild>
                        <Link href="/create-event">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Event
                        </Link>
                    </Button>
                )}
              </div>
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
                  <p className="text-lg text-foreground/70">No events match your current filters.</p>
                  <p className="text-sm text-foreground/50">Try clearing the filters to see all events.</p>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
