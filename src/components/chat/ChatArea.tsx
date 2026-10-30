import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Phone, 
  Mail, 
  CheckCheck, 
  Check, 
  Paperclip, 
  Image as ImageIcon,
  MoreVertical, 
  ShieldCheck, 
  UserCheck, 
  Download,
  Info,
  Repeat
} from 'lucide-react';
import { 
  ChatConversation, 
  ChatMessage, 
  ChatAttachment, 
  QuickReply, 
  ChatParticipantType 
} from '@/src/types';
import { cn } from '@/src/lib/utils';
import { 
  ADMIN_PARTICIPANT_ID, 
  ADMIN_PARTICIPANT_NAME, 
  formatWhatsAppUrl 
} from '@/src/services/chatStorage';
import { ChatInput } from './ChatInput';
import { AttachmentModal } from './AttachmentModal';

interface ChatAreaProps {
  conversation: ChatConversation;
  messages: ChatMessage[];
  onSendMessage: (content: string, senderRole: ChatParticipantType, senderId: string, senderName: string, attachment?: ChatAttachment) => void;
  onBackToList?: () => void;
  quickReplies: QuickReply[];
  onOpenQuickRepliesModal: () => void;
  onMarkAsRead: (conversationId: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  messages,
  onSendMessage,
  onBackToList,
  quickReplies,
  onOpenQuickRepliesModal,
  onMarkAsRead
}) => {
  // Mode: who is typing in this session?
  // By default: 'admin' (Salão Luxe Recepção)
  // Can be switched to 'participant' (e.g. client or pro) to test bidirectional conversation!
  const [activeSenderMode, setActiveSenderMode] = useState<'admin' | 'participant'>('admin');
  const [selectedAttachment, setSelectedAttachment] = useState<ChatAttachment | null>(null);
  const [showParticipantInfo, setShowParticipantInfo] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto mark as read when entering conversation
  useEffect(() => {
    onMarkAsRead(conversation.id);
  }, [conversation.id, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string, attachment?: ChatAttachment) => {
    if (activeSenderMode === 'admin') {
      onSendMessage(content, 'admin', ADMIN_PARTICIPANT_ID, ADMIN_PARTICIPANT_NAME, attachment);
    } else {
      const role: ChatParticipantType = conversation.type === 'cliente' ? 'cliente' : 'profissional';
      onSendMessage(content, role, conversation.participantId, conversation.participantName, attachment);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatMessageDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return 'Hoje';
    }
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatMessageTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Group messages by date
  const groupedMessages: { date: string; items: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const dateLabel = formatMessageDate(msg.timestamp);
    const existing = groupedMessages.find(g => g.date === dateLabel);
    if (existing) {
      existing.items.push(msg);
    } else {
      groupedMessages.push({ date: dateLabel, items: [msg] });
    }
  });

  const waUrl = formatWhatsAppUrl(conversation.participantWhatsapp || conversation.participantPhone);

  const currentSenderName = activeSenderMode === 'admin' 
    ? 'Salão Luxe (Recepção)' 
    : conversation.participantName;

  const currentSenderRole = activeSenderMode === 'admin'
    ? 'admin'
    : (conversation.type === 'cliente' ? 'cliente' : 'profissional');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070707] overflow-hidden relative">
      {/* Chat Header */}
      <div className="p-4 bg-[#0a0a0a] border-b border-[#d4af37]/15 flex items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="md:hidden p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Voltar para a lista"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          {/* Participant Avatar */}
          <div className="relative shrink-0">
            {conversation.participantPhotoUrl && conversation.participantPhotoUrl.length > 5 ? (
              <img
                src={conversation.participantPhotoUrl}
                alt={conversation.participantName}
                className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/40 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] font-semibold text-xs shadow-sm">
                {getInitials(conversation.participantName)}
              </div>
            )}
            {conversation.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full" />
            )}
          </div>

          {/* Participant Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-sm truncate">{conversation.participantName}</h3>
              <span className={cn(
                "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shrink-0",
                conversation.type === 'profissional'
                  ? "bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30"
                  : "bg-blue-500/15 text-blue-400 border border-blue-500/25"
              )}>
                {conversation.type === 'profissional' ? 'Equipe Luxe' : 'Cliente'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate flex items-center gap-2">
              <span>{conversation.participantRoleDescription || 'Ativo'}</span>
              {(conversation.participantPhone || conversation.participantWhatsapp) && (
                <>
                  <span className="text-neutral-600">•</span>
                  <span>{conversation.participantWhatsapp || conversation.participantPhone}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action Header Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Perspective switch toggle for testing */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#141414] border border-[#d4af37]/25 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="text-[11px] text-neutral-400">Responder como:</span>
            <button
              onClick={() => setActiveSenderMode(activeSenderMode === 'admin' ? 'participant' : 'admin')}
              className="flex items-center gap-1 text-[#d4af37] font-semibold hover:underline"
              title="Alternar remetente para testar envio bidirecional"
            >
              <Repeat size={12} />
              <span>{activeSenderMode === 'admin' ? 'Recepção (Admin)' : conversation.participantName}</span>
            </button>
          </div>

          {/* WhatsApp Direct Action */}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Abrir conversa no WhatsApp oficial"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}

          {/* Info toggle */}
          <button
            onClick={() => setShowParticipantInfo(!showParticipantInfo)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            title="Ver detalhes do cadastro"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Participant Info Banner Drawer (expandable) */}
      {showParticipantInfo && (
        <div className="bg-[#111] border-b border-[#d4af37]/20 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in slide-in-from-top-2 duration-200">
          <div>
            <span className="text-neutral-500 block mb-0.5">Identificação Cadastrada</span>
            <span className="text-white font-medium">{conversation.participantName}</span>
            <span className="text-neutral-400 block text-[11px]">ID: {conversation.participantId}</span>
          </div>
          <div>
            <span className="text-neutral-500 block mb-0.5">Canais de Contato</span>
            <span className="text-white font-medium block">{conversation.participantPhone || 'Sem telefone'}</span>
            <span className="text-neutral-400 block text-[11px]">{conversation.participantEmail || 'Sem e-mail'}</span>
          </div>
          <div>
            <span className="text-neutral-500 block mb-0.5">Segurança & Permissão</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck size={14} />
              Canal Oficial Criptografado
            </span>
            <span className="text-neutral-400 block text-[11px]">Salvo no histórico do Salão Luxe</span>
          </div>
        </div>
      )}

      {/* Message History Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 flex items-center justify-center mb-3">
              <UserCheck size={28} />
            </div>
            <h4 className="text-white font-bold text-base mb-1">Início da Conversa</h4>
            <p className="text-neutral-400 text-xs max-w-sm leading-relaxed mb-4">
              Canal de mensagens diretas entre o Salão Luxe e <strong>{conversation.participantName}</strong>. 
              Envie fotos de inspiração, avisos de horário ou orientações de atendimento.
            </p>
            <button
              onClick={() => handleSendMessage(`Olá, ${conversation.participantName}! Estamos à disposição pelo canal oficial do Salão Luxe.`)}
              className="px-4 py-2 bg-white/5 hover:bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] rounded-xl text-xs font-semibold transition-colors"
            >
              Enviar Saudação Inicial
            </button>
          </div>
        ) : (
          groupedMessages.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              {/* Date Separator Pill */}
              <div className="flex justify-center">
                <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#141414] text-neutral-400 border border-white/5 shadow-sm">
                  {group.date}
                </span>
              </div>

              {/* Messages in this date */}
              {group.items.map((msg) => {
                const isAdmin = msg.senderRole === 'admin';

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[85%] sm:max-w-[70%]",
                      isAdmin ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    {/* Sender Label */}
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[11px] font-semibold text-neutral-400">
                        {msg.senderName}
                      </span>
                      <span className={cn(
                        "text-[9px] uppercase px-1.5 py-0.2 rounded font-bold",
                        isAdmin 
                          ? "bg-[#d4af37]/20 text-[#d4af37]" 
                          : "bg-white/10 text-neutral-300"
                      )}>
                        {isAdmin ? 'Salão' : (msg.senderRole === 'profissional' ? 'Equipe' : 'Cliente')}
                      </span>
                    </div>

                    {/* Bubble */}
                    <div
                      className={cn(
                        "rounded-2xl p-3.5 shadow-md text-xs sm:text-sm leading-relaxed",
                        isAdmin
                          ? "bg-gradient-to-br from-[#1c180a] to-[#121212] border border-[#d4af37]/35 text-white rounded-tr-none"
                          : "bg-[#181818] border border-white/10 text-white rounded-tl-none"
                      )}
                    >
                      {/* Attachment Rendering */}
                      {msg.attachment && (
                        <div className="mb-2">
                          {msg.attachment.type === 'image' ? (
                            <div 
                              onClick={() => setSelectedAttachment(msg.attachment!)}
                              className="relative cursor-pointer group overflow-hidden rounded-xl border border-white/10 bg-black/40"
                            >
                              <img
                                src={msg.attachment.url}
                                alt={msg.attachment.name}
                                className="max-h-60 max-w-full rounded-xl object-cover hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-medium text-xs gap-1.5">
                                <ImageIcon size={16} />
                                <span>Visualizar Foto</span>
                              </div>
                            </div>
                          ) : (
                            <div 
                              onClick={() => setSelectedAttachment(msg.attachment!)}
                              className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between gap-3 cursor-pointer hover:border-[#d4af37]/50 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0">
                                  <Paperclip size={18} />
                                </div>
                                <div className="truncate">
                                  <span className="text-white font-medium text-xs block truncate">{msg.attachment.name}</span>
                                  <span className="text-[10px] text-neutral-400">{msg.attachment.sizeFormatted}</span>
                                </div>
                              </div>
                              <Download size={16} className="text-neutral-400 hover:text-[#d4af37] shrink-0" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Text content */}
                      {msg.content && (
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      )}

                      {/* Footer time & read receipts */}
                      <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-neutral-400 select-none">
                        <span>{formatMessageTime(msg.timestamp)}</span>
                        {isAdmin && (
                          <span title={msg.status === 'lida' ? 'Lida' : msg.status === 'entregue' ? 'Entregue' : 'Enviada'}>
                            {msg.status === 'lida' ? (
                              <CheckCheck size={14} className="text-[#d4af37]" />
                            ) : msg.status === 'entregue' ? (
                              <CheckCheck size={14} className="text-neutral-400" />
                            ) : (
                              <Check size={14} className="text-neutral-400" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        quickReplies={quickReplies}
        onOpenQuickRepliesModal={onOpenQuickRepliesModal}
        senderRole={currentSenderRole}
        senderName={currentSenderName}
      />

      {/* Attachment Zoom Modal */}
      <AttachmentModal
        attachment={selectedAttachment}
        onClose={() => setSelectedAttachment(null)}
      />
    </div>
  );
};
