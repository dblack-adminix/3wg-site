import { motion } from 'framer-motion';
import { Wrench, Clock } from 'lucide-react';

export const Maintenance = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      
      {/* Background Image */}
      <div className="absolute inset-0 flex items-center justify-center pt-32">
        <img 
          src="/images/maintenance-bg.png" 
          alt="" 
          className="max-w-4xl w-full opacity-40"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block mb-8"
        >
          <Wrench className="w-24 h-24 text-primary mx-auto drop-shadow-[0_0_20px_rgba(115,255,0,0.8)]" />
        </motion.div>

        <h1 
          className="text-4xl md:text-6xl font-bold font-mono-tech mb-4"
          style={{
            textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(115,255,0,0.5), 2px 2px 4px rgba(0,0,0,1)'
          }}
        >
          Технические работы
        </h1>
        
        <div className="bg-black/70 backdrop-blur-md rounded-lg p-6 mb-8 border border-primary/20">
          <p className="text-xl text-white font-mono">
            Сайт временно недоступен. Мы проводим плановое обслуживание для улучшения сервиса.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-white font-mono mb-12 bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 inline-flex">
          <Clock className="w-5 h-5 text-primary" />
          <span>Ожидаемое время: скоро вернемся</span>
        </div>

        <div className="p-6 rounded-lg border border-primary/30 bg-black/80 backdrop-blur-md">
          <p className="text-sm font-mono text-white">
            💡 Если у вас есть активные VPN ключи, они продолжают работать в обычном режиме.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Maintenance;
