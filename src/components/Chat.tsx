import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  Users, 
  UserSquare2, 
  Clock, 
  Sparkles, 
  Plus, 
  Zap, 
  Search,
  MessageCircle,
  ExternalLink,
  Shield,
  Send
} from 'lucide-react';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { 
  ChatConversation, 
  ChatMessage, 
  ChatAttachment, 
  QuickReply, 
  Client, 
  Professional, 
  ChatParticipantType 
} from '@/src/types';
import { 
  DEFAULT_QUICK_REPLIES, 
  syncConversationsWithRegisteredEntities, 
  ADMIN_PARTICIPANT_ID,
  ADMIN_PARTICIPANT_NAME,
  broadcastChatUpdate
} from '@/src/services/chatStorage';
import { initialClientsList } from '@/src/components/Clients';
import { initialProfessionalsList } from '@/src/components/Professionals';
import { ChatSidebar } from './chat/ChatSidebar';
import { ChatArea } from './chat/ChatArea';
import { QuickRepliesModal } from './chat/QuickRepliesModal';
import { cn } from '@/src/lib/utils';

export const Chat: React.FC = () => {
  // Persistent stores
  const [clients] = useLocalStorage<Client[]>('clients', initialClientsList);
  const [professionals] = useLocalStorage<Professional[]>('professionals', initialProfessionalsList);
  const [storedConversations, setStoredConversations] = useLocalStorage<ChatConversation[]>('chat_conversations', []);
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('chat_messages', []);
  const [quickReplies, setQuickReplies] = useLocalStorage<QuickReply[]>('chat_quick_replies', DEFAULT_QUICK_REPLIES);

  // Synchronized conversations with real clients & pros
  const conversations = useMemo(() => {
    return syncConversationsWithRegisteredEntities(clients, professionals, storedConversations);
  }, [clients, professionals, storedConversations]);

  // Active state
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return conversations[0]?.id || null;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'todas' | 'cliente' | 'profissional' | 'nao_lidas'>('todas');
  const [isQuickRepliesModalOpen, setIsQuickRepliesModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');

  // Keep first conversation selected if none is active on desktop
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0 && window.innerWidth >= 768) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Sync event listener for cross-tab or external simulation
  useEffect(() => {
    const handleSync = () => {
      // Trigger re-render by reading storage or setting state
    };
    window.addEventListener('salao-luxe-chat-sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('salao-luxe-chat-sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const activeMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messages
      .filter(m => m.conversationId === activeConversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, activeConversationId]);

  // Handlers
  const handleMarkAsRead = (convId: string) => {
    // 1. Reset unread count in conversations
    setStoredConversations(prev => {
      const idx = prev.findIndex(c => c.id === convId);
      if (idx === -1) {
        // Find in synced and add
        const found = conversations.find(c => c.id === convId);
        if (found) {
          return [...prev, { ...found, unreadCountAdmin: 0 }];
        }
        return prev;
      }
      if (prev[idx].unreadCountAdmin === 0) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], unreadCountAdmin: 0 };
      return updated;
    });

    // 2. Mark incoming messages as 'lida'
    setMessages(prev => {
      let changed = false;
      const updated = prev.map(m => {
        if (m.conversationId === convId && m.senderRole !== 'admin' && m.status !== 'lida') {
          changed = true;
          return { ...m, status: 'lida' as const };
        }
        return m;
      });
      return changed ? updated : prev;
    });
  };

  const handleSendMessage = (
    content: string,
    senderRole: ChatParticipantType,
    senderId: string,
    senderName: string,
    attachment?: ChatAttachment
  ) => {
    if (!activeConversation) return;

    const timestamp = new Date().toISOString();
    const recipientId = senderRole === 'admin' ? activeConversation.participantId : ADMIN_PARTICIPANT_ID;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      conversationId: activeConversation.id,
      senderId,
      senderName,
      senderRole,
      recipientId,
      content,
      attachment,
      status: senderRole === 'admin' ? 'entregue' : 'enviada',
      timestamp
    };

    // Update messages
    setMessages(prev => [...prev, newMsg]);

    // Update conversation metadata
    const snippet = content || (attachment?.type === 'image' ? '📷 Foto anexada' : '📎 Documento anexado');

    setStoredConversations(prev => {
      const existingIdx = prev.findIndex(c => c.id === activeConversation.id);
      const isFromAdmin = senderRole === 'admin';

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          lastMessage: snippet,
          lastMessageTimestamp: timestamp,
          unreadCountAdmin: isFromAdmin ? 0 : (copy[existingIdx].unreadCountAdmin + 1),
          unreadCountParticipant: isFromAdmin ? (copy[existingIdx].unreadCountParticipant + 1) : 0,
          updatedAt: timestamp
        };
        return copy;
      } else {
        return [
          {
            ...activeConversation,
            lastMessage: snippet,
            lastMessageTimestamp: timestamp,
            unreadCountAdmin: isFromAdmin ? 0 : 1,
            unreadCountParticipant: isFromAdmin ? 1 : 0,
            updatedAt: timestamp
          },
          ...prev
        ];
      }
    });

    broadcastChatUpdate();
  };

  const handleSaveQuickReply = (reply: QuickReply) => {
    setQuickReplies(prev => {
      const idx = prev.findIndex(r => r.id === reply.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = reply;
        return copy;
      }
      return [...prev, reply];
    });
  };

  const handleDeleteQuickReply = (id: string) => {
    setQuickReplies(prev => prev.filter(r => r.id !== id));
  };

  // Stats calculation
  const totalConversationsCount = conversations.length;
  const clientConversationsCount = conversations.filter(c => c.type === 'cliente').length;
  const proConversationsCount = conversations.filter(c => c.type === 'profissional').length;
  const totalUnreadCount = conversations.reduce((acc, curr) => acc + (curr.unreadCountAdmin || 0), 0);

  // New Chat Dialog candidates
  const availableCandidates = useMemo(() => {
    const list: { id: string; name: string; type: 'cliente' | 'profissional'; roleOrPhone: string; convId: string }[] = [];
    
    clients.forEach(c => {
      list.push({
        id: c.id,
        name: c.name,
        type: 'cliente',
        roleOrPhone: c.phone || c.email,
        convId: `conv-client-${c.id}`
      });
    });

    professionals.forEach(p => {
      list.push({
        id: p.id,
        name: p.name,
        type: 'profissional',
        roleOrPhone: p.role,
        convId: `conv-prof-${p.id}`
      });
    });

    if (!newChatSearch.trim()) return list;
    const q = newChatSearch.toLowerCase();
    return list.filter(item => 
      item.name.toLowerCase().includes(q) || item.roleOrPhone.toLowerCase().includes(q)
    );
  }, [clients, professionals, newChatSearch]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Chat Integrado
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
              Salão Luxe Connect
            </span>
          </div>
          <p className="text-neutral-400 text-sm mt-1">
            Atendimento direto aos clientes e comunicação em tempo real com a equipe de profissionais.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsQuickRepliesModalOpen(true)}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all hover:border-[#d4af37]/40"
          >
            <Zap size={16} className="text-[#d4af37]" />
            <span>Respostas Rápidas</span>
          </button>

          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="px-4 py-2.5 bg-[#d4af37] hover:bg-[#e5c158] text-black rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-[#d4af37]/20"
          >
            <Plus size={16} />
            <span>Nova Conversa</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-neutral-400 text-xs font-medium block">Total de Conversas</span>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">{totalConversationsCount}</span>
            <span className="text-[11px] text-[#d4af37]">Canais ativos</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center border border-[#d4af37]/20">
            <MessageSquare size={20} />
          </div>
        </div>

        <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-neutral-400 text-xs font-medium block">Clientes Conectados</span>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">{clientConversationsCount}</span>
            <span className="text-[11px] text-blue-400">Atendimento e pós-venda</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <UserSquare2 size={20} />
          </div>
        </div>

        <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-neutral-400 text-xs font-medium block">Equipe & Profissionais</span>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">{proConversationsCount}</span>
            <span className="text-[11px] text-emerald-400">Comunicação interna</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-neutral-400 text-xs font-medium block">Mensagens Pendentes</span>
            <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">{totalUnreadCount}</span>
            <span className="text-[11px] text-rose-400">Não lidas pela gerência</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <MessageCircle size={20} />
          </div>
        </div>
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-[#0a0a0a] border border-[#d4af37]/20 rounded-2xl overflow-hidden shadow-2xl h-[680px] flex flex-col md:flex-row">
        {/* Left Sidebar (visible on desktop or when no conversation is active on mobile) */}
        <div className={cn(
          "h-full md:block",
          activeConversationId ? "hidden md:flex" : "flex flex-col w-full"
        )}>
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => setActiveConversationId(id)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Right Chat Area */}
        <div className={cn(
          "flex-1 h-full flex flex-col min-w-0",
          !activeConversationId ? "hidden md:flex" : "flex"
        )}>
          {activeConversation ? (
            <ChatArea
              conversation={activeConversation}
              messages={activeMessages}
              onSendMessage={handleSendMessage}
              onBackToList={() => setActiveConversationId(null)}
              quickReplies={quickReplies}
              onOpenQuickRepliesModal={() => setIsQuickRepliesModalOpen(true)}
              onMarkAsRead={handleMarkAsRead}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#070707]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#d4af37] mb-4 border border-[#d4af37]/20">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Nenhuma conversa selecionada</h3>
              <p className="text-neutral-400 text-xs max-w-sm">
                Selecione um cliente ou membro da equipe ao lado para visualizar o histórico de mensagens e responder.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Replies Modal */}
      <QuickRepliesModal
        isOpen={isQuickRepliesModalOpen}
        onClose={() => setIsQuickRepliesModalOpen(false)}
        quickReplies={quickReplies}
        onSaveQuickReply={handleSaveQuickReply}
        onDeleteQuickReply={handleDeleteQuickReply}
      />

      {/* New Chat Picker Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-[#d4af37]/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-white/10 bg-[#141414] flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-base">Iniciar Conversa</h3>
                <p className="text-xs text-neutral-400">Selecione um cliente ou profissional cadastrado</p>
              </div>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xs px-2 py-1"
              >
                Fechar
              </button>
            </div>

            <div className="p-4 border-b border-white/5 bg-black/40">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou contato..."
                  value={newChatSearch}
                  onChange={(e) => setNewChatSearch(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-2 overflow-y-auto max-h-96 divide-y divide-white/5">
              {availableCandidates.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  Nenhum cadastro encontrado.
                </div>
              ) : (
                availableCandidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveConversationId(c.convId);
                      setIsNewChatModalOpen(false);
                    }}
                    className="w-full p-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] font-semibold text-xs">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white text-xs font-semibold">{c.name}</div>
                        <div className="text-[11px] text-neutral-400">{c.roleOrPhone}</div>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded",
                      c.type === 'profissional'
                        ? "bg-[#d4af37]/15 text-[#d4af37]"
                        : "bg-blue-500/15 text-blue-400"
                    )}>
                      {c.type === 'profissional' ? 'Equipe' : 'Cliente'}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
