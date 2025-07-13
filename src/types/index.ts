export type Event = {
  id: string;
  name: string;
  date: Date;
  location: string;
  description: string;
  category: string;
  image: string;
  aiHint: string;
};

export type RecommendedEvent = {
  eventName: string;
  eventDescription: string;
  relevanceScore: number;
};
