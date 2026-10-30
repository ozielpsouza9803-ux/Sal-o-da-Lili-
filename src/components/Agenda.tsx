import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Plus, Filter, Calendar as CalendarIcon, User } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Agenda: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Agenda</h1>
          <p className="text-neutral-400 mt-1">Organize seus horários e atendimentos com eficiência.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af37]/90 transition-all shadow-lg">
          <Plus size={20} />
          Agendar Cliente
        </button>
      </div>

      <div className="bg-[#111111] border border-[#d4af37]/10 rounded-2xl overflow-hidden">
        {/* Calendar Header */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white min-w-[180px]">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-lg text-neutral-400"><ChevronLeft size={20} /></button>
              <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg text-neutral-400"><ChevronRight size={20} /></button>
            </div>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-xs font-medium bg-white/5 hover:bg-white/10 rounded-md text-neutral-400 transition-colors"
            >
              Hoje
            </button>
          </div>

          <div className="flex bg-black/40 border border-white/10 rounded-lg p-1">
            {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                  viewMode === mode ? "bg-[#d4af37] text-black" : "text-neutral-400 hover:text-white"
                )}
              >
                {mode === 'daily' ? 'Diário' : mode === 'weekly' ? 'Semanal' : 'Mensal'}
              </button>
            ))}
          </div>
        </div>

        {/* Monthly Grid */}
        {viewMode === 'monthly' && (
          <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="text-center text-xs font-bold text-neutral-600 uppercase py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden">
              {calendarDays.map((day, i) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());

                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "min-h-[100px] p-2 bg-[#0d0d0d] hover:bg-white/5 transition-colors cursor-pointer group relative",
                      !isCurrentMonth && "opacity-20"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ml-auto transition-all",
                      isSelected ? "bg-[#d4af37] text-black" : isToday ? "text-[#d4af37]" : "text-neutral-400"
                    )}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      {isSameDay(day, addDays(new Date(), 1)) && (
                        <div className="px-2 py-0.5 bg-[#d4af37]/20 border border-[#d4af37]/30 rounded text-[10px] text-[#d4af37] font-bold truncate">
                          Corte Masculino
                        </div>
                      )}
                      {isSameDay(day, addDays(new Date(), 3)) && (
                        <div className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-[10px] text-blue-400 font-bold truncate">
                          Coloração
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Placeholder for Daily/Weekly */}
        {viewMode !== 'monthly' && (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto text-[#d4af37]">
              <Clock size={32} />
            </div>
            <p className="text-neutral-500">Visualização {viewMode === 'daily' ? 'diária' : 'semanal'} em desenvolvimento.</p>
          </div>
        )}
      </div>

      {/* Selected Day Agenda Summary */}
      <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon size={20} className="text-[#d4af37]" />
            Horários de {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
          <span className="text-xs text-neutral-500 font-medium">3 agendamentos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { time: '09:00', client: 'Marcos Oliveira', service: 'Corte + Barba', professional: 'Ricardo Silva' },
            { time: '10:30', client: 'Ana Paula', service: 'Mechas Premium', professional: 'Ana Oliveira' },
            { time: '14:00', client: 'Rafael Souza', service: 'Corte Degradê', professional: 'Ricardo Silva' },
          ].map((appointment, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl hover:border-[#d4af37]/20 transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[#d4af37] font-bold">{appointment.time}</span>
                <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded">Confirmado</div>
              </div>
              <h4 className="text-white font-bold mb-1">{appointment.client}</h4>
              <p className="text-neutral-400 text-xs mb-3">{appointment.service}</p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-[#d4af37]">
                  {appointment.professional.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-neutral-500 text-[10px] uppercase font-bold">{appointment.professional}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
