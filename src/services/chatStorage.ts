import { ChatConversation, ChatMessage, QuickReply, Client, Professional } from '@/src/types';

export const ADMIN_PARTICIPANT_ID = 'admin-luxe';
export const ADMIN_PARTICIPANT_NAME = 'Salão Luxe (Recepção / Gerência)';

export const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  {
    id: 'qr-1',
    title: 'Confirmação de Horário',
    shortcut: '/confirmar',
    content: 'Olá! Confirmamos seu horário agendado no Salão Luxe. Caso precise remarcar, por gentileza nos avise com antecedência. Estamos ansiosos para recebê-lo(a)!',
    category: 'agendamento'
  },
  {
    id: 'qr-2',
    title: 'Lembrete do Dia',
    shortcut: '/lembrete',
    content: 'Olá! Lembramos que o seu agendamento no Salão Luxe está marcado para hoje. Nossa equipe e bancada já estão preparadas para seu atendimento.',
    category: 'agendamento'
  },
  {
    id: 'qr-3',
    title: 'Agradecimento e Avaliação',
    shortcut: '/pos',
    content: 'Agradecemos imensamente pela visita ao Salão Luxe! Como foi sua experiência conosco hoje? Sua opinião e feedback são fundamentais para nós.',
    category: 'atendimento'
  },
  {
    id: 'qr-4',
    title: 'Horários Disponíveis',
    shortcut: '/horarios',
    content: 'Olá! Temos horários especiais disponíveis para esta semana. Deseja que reservemos uma vaga com seu profissional favorito?',
    category: 'atendimento'
  },
  {
    id: 'qr-5',
    title: 'Alinhamento com Equipe',
    shortcut: '/equipe',
    content: 'Olá! Favor verificar a agenda atualizada e conferir a organização e produtos da bancada para os próximos atendimentos.',
    category: 'equipe'
  },
  {
    id: 'qr-6',
    title: 'Comissão e Fechamento',
    shortcut: '/comissao',
    content: 'Olá! Seu relatório de comissões e atendimentos do período já está disponível para conferência no sistema do Salão Luxe.',
    category: 'equipe'
  }
];

export function syncConversationsWithRegisteredEntities(
  clients: Client[],
  professionals: Professional[],
  existingConversations: ChatConversation[]
): ChatConversation[] {
  const result: ChatConversation[] = [...existingConversations];

  // Sync clients
  for (const client of clients) {
    const convId = `conv-client-${client.id}`;
    const existingIndex = result.findIndex(c => c.id === convId);
    
    if (existingIndex >= 0) {
      // Update details in case client name or phone changed
      result[existingIndex] = {
        ...result[existingIndex],
        participantName: client.name,
        participantPhone: client.phone,
        participantWhatsapp: client.whatsapp || client.phone,
        participantEmail: client.email,
        participantPhotoUrl: client.photoUrl,
        participantRoleDescription: `Cliente (${client.status === 'ativo' ? 'Ativo' : 'Bloqueado'})`
      };
    } else {
      result.push({
        id: convId,
        type: 'cliente',
        participantId: client.id,
        participantName: client.name,
        participantPhone: client.phone,
        participantWhatsapp: client.whatsapp || client.phone,
        participantEmail: client.email,
        participantPhotoUrl: client.photoUrl,
        participantRoleDescription: `Cliente (${client.status === 'ativo' ? 'Ativo' : 'Bloqueado'})`,
        unreadCountAdmin: 0,
        unreadCountParticipant: 0,
        isOnline: true,
        updatedAt: client.createdAt || new Date().toISOString()
      });
    }
  }

  // Sync professionals
  for (const prof of professionals) {
    const convId = `conv-prof-${prof.id}`;
    const existingIndex = result.findIndex(c => c.id === convId);

    if (existingIndex >= 0) {
      result[existingIndex] = {
        ...result[existingIndex],
        participantName: prof.name,
        participantPhotoUrl: prof.photoUrl,
        participantRoleDescription: prof.role || 'Profissional'
      };
    } else {
      result.push({
        id: convId,
        type: 'profissional',
        participantId: prof.id,
        participantName: prof.name,
        participantPhotoUrl: prof.photoUrl,
        participantRoleDescription: prof.role || 'Profissional',
        unreadCountAdmin: 0,
        unreadCountParticipant: 0,
        isOnline: true,
        updatedAt: new Date().toISOString()
      });
    }
  }

  // Sort by updatedAt descending
  return result.sort((a, b) => {
    const tA = new Date(a.lastMessageTimestamp || a.updatedAt).getTime();
    const tB = new Date(b.lastMessageTimestamp || b.updatedAt).getTime();
    return tB - tA;
  });
}

export function formatWhatsAppUrl(phoneNumber?: string, customText?: string): string {
  if (!phoneNumber) return '';
  const digits = phoneNumber.replace(/\D/g, '');
  if (!digits) return '';

  const fullNumber = digits.length <= 11 ? `55${digits}` : digits;
  const message = customText || 'Olá! Mensagem enviada através da recepção do Salão Luxe.';
  return `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function broadcastChatUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('salao-luxe-chat-sync'));
  }
}
