import { useState } from 'react';
import { Sidebar } from '@/src/components/Sidebar';
import { Dashboard } from '@/src/components/Dashboard';
import { PublicHome } from '@/src/components/public/PublicHome';
import { PublicChat } from '@/src/components/chat/PublicChat';
import { Services, initialServicesList } from '@/src/components/Services';
import { Professionals, initialProfessionalsList } from '@/src/components/Professionals';
import { Clients, initialClientsList } from '@/src/components/Clients';
import { Agenda } from '@/src/components/Agenda';
import { Products } from '@/src/components/Products';
import { Financial } from '@/src/components/Financial';
import { Settings } from '@/src/components/Settings';
import { Orders } from '@/src/components/Orders';
import { Chat } from '@/src/components/Chat';
import { Vitrine } from '@/src/components/Vitrine';
import { ClientPortalView } from '@/src/components/clients/ClientPortalView';
import { BottomNavigation } from '@/src/components/BottomNavigation';
import { AIAssistantButton } from '@/src/components/AIAssistantButton';
import { AdminAuthModal } from '@/src/components/admin/AdminAuthModal';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { Client, Appointment, ClientPurchase, Service, Professional, ViewType, ChatConversation } from '@/src/types';
import { getInitialPurchases } from '@/src/services/clientStorage';
import { getInitialAppointments } from '@/src/services/agendaStorage';
import { getInitialConversations } from '@/src/services/chatStorage';
import { Menu, Search, Bell, Lock, LogOut, ShieldCheck, Sparkles, UserSquare2 } from 'lucide-react';

