'use client';
import React, { useState, useEffect } from 'react';
import SiteHeader from '@/components/site-header';
import Footer from '@/components/footer';
import EventCard from '@/components/event-card';
import EventFilters from '@/components/event-filters';
import EventRecommendations from '@/components/event-recommendations';
import { events as allEvents } from '@/lib/events';
import type { Event } from '@/types';

const categories = [...new Set(allEvents.map((event) => event.category))];

export default function Home() {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(allEvents);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow">
        <section className="text-center py-16 md:py-24 px-4 bg-card">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">
              CampusPulse
            </h1>
            <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              Your vibrant guide to campus life. Discover events, connect with peers, and find your rhythm.
            </p>
          </div>
        </section>

        <EventRecommendations />
        
        <section id="upcoming-events" className="py-16 md:py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-center mb-12">
              Upcoming Events
            </h2>
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
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
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
  );
}
