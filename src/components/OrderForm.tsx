import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Check, Loader2, Shield, Users, Network, Router, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const orderSchema = z.object({
  email: z.string().trim().email({ message: 'Введите корректный email' }).max(255),
  telegram: z.string()
    .trim()
    .min(1, { message: 'Введите Telegram username' })
    .max(50)
    .refine(val => val.startsWith('@') || /^[a-zA-Z0-9_]{5,}$/.test(val), {
      message: 'Введите username в формате @username'
    }),
  tariff: z.enum(['solo', 'family', 'community', 'hardware'], {
    required_error: 'Выберите тариф'
  }),
  comment: z.string().trim().max(500).optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

const tariffs = [
  { 
    id: 'solo' as const, 
    name: 'SOLO', 
    price: '300₽', 
    icon: Shield, 
    color: 'primary',
    description: '3 устройства',
    popular: false
  },
  { 
    id: 'family' as const, 
    name: 'FAMILY', 
    price: '650₽', 
    icon: Users, 
    color: 'accent',
    description: '10 устройств',
    popular: true
  },
  { 
    id: 'community' as const, 
    name: 'COMMUNITY', 
    price: '1200₽', 
    icon: Network, 
    color: '[#B10000]',
    description: '25 устройств',
    popular: false
  },
  { 
    id: 'hardware' as const, 
    name: 'HARDWARE', 
    price: '1500₽', 
    icon: Router, 
    color: 'gray-400',
    description: 'Готовый роутер',
    popular: false
  },
];

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTariff?: string;
}

export const OrderForm = ({ isOpen, onClose, defaultTariff }: OrderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      tariff: (defaultTariff as OrderFormData['tariff']) || undefined,
    }
  });

  const selectedTariff = watch('tariff');

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Order submitted:', data);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в Telegram в течение часа.",
    });

    setTimeout(() => {
      setIsSuccess(false);
      reset();
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto z-50 p-4"
          >
            <div className="relative rounded-2xl border border-primary/20 bg-background/95 backdrop-blur-xl shadow-2xl shadow-primary/10">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-4">
                    <Shield className="h-3 w-3" />
                    ORDER_VPN
                  </div>
                  <h2 className="text-2xl font-bold font-['Montserrat']">
                    Оформить <span className="text-primary">заявку</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Мы свяжемся с вами в Telegram для настройки
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="py-12 text-center"
                    >
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Заявка принята!</h3>
                      <p className="text-muted-foreground">Ожидайте сообщения в Telegram</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Tariff Selection */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Выберите тариф</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {tariffs.map((tariff) => {
                            const Icon = tariff.icon;
                            const isSelected = selectedTariff === tariff.id;
                            
                            return (
                              <button
                                key={tariff.id}
                                type="button"
                                onClick={() => setValue('tariff', tariff.id)}
                                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                                  isSelected
                                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_hsl(73_100%_50%/0.2)]'
                                    : 'border-border hover:border-primary/50 bg-card/50'
                                }`}
                              >
                                {tariff.popular && (
                                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-accent text-[10px] font-bold text-background">
                                    ХИТ
                                  </span>
                                )}
                                <Icon className={`h-5 w-5 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                <div className="font-bold text-sm">{tariff.name}</div>
                                <div className="text-xs text-muted-foreground">{tariff.description}</div>
                                <div className={`text-lg font-bold mt-1 ${isSelected ? 'text-primary' : ''}`}>
                                  {tariff.price}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {errors.tariff && (
                          <p className="text-sm text-destructive">{errors.tariff.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          {...register('email')}
                          className={`bg-background/50 border-border focus:border-primary ${
                            errors.email ? 'border-destructive' : ''
                          }`}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Telegram */}
                      <div className="space-y-2">
                        <Label htmlFor="telegram">Telegram</Label>
                        <Input
                          id="telegram"
                          placeholder="@username"
                          {...register('telegram')}
                          className={`bg-background/50 border-border focus:border-primary ${
                            errors.telegram ? 'border-destructive' : ''
                          }`}
                        />
                        {errors.telegram && (
                          <p className="text-sm text-destructive">{errors.telegram.message}</p>
                        )}
                      </div>

                      {/* Comment */}
                      <div className="space-y-2">
                        <Label htmlFor="comment">Комментарий (опционально)</Label>
                        <Textarea
                          id="comment"
                          placeholder="Дополнительные пожелания..."
                          {...register('comment')}
                          className="bg-background/50 border-border focus:border-primary resize-none min-h-[80px]"
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 transition-all duration-300 hover:shadow-[0_0_30px_hsl(73_100%_50%/0.4)]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Отправляем...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Отправить заявку
                          </>
                        )}
                      </Button>

                      {/* Privacy note */}
                      <p className="text-[10px] text-center text-muted-foreground">
                        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
