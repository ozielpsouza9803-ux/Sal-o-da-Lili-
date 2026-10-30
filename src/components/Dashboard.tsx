import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { Appointment, Client, Order, Expense } from '@/src/types';
import { getInitialAppointments, STATUS_LABELS } from '@/src/services/agendaStorage';
import { initialClientsList } from '@/src/components/Clients';
import { getInitialOrders } from '@/src/services/productStorage';
import { getInitialExpenses, getFinancialDashboardMetrics } from '@/src/services/financialStorage';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl hover:border-[#d4af37]/30 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          trend.isPositive ? "text-emerald-400" : "text-rose-400"
        )}>
          {trend.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trend.value}%
        </div>
      )}
    </div>
    <h3 className="text-neutral-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
  </div>
);

interface DashboardProps {
  onNavigateToAgenda?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToAgenda }) => {
  const [appointments] = useLocalStorage<Appointment[]>('appointments', getInitialAppointments());
  const [clients] = useLocalStorage<Client[]>('clients', initialClientsList);
  const [orders] = useLocalStorage<Order[]>('orders', getInitialOrders());
  const [expenses] = useLocalStorage<Expense[]>('expenses', getInitialExpenses());

  const metrics = getFinancialDashboardMetrics({
    appointments,
    orders,
    expenses
  });

  // Upcoming appointments
  const upcomingAppointments = [...appointments]
    .filter(a => a.status !== 'cancelado')
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Painel Executivo</h1>
          <p className="text-neutral-400 mt-1">Bem-vindo de volta! Aqui está o resumo do seu salão hoje.</p>
        </div>
        <div className="hidden md:block">
          <div className="flex bg-[#111111] border border-[#d4af37]/20 rounded-lg p-1">
            <button className="px-4 py-1.5 text-xs font-medium text-[#d4af37] bg-[#d4af37]/10 rounded-md">Hoje</button>
            <button className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-white">Semana</button>
            <button className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-white">Mês</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Faturamento Bruto" 
          value={formatCurrency(metrics.totalGrossRevenue)} 
          icon={TrendingUp}
          color="bg-amber-600"
        />
        <StatCard 
          title="Clientes Ativos" 
          value={String(clients.length)} 
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard 
          title="Agendamentos" 
          value={String(metrics.appointmentCount)} 
          icon={Calendar}
          color="bg-purple-600"
        />
        <StatCard 
          title="Vendas Pagas" 
          value={String(metrics.paidOrdersCount)} 
          icon={ShoppingBag}
          color="bg-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Desempenho Semanal Real</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.weeklyChartData}>
                <defs>
                  <linearGradient id="colorVlr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#d4af37', borderRadius: '12px' }}
                  itemStyle={{ color: '#d4af37' }}
                  formatter={(val: any) => [formatCurrency(Number(val) || 0), 'Faturamento']}
                />
                <Area 
                  type="monotone" 
                  dataKey="vlr" 
                  stroke="#d4af37" 
                  fillOpacity={1} 
                  fill="url(#colorVlr)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Próximos Agendamentos</h2>
            {onNavigateToAgenda && (
              <button 
                onClick={onNavigateToAgenda}
                className="text-xs font-bold text-[#d4af37] hover:underline"
              >
                Abrir Agenda
              </button>
            )}
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((app) => {
              const statusInfo = STATUS_LABELS[app.status] || STATUS_LABELS.confirmado;
              const initials = app.clientName.split(' ').map(n => n[0]).slice(0, 2).join('');

              return (
                <div 
                  key={app.id} 
                  onClick={onNavigateToAgenda}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#d4af37]/30 hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-[#d4af37] font-bold text-xs">
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-semibold group-hover:text-[#d4af37] transition-colors">
                        {app.clientName}
                      </h4>
                      <p className="text-neutral-400 text-xs">
                        {app.serviceNames.join(' + ')} • <span className="text-neutral-500">{app.professionalName}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xs font-bold flex items-center gap-1 justify-end">
                      <Clock size={12} className="text-[#d4af37]" />
                      {app.startTime} ({app.date})
                    </p>
                    <span className={cn(
                      "text-[10px] font-bold uppercase",
                      statusInfo.text
                    )}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {upcomingAppointments.length === 0 && (
              <div className="py-12 text-center text-neutral-500 text-xs">
                Nenhum agendamento futuro no momento.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
