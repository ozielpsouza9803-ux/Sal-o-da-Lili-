import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  ShoppingBag, 
  MessageSquare, 
  Store, 
  Scissors, 
  Clock, 
  MapPin, 
  Phone, 
  ChevronRight, 
  CheckCircle2, 
  Star,
  UserSquare2,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { Service, Product, ViewType, PixConfig } from '@/src/types';
import { initialServicesList } from '@/src/components/Services';
import { getInitialProducts } from '@/src/services/productStorage';
import { formatCurrency } from '@/src/lib/utils';

interface PublicHomeProps {
  onNavigate: (view: ViewType) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onNavigate }) => {
  const [services] = useLocalStorage<Service[]>('services', initialServicesList);
  const [products] = useLocalStorage<Product[]>('products', getInitialProducts());
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

  const featuredServices = services.slice(0, 4);
  const featuredProducts = products.filter(p => p.status === 'ativo').slice(0, 4);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">
      {/* 1. Public Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14120c] via-[#1c1810] to-[#0a0a0a] border border-[#d4af37]/30 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-xs font-extrabold uppercase tracking-widest">
            <Sparkles size={14} />
            Experiência VIP em Beleza & Estética
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Salão Luxe <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#b8860b]">Unissex</span>
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Especialistas renomados em cortes, coloração, tratamentos capilares, barba e estética. Agende seu horário online ou explore nossa vitrine exclusiva.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('area_cliente')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#d4af37] text-black font-extrabold text-xs sm:text-sm rounded-xl hover:bg-[#b8860b] transition-all shadow-xl shadow-[#d4af37]/20"
            >
              <Calendar size={18} />
              Agendar Horário Online
            </button>

            <button
              onClick={() => onNavigate('vitrine')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
            >
              <Store size={18} className="text-[#d4af37]" />
              Explorar Vitrine Digital
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
            >
              <MessageSquare size={18} className="text-[#d4af37]" />
              Chat de Atendimento
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Features Grid for Clients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101010] border border-[#d4af37]/20 p-5 rounded-2xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center shrink-0 border border-[#d4af37]/20">
            <Scissors size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Profissionais VIP</h4>
            <p className="text-neutral-400 text-xs mt-0.5">Equipe altamente qualificada para cada estilo.</p>
          </div>
        </div>

        <div className="bg-[#101010] border border-[#d4af37]/20 p-5 rounded-2xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center shrink-0 border border-[#d4af37]/20">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Agendamento Fácil</h4>
            <p className="text-neutral-400 text-xs mt-0.5">Escolha data, horário e profissional em segundos.</p>
          </div>
        </div>

        <div className="bg-[#101010] border border-[#d4af37]/20 p-5 rounded-2xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center shrink-0 border border-[#d4af37]/20">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Produtos Exclusivos</h4>
            <p className="text-neutral-400 text-xs mt-0.5">Linha de cuidados capilares para uso em casa.</p>
          </div>
        </div>

        <div className="bg-[#101010] border border-[#d4af37]/20 p-5 rounded-2xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center shrink-0 border border-[#d4af37]/20">
            <CreditCard size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Pagamento Pix</h4>
            <p className="text-neutral-400 text-xs mt-0.5">Confirmação e validação do sinal na hora.</p>
          </div>
        </div>
      </div>

      {/* 3. Featured Services Showcase */}
      <div className="bg-[#101010] border border-[#d4af37]/20 p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Scissors size={20} className="text-[#d4af37]" />
              Serviços Populares no Salão Luxe
            </h3>
            <p className="text-neutral-400 text-xs mt-0.5">Confira os procedimentos mais buscados por nossos clientes</p>
          </div>
          <button
            onClick={() => onNavigate('vitrine')}
            className="text-xs font-bold text-[#d4af37] hover:underline flex items-center gap-1"
          >
            Ver Vitrine Completa <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredServices.map(service => (
            <div
              key={service.id}
              className="p-5 bg-[#161616] border border-white/5 rounded-2xl hover:border-[#d4af37]/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold uppercase rounded">
                  {service.category}
                </span>
                <h4 className="text-white font-bold text-sm mt-2">{service.name}</h4>
                <p className="text-neutral-400 text-xs mt-1">{service.duration} minutos de atendimento</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[#d4af37] font-extrabold text-sm">{formatCurrency(service.price)}</span>
                <button
                  onClick={() => onNavigate('area_cliente')}
                  className="px-3 py-1.5 bg-[#d4af37] text-black font-bold text-xs rounded-lg hover:bg-[#b8860b] transition-colors"
                >
                  Agendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Products Boutique Showcase */}
      <div className="bg-[#101010] border border-[#d4af37]/20 p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#d4af37]" />
              Produtos em Destaque
            </h3>
            <p className="text-neutral-400 text-xs mt-0.5">Leve a qualidade do Salão Luxe para a sua rotina diária</p>
          </div>
          <button
            onClick={() => onNavigate('vitrine')}
            className="text-xs font-bold text-[#d4af37] hover:underline flex items-center gap-1"
          >
            Comprar na Vitrine <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map(product => (
            <div
              key={product.id}
              className="p-4 bg-[#161616] border border-white/5 rounded-2xl hover:border-[#d4af37]/40 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-40 bg-neutral-900 rounded-xl overflow-hidden border border-white/10">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-white font-bold text-sm line-clamp-1">{product.name}</h4>
                <p className="text-neutral-400 text-xs line-clamp-2">{product.description}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[#d4af37] font-extrabold text-sm">{formatCurrency(product.price)}</span>
                <button
                  onClick={() => onNavigate('vitrine')}
                  className="px-3 py-1.5 bg-white/10 hover:bg-[#d4af37] hover:text-black text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Location, Hours & Pix Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salon Contact */}
        <div className="bg-[#101010] border border-[#d4af37]/20 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin size={18} className="text-[#d4af37]" />
            Localização e Contato
          </h3>
          <div className="space-y-3 text-xs text-neutral-300">
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-[#d4af37] shrink-0" />
              <span>Av. Paulista, 1000 - Bela Vista, São Paulo - SP</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} className="text-[#d4af37] shrink-0" />
              <span>WhatsApp / Recepção: (11) 99999-8888</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock size={16} className="text-[#d4af37] shrink-0" />
              <span>Terça a Sábado das 09h às 20h</span>
            </p>
          </div>
        </div>

        {/* Pix Key Config for Clients */}
        <div className="bg-[#101010] border border-[#d4af37]/20 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard size={18} className="text-[#d4af37]" />
            Pagamentos Pix Oficiais
          </h3>
          <div className="p-3.5 bg-[#161616] border border-[#d4af37]/30 rounded-2xl space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Chave Pix CNPJ:</span>
              <span className="text-white font-mono font-bold">{pixConfig.key}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Favorecido:</span>
              <span className="text-white font-bold">{pixConfig.receiverName}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Cidade:</span>
              <span className="text-white font-bold">{pixConfig.receiverCity}</span>
            </div>
          </div>
          <p className="text-[11px] text-neutral-400">
            Pagamentos via Pix são validados automaticamente com geração de comprovante digital.
          </p>
        </div>
      </div>
    </div>
  );
};
