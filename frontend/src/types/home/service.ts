export interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
}

export interface TradeCard {
  category: string;
  title: string;
  traderName: string;
  role: string;
  rating: string;
  reviewCount: number;
  hourlyRate: string;
  image: string;
  tag: string;
  area: string;
  features: string[];
}
