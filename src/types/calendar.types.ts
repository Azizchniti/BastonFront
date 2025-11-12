export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string; // ISO date string
  end_time: string;   // ISO date string
  created_at?: string;
  updated_at?: string;
}
