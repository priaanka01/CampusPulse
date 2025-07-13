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
import { useToast } from "@/hooks/use-toast"
import ChatDialog from '@/components/chat-dialog';

const categories = [...new Set(allEvents.map((event) => event.category))];

export default function Home() {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(allEvents);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [isChatOpen, setChatOpen] = useState(false);
  const [chatEvent, setChatEvent] = useState<Event | null>(null);
  const { toast } = useToast();

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

  const handleRegister = (eventId: string) => {
    setRegisteredEvents(prev => new Set(prev).add(eventId));
    toast({
      title: "Successfully Registered!",
      description: "You can now set a reminder or contact the organizer.",
    })
  };

  const handleSetReminder = (eventName: string) => {
    toast({
      title: "Reminder Set!",
      description: `We'll notify you before ${eventName} starts.`,
    });
  };

  const handleOpenChat = (event: Event) => {
    setChatEvent(event);
    setChatOpen(true);
  };
  
  const handleSendMessage = (message: string) => {
    console.log(`Sending message about ${chatEvent?.name}: ${message}`);
    toast({
        title: "Message Sent!",
        description: `Your query about "${chatEvent?.name}" has been sent to the organizer.`,
    });
    setChatOpen(false);
  };

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
                  <Button asChild size="lg" variant="outline">
                      <a href="#ai-recommendations">Get AI Suggestions</a>
                  </Button>
              </div>
            </div>
          </section>

          <EventRecommendations />
          
          <section id="upcoming-events" className="py-16 md:py-24 px-4 bg-background">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                  <h2 className="font-headline text-4xl md:text-5xl font-bold">
                  Upcoming Events
                  </h2>
                  <p className="mt-2 text-lg text-muted-foreground">Stay in the loop with what's happening on campus.</p>
              </div>
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
                    <EventCard
                      key={event.id}
                      event={event}
                      isRegistered={registeredEvents.has(event.id)}
                      onRegister={handleRegister}
                      onSetReminder={handleSetReminder}
                      onChat={handleOpenChat}
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
      {chatEvent && (
         <ChatDialog
          isOpen={isChatOpen}
          onOpenChange={setChatOpen}
          event={chatEvent}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
}
