import { useState } from 'react';
import { Sidebar } from '@/src/components/Sidebar';
import { Dashboard } from '@/src/components/Dashboard';
import { Services } from '@/src/components/Services';
import { ComingSoon } from '@/src/components/ComingSoon';
import { ViewType } from '@/src/types';
import { Menu, Search, Bell } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'servicos':
        return <Services />;
      case 'agenda':
        return <ComingSoon title="Agenda" />;
      case 'profissionais':
        return <ComingSoon title="Profissionais" />;
      case 'clientes':
        return <ComingSoon title="Clientes" />;
      case 'produtos':
        return <ComingSoon title="Produtos" />;
      case 'pedidos':
        return <ComingSoon title="Pedidos" />;
      case 'financeiro':
        return <ComingSoon title="Financeiro" />;
      case 'chat':
        return <ComingSoon title="Chat" />;
      case 'vitrine':
        return <ComingSoon title="Vitrine" />;
      case 'configuracoes':
        return <ComingSoon title="Configurações" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md border-b border-[#d4af37]/10 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-64 focus-within:border-[#d4af37]/50 transition-all">
              <Search size={18} className="text-neutral-500" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-neutral-400 hover:text-[#d4af37] transition-colors">
              <Bell size={24} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#050505]" />
            </button>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium">Luxe Admin</span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Gerente</span>
              </div>
              <div className="w-10 h-10 rounded-full ring-2 ring-[#d4af37]/20 p-0.5">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
