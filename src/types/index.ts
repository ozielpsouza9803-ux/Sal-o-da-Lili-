export type ViewType = 
  | 'dashboard' 
  | 'agenda' 
  | 'profissionais' 
  | 'clientes' 
  | 'servicos' 
  | 'produtos' 
  | 'pedidos' 
  | 'financeiro' 
  | 'chat' 
  | 'vitrine' 
  | 'configuracoes';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  commission: number;
  specialties: string[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // in minutes
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit?: Date;
  totalSpent: number;
}
