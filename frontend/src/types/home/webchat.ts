export interface QuickPrompt {
  id: string;
  label: string;
  icon: string;
  desc: string;
  defaultMsg: string;
}

export interface WebChatMessage {
  id: string;
  sender: 'CUSTOMER' | 'TRADER' | 'SYSTEM' | string;
  content: string;
  sentAt?: string | Date;
}
