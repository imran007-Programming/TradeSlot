/**
 * Detects date/time slot requests from natural language messages.
 * Returns parsed { date, hour, minute } or null if no time found.
 */

const TIME_PATTERNS = [
  // "at 2pm", "at 14:00", "at 2:30pm"
  /\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i,
  // "2pm", "14:00", "2:30pm"
  /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i,
  // "tomorrow at 3", "monday at 10"
  /\b(\d{1,2})(?::(\d{2}))?\s*o'?clock\b/i,
];

const DATE_PATTERNS: { pattern: RegExp; resolver: (m: RegExpMatchArray) => Date | null }[] = [
  {
    // "tomorrow"
    pattern: /\btomorrow\b/i,
    resolver: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d;
    },
  },
  {
    // "today"
    pattern: /\btoday\b/i,
    resolver: () => new Date(),
  },
  {
    // "monday", "tuesday", etc.
    pattern: /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    resolver: (m) => {
      const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      const target = days.indexOf(m[1].toLowerCase());
      const now = new Date();
      const current = now.getDay();
      let diff = target - current;
      if (diff <= 0) diff += 7;
      const d = new Date();
      d.setDate(d.getDate() + diff);
      return d;
    },
  },
  {
    // "25th", "25 jan", "jan 25", "25/01", "01/25"
    pattern: /\b(\d{1,2})[\/\-\s]?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i,
    resolver: (m) => {
      const months: Record<string, number> = {
        jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11
      };
      const day = parseInt(m[1]);
      const monthKey = m[2].toLowerCase().slice(0, 3);
      const month = months[monthKey];
      if (month === undefined) return null;
      const d = new Date();
      d.setMonth(month, day);
      if (d < new Date()) d.setFullYear(d.getFullYear() + 1);
      return d;
    },
  },
];

export interface DetectedSlot {
  date: Date;
  hour: number;
  minute: number;
  slotStart: Date;
  slotEnd: Date; // +1 hour
}

export const detectSlotRequest = (text: string): DetectedSlot | null => {
  // Detect date
  let detectedDate: Date | null = null;
  for (const { pattern, resolver } of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      detectedDate = resolver(match);
      break;
    }
  }

  // Detect time
  let hour: number | null = null;
  let minute = 0;
  for (const pattern of TIME_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      hour = parseInt(match[1]);
      minute = match[2] ? parseInt(match[2]) : 0;
      const meridiem = match[3]?.toLowerCase();
      if (meridiem === 'pm' && hour < 12) hour += 12;
      if (meridiem === 'am' && hour === 12) hour = 0;
      break;
    }
  }

  if (hour === null) return null;
  if (!detectedDate) detectedDate = new Date(); // assume today if only time given

  const slotStart = new Date(detectedDate);
  slotStart.setHours(hour, minute, 0, 0);

  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotEnd.getHours() + 1);

  return { date: detectedDate, hour, minute, slotStart, slotEnd };
};
