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
  ArrowDownRight
} from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';

const data = [
  { name: 'Seg', vlr: 4000 },
  { name: 'Ter', vlr: 3000 },
  { name: 'Qua', vlr: 2000 },
  { name: 'Qui', vlr: 2780 },
  { name: 'Sex', vlr: 1890 },
  { name: 'Sáb', vlr: 2390 },
  { name: 'Dom', vlr: 3490 },
];

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

export const Dashboard: React.FC = () => {
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
          title="Faturamento" 
          value={formatCurrency(12450.80)} 
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
          color="bg-amber-600"
        />
        <StatCard 
          title="Novos Clientes" 
          value="48" 
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
          color="bg-blue-600"
        />
        <StatCard 
          title="Agendamentos" 
          value="156" 
          icon={Calendar}
          trend={{ value: 2.4, isPositive: false }}
          color="bg-purple-600"
        />
        <StatCard 
          title="Vendas" 
          value="34" 
          icon={ShoppingBag}
          trend={{ value: 15.7, isPositive: true }}
          color="bg-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Desempenho Semanal</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
            <button className="text-xs font-medium text-[#d4af37] hover:underline">Ver tudo</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-[#d4af37] font-bold">
                    {item === 1 ? 'JS' : item === 2 ? 'MC' : 'PL'}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">
                      {item === 1 ? 'Julia Santos' : item === 2 ? 'Marcos Costa' : 'Paula Lima'}
                    </h4>
                    <p className="text-neutral-500 text-xs">Corte de Cabelo + Escova</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">14:30</p>
                  <p className="text-[#d4af37] text-xs font-medium">Confirmado</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
