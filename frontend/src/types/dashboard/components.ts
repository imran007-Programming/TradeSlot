import React from 'react';
import { Conversation } from './conversation';
import { Booking, Slot } from './booking';
import { Customer } from './customer';
import { WorkArea } from './workArea';

// 1. ChatPanel Component Props
export interface ChatPanelProps {
  conversation: Conversation | null;
  replyContent: string;
  sendingMessage: boolean;
  onReplyChange: (text: string) => void;
  onSend: () => void;
  onOpenBookingModal: () => void;
  onOpenSlotsModal: () => void;
  onGeneratePayment: (bookingId: string) => void;
  generatingPayment: string | null;
  onUpdateStatus?: (id: string, status: string) => void;
  onDeleteConversation: (id: string) => void;
}

// 2. ConversationList Component Props
export interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (conv: Conversation) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

// 3. StatsBar Component Props
export interface StatsBarProps {
  conversationsCount: number;
  bookingsCount: number;
  customersCount: number;
  workAreasCount: number;
}

// 4. CustomersTab Component Props
export interface CustomersTabProps {
  customers: Customer[];
}

// 5. BookingsTab Component Props
export interface BookingsTabProps {
  bookings: Booking[];
  onGeneratePayment: (bookingId: string) => void;
  generatingPayment: string | null;
  onUpdateStatus: (bookingId: string, status: string) => void;
}

// 6. WorkAreasTab Component Props
export interface WorkAreasTabProps {
  workAreas: WorkArea[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}

// 7. BookingModal Component Props
export interface BookingModalProps {
  customerName?: string;
  bookingError: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  bookingFee: string;
  creatingBooking: boolean;
  onBookingDateChange: (v: string) => void;
  onStartTimeChange: (v: string) => void;
  onEndTimeChange: (v: string) => void;
  onBookingFeeChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

// 8. SlotsModal Component Props & DayItem
export interface DayItem {
  dateStr: string;
  dayNum: string;
  dayName: string;
  isToday: boolean;
}

export interface SlotsModalProps {
  slotsDate: string;
  availableSlots: Slot[];
  loadingSlots: boolean;
  onDateChange: (dateStr: string) => void;
  onFetch: (dateStr?: string) => void;
  onSelectSlot: (slot: Slot) => void;
  onClose: () => void;
}
