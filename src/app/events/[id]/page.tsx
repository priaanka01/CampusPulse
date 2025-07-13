// src/app/events/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  Calendar,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import { events } from '@/lib/events';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ChatDialog from '@/components/chat-dialog';
import SiteHeader from '@/components/site-header';
import Footer from '@/components/footer';
import { format } from 'date-fns';
import type { Event } from '@/types';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const event = events.find((e) => e.id === eventId);
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const { toast } = useToast();

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl font-bold">Event Not Found</h1>
            <p className="mt-2 text-muted-foreground">
              Sorry, we couldn't find the event you're looking for.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">
                <ArrowLeft className="mr-2" /> Back to All Events
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleRegister = () => {
    setIsRegistered(true);
    toast({
      title: 'Successfully Registered!',
      description: `You are now registered for ${event.name}.`,
    });
  };

  const handleSetReminder = () => {
    toast({
      title: 'Reminder Set!',
      description: `We'll notify you before ${event.name} starts.`,
    });
  };

  const handleOpenChat = () => {
    setChatOpen(true);
  };
  
  const handleSendMessage = (message: string) => {
    console.log(`Sending message about ${event?.name}: ${message}`);
    toast({
      title: 'Message Sent!',
      description: `Your query about "${event?.name}" has been sent to the organizer.`,
    });
    setChatOpen(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <SiteHeader />
        <main className="flex-grow py-12 md:py-20">
          <div className="container max-w-4xl mx-auto px-4">
            <Button asChild variant="ghost" className="mb-8">
              <Link href="/#upcoming-events">
                <ArrowLeft className="mr-2" />
                Back to Events
              </Link>
            </Button>
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
              <Image
                src={event.image}
                alt={event.name}
                fill
                objectFit="cover"
                data-ai-hint={event.aiHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                <Badge
                  variant="secondary"
                  className="text-base shadow-lg mb-2"
                >
                  {event.category}
                </Badge>
                <h1 className="font-headline text-4xl md:text-6xl font-bold text-white">
                  {event.name}
                </h1>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 mt-12">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold font-headline mb-4">
                  About this event
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  {event.description}
                </p>
              </div>
              <div className="md:col-span-1">
                <Card className="bg-card/50 p-6 rounded-xl shadow-lg border">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start">
                      <Calendar className="mr-3 h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">Date & Time</p>
                        <p className="text-muted-foreground">
                          {format(event.date, 'PPPP p')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-3 h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-muted-foreground">{event.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-3">
                    {isRegistered ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleSetReminder}
                          className="w-full"
                          size="lg"
                        >
                          <Bell /> Set Reminder
                        </Button>
                        <Button
                          onClick={handleOpenChat}
                          className="w-full"
                          size="lg"
                        >
                          <MessageSquare /> Chat with Organizer
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleRegister} className="w-full" size="lg">
                        Register Now
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <ChatDialog
        isOpen={isChatOpen}
        onOpenChange={setChatOpen}
        event={event}
        onSendMessage={handleSendMessage}
      />
    </>
  );
}

// Add a placeholder card component to avoid breaking imports
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
);
