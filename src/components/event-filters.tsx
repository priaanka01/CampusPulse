'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EventFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  onClear: () => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedDate,
  setSelectedDate,
  onClear,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-8 p-4 rounded-lg bg-card border">
      <div className="flex-wrap flex gap-2">
        <span className="text-sm font-semibold self-center mr-2">Categories:</span>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() =>
              setSelectedCategory(selectedCategory === category ? null : category)
            }
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="flex-grow" />
      <div className="flex gap-2 items-center">
         <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {(selectedCategory || selectedDate) && (
          <Button variant="ghost" onClick={onClear} size="icon" aria-label="Clear filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventFilters;
