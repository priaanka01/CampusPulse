import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/types';
import { format } from 'date-fns';
import { Button } from './ui/button';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group bg-card">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={event.image}
            alt={event.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={event.aiHint}
            className="group-hover:scale-105 transition-transform duration-300"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           <div className="absolute bottom-4 left-4">
             <Badge variant="secondary" className="text-sm">{event.category}</Badge>
           </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
         <CardTitle className="font-headline text-2xl mb-2">{event.name}</CardTitle>
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{format(event.date, 'PPP')}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
        <p className="mt-4 text-foreground/80 line-clamp-3">{event.description}</p>
      </CardContent>
       <CardFooter className="p-6 pt-0">
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
