import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  Sparkles, 
  CheckCheck, 
  Clock, 
  Bot, 
  Phone, 
  MapPin, 
  X,
  ExternalLink,
  MessageCircle,
  Scissors
} from 'lucide-react';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { ChatMessage, ChatConversation, ChatAttachment, Client } from '@/src/types';
import { 
  ADMIN_PARTICIPANT_ID, 
  ADMIN_PARTICIPANT_NAME, 
  broadcastChatUpdate 
} from '@/src/services/chatStorage';
import { initialClientsList } from '@/src/components/Clients';
import { cn } from '@/src/lib/utils';

export const PublicChat: React.FC = () => {
  const [clients] = useLocalStorage<Client[]>('clients', initialClientsList);
  const [storedConversations, setStoredConversations] = useLocalStorage<ChatConversation[]>('chat_conversations', []);
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('chat_messages', []);

  // Use a public client session or default visitor id
  const [publicClient, setPublicClient] = useState<Client>(() => clients[0] || {
    id: 'cli-public-visitor',
    name: 'Visitante Luxe',
    email: 'visitante@salaoluxe.com',
    phone: '(11) 99999-8888',
    status: 'ativo',
    hasPortalAccess: true,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const conversationId = `conv-client-${publicClient.id}`;
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for this public client
  const clientMessages = useMemo(() => {
    return messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, conversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [clientMessages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || inputMessage).trim();
    if (!content && !attachmentPreview) return;

    const timestamp = new Date().toISOString();

    let attachmentObj: ChatAttachment | undefined = undefined;
    if (attachmentPreview && selectedFile) {
      attachmentObj = {
        id: `att-${Date.now()}`,
        url: attachmentPreview,
        name: selectedFile.name,
        type: selectedFile.type.startsWith('image/') ? 'image' : 'file',
        mimeType: selectedFile.type
      };
    }

    const newMsg: ChatMessage = {
      id: `msg-pub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId: conversationId,
      senderId: publicClient.id,
      senderName: publicClient.name,
      senderRole: 'cliente',
      recipientId: ADMIN_PARTICIPANT_ID,
      content: content,
      attachment: attachmentObj,
      status: 'enviada',
      timestamp: timestamp
    };

    // Append to messages
    setMessages(prev => [...prev, newMsg]);

    // Update conversation metadata for admin panel
    const snippet = content || (attachmentObj?.type === 'image' ? '📷 Foto enviada pelo cliente' : '📎 Arquivo enviado');

    setStoredConversations(prev => {
      const idx = prev.findIndex(c => c.id === conversationId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          lastMessage: snippet,
          lastMessageTimestamp: timestamp,
          unreadCountAdmin: (copy[idx].unreadCountAdmin || 0) + 1,
          updatedAt: timestamp
        };
        return copy;
      } else {
        const newConv: ChatConversation = {
          id: conversationId,
          type: 'cliente',
          participantId: publicClient.id,
          participantName: publicClient.name,
          participantPhone: publicClient.phone,
          participantEmail: publicClient.email,
          participantPhotoUrl: publicClient.photoUrl,
          participantRoleDescription: 'Cliente Salão Luxe',
          lastMessage: snippet,
          lastMessageTimestamp: timestamp,
          unreadCountAdmin: 1,
          unreadCountParticipant: 0,
          isOnline: true,
          updatedAt: timestamp
        };
        return [newConv, ...prev];
      }
    });

    // Reset input
    setInputMessage('');
    setSelectedFile(null);
    setAttachmentPreview(null);

    broadcastChatUpdate();
  };

  const handleQuickQuestion = (questionText: string) => {
    handleSendMessage(questionText);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Public Chat Header Banner */}
      <div className="bg-gradient-to-r from-[#14120c] via-[#1c1810] to-[#0a0a0a] border border-[#d4af37]/25 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8a7122] flex items-center justify-center text-black font-extrabold shadow-md shadow-[#d4af37]/20 shrink-0">
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Atendimento Salão Luxe</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-neutral-400 text-xs mt-0.5">
              Tire suas dúvidas em tempo real, consulte disponibilidade ou envie fotos para avaliação dos nossos especialistas.
            </p>
          </div>
        </div>

        {/* WhatsApp Direct Shortcut */}
        <a
          href="https://wa.me/5511999998888?text=Olá,%20gostaria%20de%20informações%20sobre%20atendimento%20no%20Salão%20Luxe."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-900/30 shrink-0"
        >
          <MessageCircle size={16} />
          <span>Atendimento via WhatsApp</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-[#0e0e0e] border border-[#d4af37]/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[580px] relative">
        {/* Chat Sub-Header */}
        <div className="bg-[#141414] border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] font-bold">
              SL
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Recepção & Equipe Luxe</h3>
              <p className="text-[11px] text-neutral-400">Atendimento humanizado e personalizado</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="hidden sm:inline">Identificado como:</span>
            <select
              value={publicClient.id}
              onChange={(e) => {
                const found = clients.find(c => c.id === e.target.value);
                if (found) setPublicClient(found);
              }}
              className="bg-[#1e1e1e] border border-white/10 rounded-lg px-2.5 py-1 text-white text-xs outline-none focus:border-[#d4af37]"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-[#121212] border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider shrink-0 px-1">
            Dúvidas rápidas:
          </span>
          <button
            onClick={() => handleQuickQuestion('Gostaria de saber os horários disponíveis para hoje.')}
            className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 text-neutral-300 rounded-full transition-all text-[11px]"
          >
            📅 Horários disponíveis
          </button>
          <button
            onClick={() => handleQuickQuestion('Qual o valor da escova e tratamento capilar?')}
            className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 text-neutral-300 rounded-full transition-all text-[11px]"
          >
            ✂️ Valores de serviços
          </button>
          <button
            onClick={() => handleQuickQuestion('Como funciona a chave Pix para pagamentos?')}
            className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 text-neutral-300 rounded-full transition-all text-[11px]"
          >
            🔑 Pagamento Pix
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {clientMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 flex items-center justify-center">
                <Sparkles size={28} />
              </div>
              <h4 className="text-white font-bold text-sm">Inicie sua conversa com o Salão Luxe</h4>
              <p className="text-neutral-400 text-xs max-w-xs leading-relaxed">
                Digite sua mensagem abaixo ou clique nas opções rápidas para ser atendido por nossa equipe.
              </p>
            </div>
          ) : (
            clientMessages.map(msg => {
              const isFromClient = msg.senderRole === 'cliente';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isFromClient ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[70%] space-y-1`}>
                    <span className="text-[10px] text-neutral-500 font-medium px-1 block">
                      {isFromClient ? 'Você' : msg.senderName || 'Salão Luxe Admin'}
                    </span>

                    <div
                      className={cn(
                        "p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                        isFromClient
                          ? "bg-[#d4af37] text-black font-medium rounded-br-none"
                          : "bg-[#181818] border border-white/10 text-neutral-200 rounded-bl-none"
                      )}
                    >
                      {msg.content}

                      {/* Attachment preview if any */}
                      {msg.attachment && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-black/10">
                          {msg.attachment.type === 'image' ? (
                            <img src={msg.attachment.url} alt="Anexo" className="max-h-52 w-full object-cover" />
                          ) : (
                            <a
                              href={msg.attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-black/20 text-xs underline block"
                            >
                              📎 {msg.attachment.name}
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-1 text-[9px] text-neutral-500 px-1">
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isFromClient && (
                        <CheckCheck size={12} className={msg.status === 'lida' ? 'text-emerald-400' : 'text-neutral-500'} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Attachment preview strip before sending */}
        {attachmentPreview && (
          <div className="p-2.5 bg-[#161616] border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={attachmentPreview} alt="Anexo" className="w-10 h-10 rounded-lg object-cover border border-white/20" />
              <span className="text-xs text-neutral-300 font-medium truncate max-w-[200px]">
                {selectedFile?.name}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setAttachmentPreview(null);
              }}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#121212] border-t border-white/10 flex items-center gap-2"
        >
          <label
            htmlFor="chat-file-upload"
            className="p-2.5 text-neutral-400 hover:text-[#d4af37] bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
            title="Anexar foto ou imagem"
          >
            <ImageIcon size={18} />
            <input
              id="chat-file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua dúvida ou mensagem para a equipe do Salão Luxe..."
            className="flex-1 bg-white/5 border border-white/10 focus:border-[#d4af37]/60 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none placeholder:text-neutral-500 transition-all"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() && !attachmentPreview}
            className="p-2.5 bg-[#d4af37] disabled:opacity-40 text-black font-extrabold rounded-xl hover:bg-[#b8860b] transition-all shadow-md shadow-[#d4af37]/20"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
