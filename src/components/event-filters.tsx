'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Filter, X } from 'lucide-react';
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
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-5 w-5 mr-2 text-muted-foreground hidden md:block" />
        <span className="text-sm font-semibold self-center mr-2 hidden lg:block">Filter by:</span>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setSelectedCategory(selectedCategory === category ? null : category)
            }
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="flex-grow md:flex-grow-0" />
      <div className="flex gap-2 items-center">
         <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              size="sm"
              className={cn(
                "w-[240px] justify-start text-left font-normal rounded-full",
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
          <Button variant="ghost" onClick={onClear} size="icon" className="rounded-full" aria-label="Clear filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventFilters;
