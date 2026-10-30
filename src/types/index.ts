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
  | 'configuracoes'
  | 'area_cliente';

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

export type ClientStatus = 'ativo' | 'bloqueado' | 'inativo';

export interface ClientPurchase {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: 'servico' | 'produto' | 'pacote';
  amount: number;
  paymentMethod: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';
  status: 'pago' | 'pendente' | 'estornado';
  invoiceNumber?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  photoUrl?: string;
  birthDate?: string; // YYYY-MM-DD
  status: ClientStatus;
  
  // Acesso individual da Área do Cliente
  hasPortalAccess: boolean;
  password?: string;
  lastLoginAt?: string;

  // Preferências e notas
  notes?: string;
  preferences?: string;
  allergies?: string;
  favoriteServiceIds?: string[];

  // Métricas
  totalSpent: number;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 
  | 'aguardando' 
  | 'confirmado' 
  | 'em_atendimento' 
  | 'concluido' 
  | 'cancelado';

export interface RescheduleRecord {
  previousDate: string;
  previousStartTime: string;
  previousEndTime: string;
  rescheduledAt: string;
  reason?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  professionalId: string;
  professionalName: string;
  serviceIds: string[];
  serviceNames: string[];
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  totalDuration: number; // minutes
  totalPrice: number; // BRL
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
  rescheduleHistory?: RescheduleRecord[];
  createdAt: string;
  updatedAt: string;
}

export type AbsenceType = 'folga' | 'intervalo' | 'almoco' | 'ferias' | 'curso' | 'outro';

export interface ProfessionalAbsence {
  id: string;
  professionalId: string;
  professionalName: string;
  type: AbsenceType;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm (if not all day)
  endTime?: string; // HH:mm (if not all day)
  allDay: boolean;
  notes?: string;
}
