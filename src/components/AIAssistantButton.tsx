import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { Service, Product, PixConfig, ViewType } from '@/src/types';
import { initialServicesList } from '@/src/components/Services';
import { getInitialProducts } from '@/src/services/productStorage';
import { formatCurrency } from '@/src/lib/utils';

export interface SalonSettings {
  salonName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  pixKey: string;
  receiverName: string;
  city: string;
}

interface AIAssistantButtonProps {
  onNavigate?: (view: ViewType) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  action?: {
    label: string;
    view: ViewType;
  };
}

export const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [services] = useLocalStorage<Service[]>('services', initialServicesList);
  const [products] = useLocalStorage<Product[]>('products', getInitialProducts());
  const [settings] = useLocalStorage<SalonSettings>('salon_settings', {
    salonName: 'Salão Luxe',
    phone: '(11) 99999-8888',
    whatsapp: '(11) 99999-8888',
    email: 'contato@salaoluxe.com',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    openingHours: 'Terça a Sábado das 09h às 20h',
    pixKey: '12345678000195',
    receiverName: 'Salão Luxe LTDA',
    city: 'São Paulo'
  });
  const [pixConfig] = useLocalStorage<PixConfig>('pix_config', {
    keyType: 'cnpj',
    key: '12345678000195',
    receiverName: 'Salão Luxe LTDA',
    receiverCity: 'São Paulo',
    gatewayProvider: 'manual',
    autoWebhookEnabled: true,
    webhookSecret: 'whsec_luxe_live',
    webhookEndpoint: 'https://api.salaoluxe.com/webhooks/pix'
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Olá! Sou a Assistente IA do Salão Luxe. Como posso ajudar você hoje?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleQuickQuestion = (question: string) => {
    processUserInput(question);
  };

  const processUserInput = (userInputText: string) => {
    const text = userInputText.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let responseText = '';
      let action: { label: string; view: ViewType } | undefined;

      const lower = text.toLowerCase();

      if (lower.includes('agendar') || lower.includes('reserva') || lower.includes('horário') || lower.includes('agendamento')) {
        const topServices = services.slice(0, 3).map(s => `• ${s.name} (${formatCurrency(s.price)})`).join('\n');
        responseText = `Você pode realizar seu agendamento diretamente na Área do Cliente ou na Vitrine de Serviços!\n\nServiços mais procurados:\n${topServices}`;
        action = { label: 'Ir para Área do Cliente', view: 'area_cliente' };
      } else if (lower.includes('pix') || lower.includes('pagamento') || lower.includes('pagar') || lower.includes('chave')) {
        const key = pixConfig.key || settings.pixKey || '12345678000195';
        const receiver = pixConfig.receiverName || settings.receiverName || 'Salão Luxe';
        responseText = `Chave Pix Oficial do Salão Luxe:\n\n• Chave: ${key}\n• Recebedor: ${receiver}\n• Cidade: ${pixConfig.receiverCity || 'São Paulo'}\n\nApós realizar a transferência Pix, o seu comprovante é validado automaticamente no sistema!`;
        action = { label: 'Ver Vitrine & Sacola', view: 'vitrine' };
      } else if (lower.includes('produto') || lower.includes('shampoo') || lower.includes('comprar') || lower.includes('estoque')) {
        const topProducts = products.filter(p => p.status === 'ativo').slice(0, 3).map(p => `• ${p.name} - ${formatCurrency(p.price)}`).join('\n');
        responseText = `Confira os produtos de alta performance disponíveis em nosso estoque:\n\n${topProducts}\n\nVocê pode adicionar os produtos à sacola na Vitrine Digital ou em Produtos!`;
        action = { label: 'Abrir Vitrine', view: 'vitrine' };
      } else if (lower.includes('contato') || lower.includes('whatsapp') || lower.includes('telefone') || lower.includes('endereço')) {
        responseText = `Informações de Contato e Localização do Salão Luxe:\n\n• WhatsApp: ${settings.whatsapp}\n• Telefone: ${settings.phone}\n• Endereço: ${settings.address}\n• Horário: ${settings.openingHours}`;
        action = { label: 'Atendimento via Chat', view: 'chat' };
      } else if (lower.includes('serviço') || lower.includes('preço') || lower.includes('valor')) {
        const list = services.slice(0, 4).map(s => `• ${s.name}: ${formatCurrency(s.price)} (${s.duration} min)`).join('\n');
        responseText = `Tabela principal de serviços do Salão Luxe:\n\n${list}\n\nAtendemos cabelo, barba, estética e unhas com profissionais renomados.`;
        action = { label: 'Ver Todos na Vitrine', view: 'vitrine' };
      } else {
        responseText = `Entendido! No Salão Luxe você conta com serviços de beleza de alto padrão, vitrine de produtos e agendamento online imediato.\n\nComo deseja prosseguir?`;
        action = { label: 'Navegar para Início', view: 'dashboard' };
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 400);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 group flex items-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#b8860b] text-black font-extrabold px-4 py-3 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#fff8dc]"
        title="Assistente IA Luxe"
      >
        <div className="relative">
          <Sparkles size={20} className="animate-spin-slow text-black" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-600 rounded-full animate-ping" />
        </div>
        <span className="text-xs tracking-wider uppercase hidden sm:inline-block">
          Assistente IA
        </span>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 sm:bottom-28 right-2 sm:right-6 z-50 w-[95vw] sm:w-[380px] max-h-[520px] bg-[#0d0d0d] border border-[#d4af37]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#111111] via-[#1a1810] to-[#111111] border-b border-[#d4af37]/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a7122] flex items-center justify-center text-black font-bold shadow-md">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Assistente IA Luxe
                  <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-1.5 py-0.2 rounded font-semibold uppercase">
                    24/7
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400">Atendimento inteligente em tempo real</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-[#141414] border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => handleQuickQuestion('Quais os serviços mais procurados?')}
              className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 text-neutral-300 rounded-full transition-all text-[11px]"
            >
              ✂️ Serviços
            </button>
            <button
              onClick={() => handleQuickQuestion('Como fazer um agendamento?')}
              className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 text-neutral-300 rounded-full transition-all text-[11px]"
            >
              📅 Agendar
            </button>
            <button
              onClick={() => handleQuickQuestion('Qual a chave Pix do salão?')}
              className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 text-neutral-300 rounded-full transition-all text-[11px]"
            >
              🔑 Pix
            </button>
            <button
              onClick={() => handleQuickQuestion('Produtos em estoque')}
              className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 text-neutral-300 rounded-full transition-all text-[11px]"
            >
              🛍️ Produtos
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[300px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center shrink-0 mb-1">
                      <Bot size={13} />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-[#d4af37] text-black font-medium rounded-br-none shadow-sm'
                        : 'bg-[#181818] border border-white/10 text-neutral-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}

                    {/* Action Button inside AI message */}
                    {msg.action && onNavigate && (
                      <button
                        onClick={() => {
                          onNavigate(msg.action!.view);
                          setIsOpen(false);
                        }}
                        className="mt-2.5 w-full flex items-center justify-between gap-1.5 px-3 py-1.5 bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#d4af37] hover:text-black border border-[#d4af37]/40 rounded-xl font-bold transition-all text-[11px]"
                      >
                        <span>{msg.action.label}</span>
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <span className="text-[9px] text-neutral-500 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processUserInput(input);
            }}
            className="p-3 bg-[#111111] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-white/5 border border-white/10 focus:border-[#d4af37]/50 text-white rounded-xl px-3.5 py-2 text-xs outline-none placeholder:text-neutral-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-[#d4af37] disabled:opacity-40 text-black font-bold rounded-xl hover:bg-[#b8860b] transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