export default function App() {
  // Area separation state: 'publica' vs 'administrativa'
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useLocalStorage<boolean>('admin_authenticated_session', false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);

  // Active view states
  const [currentPublicView, setCurrentPublicView] = useState<ViewType>('dashboard');
  const [currentAdminView, setCurrentAdminView] = useState<ViewType>('dashboard');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [portalClient, setPortalClient] = useState<Client | null>(null);

  // Shared state for client portal synchronization
  const [clients] = useLocalStorage<Client[]>('clients', initialClientsList);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', getInitialAppointments());
  const [services] = useLocalStorage<Service[]>('services', initialServicesList);
  const [professionals] = useLocalStorage<Professional[]>('professionals', initialProfessionalsList);
  const [purchases] = useLocalStorage<ClientPurchase[]>('client_purchases', getInitialPurchases());
  const [chatConversations] = useLocalStorage<ChatConversation[]>(
    'chat_conversations', 
    getInitialConversations(initialClientsList, initialProfessionalsList)
  );

  const totalUnreadChat = chatConversations.reduce((acc, curr) => acc + (curr.unreadCountAdmin || 0), 0);

  const handleBookFromPortal = (newApp: Appointment) => {
    setAppointments(prev => [newApp, ...prev]);
  };

  // Access Control Handler
  const handleOpenAdminPanelRequest = () => {
    if (isAdminAuthenticated) {
      setIsAdminMode(true);
    } else {
      setShowAdminAuthModal(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminAuthModal(false);
    setIsAdminMode(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
    setCurrentPublicView('dashboard');
  };

  const handlePublicViewChange = (view: ViewType) => {
    // If user clicks Client in public view
    if (view === 'area_cliente' && !portalClient) {
      setPortalClient(clients[0] || null);
    }

    // Check if view requires admin permissions
    const adminOnlyViews: ViewType[] = ['agenda', 'profissionais', 'clientes', 'servicos', 'produtos', 'pedidos', 'financeiro', 'configuracoes'];
    
    if (adminOnlyViews.includes(view)) {
      if (!isAdminAuthenticated) {
        setShowAdminAuthModal(true);
        return;
      } else {
        setIsAdminMode(true);
        setCurrentAdminView(view);
        return;
      }
    }

    setCurrentPublicView(view);
  };

  const handleAdminViewChange = (view: ViewType) => {
    if (view === 'area_cliente' && !portalClient) {
      setPortalClient(clients[0] || null);
    }
    setCurrentAdminView(view);
  };

  // --------------------------------------------------------------------------
  // RENDER 1: ÁREA PÚBLICA DO SALÃO LUXE
  // --------------------------------------------------------------------------
  const renderPublicView = () => {
    switch (currentPublicView) {
      case 'dashboard':
        return <PublicHome onNavigate={handlePublicViewChange} />;
      case 'area_cliente':
        return (
          <ClientPortalView 
            initialClient={portalClient}
            clients={clients}
            appointments={appointments}
            services={services}
            professionals={professionals}
            purchases={purchases}
            onBackToAdmin={() => handlePublicViewChange('dashboard')}
            onBookAppointment={handleBookFromPortal}
          />
        );
      case 'chat':
        return <PublicChat />;
      case 'vitrine':
        return (
          <Vitrine
            isAdmin={false}
            onNavigateToAgenda={() => handlePublicViewChange('area_cliente')}
            onNavigateToProducts={() => handlePublicViewChange('vitrine')}
          />
        );
      default:
        return <PublicHome onNavigate={handlePublicViewChange} />;
    }
  };

  // --------------------------------------------------------------------------
  // RENDER 2: ÁREA SEGURA ADMINISTRATIVA
  // --------------------------------------------------------------------------
  const renderAdminView = () => {
    switch (currentAdminView) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigateToAgenda={() => setCurrentAdminView('agenda')} 
            onNavigate={(view) => setCurrentAdminView(view)}
          />
        );
      case 'servicos':
        return <Services />;
      case 'agenda':
        return <Agenda />;
      case 'profissionais':
        return <Professionals />;
      case 'clientes':
        return (
          <Clients 
            onOpenClientPortal={(client) => {
              setPortalClient(client);
              setCurrentAdminView('area_cliente');
            }} 
          />
        );
      case 'area_cliente':
        return (
          <ClientPortalView 
            initialClient={portalClient}
            clients={clients}
            appointments={appointments}
            services={services}
            professionals={professionals}
            purchases={purchases}
            onBackToAdmin={() => setCurrentAdminView('clientes')}
            onBookAppointment={handleBookFromPortal}
          />
        );
      case 'produtos':
        return <Products />;
      case 'pedidos':
        return <Orders onNavigateToProducts={() => setCurrentAdminView('produtos')} />;
      case 'financeiro':
        return <Financial />;
      case 'chat':
        return <Chat />;
      case 'vitrine':
        return (
          <Vitrine
            isAdmin={true}
            onNavigateToAgenda={() => setCurrentAdminView('agenda')}
            onNavigateToProducts={() => setCurrentAdminView('produtos')}
          />
        );
      case 'configuracoes':
        return <Settings />;
      default:
        return (
          <Dashboard 
            onNavigateToAgenda={() => setCurrentAdminView('agenda')} 
            onNavigate={(view) => setCurrentAdminView(view)}
          />
        );
    }
  };

  // --------------------------------------------------------------------------
  // RENDER - ÁREA SEGURA (PAINEL ADMINISTRATIVO)
  // --------------------------------------------------------------------------
  if (isAdminMode && isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex relative">
        <Sidebar 
          currentView={currentAdminView} 
          onViewChange={handleAdminViewChange}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          {/* Header Administrativo Protegido */}
          <header className="sticky top-0 z-30 bg-[#080808]/90 backdrop-blur-md border-b border-[#d4af37]/20 px-4 sm:px-8 py-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-[#d4af37] transition-colors"
                title="Alternar Menu Lateral"
              >
                <Menu size={24} />
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-64 focus-within:border-[#d4af37]/50 transition-all">
                <Search size={18} className="text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Pesquisar no sistema..." 
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-neutral-600 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              {/* Badge de área protegida */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} />
                Painel Restrito Admin
              </div>

              <button 
                onClick={() => setCurrentAdminView('chat')}
                className="relative p-2 text-neutral-400 hover:text-[#d4af37] transition-colors"
                title="Mensagens e Alertas"
              >
                <Bell size={22} />
                {totalUnreadChat > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-[#050505]">
                    {totalUnreadChat}
                  </span>
                )}
              </button>

              <div className="h-7 w-[1px] bg-white/10 mx-1" />

              {/* Botão de Encerrar Sessão do Admin */}
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                title="Sair do Painel e Encerrar Sessão"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair do Admin</span>
              </button>
            </div>
          </header>

          {/* Área de Conteúdo Gerencial */}
          <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            {renderAdminView()}
          </div>
        </main>

        {/* Modal de autenticação se necessário */}
        <AdminAuthModal 
          isOpen={showAdminAuthModal}
          onClose={() => setShowAdminAuthModal(false)}
          onLoginSuccess={handleAdminLoginSuccess}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER - ÁREA PÚBLICA DO SALÃO LUXE
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative pb-24">
      {/* Header da Área Pública */}
      <header className="sticky top-0 z-30 bg-[#080808]/90 backdrop-blur-md border-b border-[#d4af37]/20 px-4 sm:px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8a7122] flex items-center justify-center text-black font-extrabold text-sm shadow-md shadow-[#d4af37]/20">
            SL
          </div>
          <div>
            <span className="text-[#d4af37] font-extrabold text-base sm:text-lg tracking-wider block leading-tight">
              SALÃO LUXE
            </span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-medium">
              Unissex & Estética VIP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => setCurrentPublicView('chat')}
            className="relative p-2 text-neutral-400 hover:text-[#d4af37] transition-colors"
            title="Atendimento e Mensagens"
          >
            <Bell size={22} />
            {totalUnreadChat > 0 && (
              <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-[#050505]">
                {totalUnreadChat}
              </span>
            )}
          </button>

          {/* Botão de Acesso Restrito do Administrador */}
          <button
            onClick={handleOpenAdminPanelRequest}
            className="flex items-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
            title="Acessar Painel Gerencial do Salão"
          >
            <Lock size={15} />
            <span className="hidden sm:inline">Área Restrita / Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>
      </header>

      {/* Conteúdo Principal da Área Pública */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {renderPublicView()}
      </main>

      {/* Assistente IA Flutuante na Área Pública */}
      <AIAssistantButton onNavigate={handlePublicViewChange} />

      {/* Navegação Inferior Fixa da Área Pública */}
      <BottomNavigation 
        currentView={currentPublicView} 
        onViewChange={handlePublicViewChange}
        unreadChatCount={totalUnreadChat}
      />

      {/* Modal de Autenticação para Acesso Restrito */}
      <AdminAuthModal 
        isOpen={showAdminAuthModal}
        onClose={() => setShowAdminAuthModal(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
