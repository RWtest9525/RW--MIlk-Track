import React, { useState, useEffect } from 'react';
import { BottomModal } from '../common/BottomModal';
import { GlassButton } from '../common/GlassButton';
import { useMilk } from '../../context/MilkContext';
import { useAuth } from '../../context/AuthContext';
import { DeliveryStatus } from '../../types';
import { CheckCircle2, XCircle, PlusCircle, Save, MessageSquare } from 'lucide-react';

interface EditDateModalProps {
  isOpen: boolean;
  dateStr: string | null;
  onClose: () => void;
}

export const EditDateModal: React.FC<EditDateModalProps> = ({
  isOpen,
  dateStr,
  onClose,
}) => {
  const { logs, updateDateLog } = useMilk();
  const { user } = useAuth();

  const defaultQty = user?.vendor.defaultDailyQuantity ?? 1.5;

  const [status, setStatus] = useState<DeliveryStatus>('delivered');
  const [quantity, setQuantity] = useState<number>(defaultQty);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (dateStr && logs[dateStr]) {
      const log = logs[dateStr];
      setStatus(log.status);
      setQuantity(log.quantity);
      setNotes(log.notes || '');
    } else {
      setStatus('delivered');
      setQuantity(defaultQty);
      setNotes('');
    }
  }, [dateStr, logs, defaultQty]);

  if (!dateStr) return null;

  const formatDateTitle = (dStr: string) => {
    const parts = dStr.split('-');
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleSave = async () => {
    setLoading(true);
    await updateDateLog(
      dateStr,
      status,
      status === 'missed' ? 0 : quantity,
      notes.trim() || undefined
    );
    setLoading(false);
    onClose();
  };

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Daily Delivery"
      subtitle={formatDateTitle(dateStr)}
    >
      <div className="space-y-5">
        {/* Status Selection Chips */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Delivery Status
          </label>

          <div className="grid grid-cols-3 gap-2">
            {/* Delivered Chip */}
            <button
              type="button"
              onClick={() => {
                setStatus('delivered');
                setQuantity(defaultQty);
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                status === 'delivered'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-950/50 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 size={20} className={status === 'delivered' ? 'text-emerald-400' : 'text-slate-500'} />
              <span className="text-xs font-bold mt-1.5">Delivered</span>
              <span className="text-[10px] opacity-75 mt-0.5">{defaultQty} Litres</span>
            </button>

            {/* Missed Chip */}
            <button
              type="button"
              onClick={() => {
                setStatus('missed');
                setQuantity(0);
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                status === 'missed'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-lg shadow-rose-950/50 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <XCircle size={20} className={status === 'missed' ? 'text-rose-400' : 'text-slate-500'} />
              <span className="text-xs font-bold mt-1.5">Missed</span>
              <span className="text-[10px] opacity-75 mt-0.5">0 Litres</span>
            </button>

            {/* Custom Chip */}
            <button
              type="button"
              onClick={() => {
                setStatus('custom');
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                status === 'custom'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-950/50 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <PlusCircle size={20} className={status === 'custom' ? 'text-amber-400' : 'text-slate-500'} />
              <span className="text-xs font-bold mt-1.5">Custom</span>
              <span className="text-[10px] opacity-75 mt-0.5">Extra / Custom</span>
            </button>
          </div>
        </div>

        {/* Quantity Controls (If Delivered or Custom) */}
        {status !== 'missed' && (
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Quantity (Litres)</label>
              <span className="text-lg font-black text-cyan-300">{quantity.toFixed(1)} L</span>
            </div>

            {/* Presets */}
            <div className="flex gap-2">
              {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setQuantity(preset);
                    if (preset !== defaultQty) setStatus('custom');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    quantity === preset
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {preset}L
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={quantity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setQuantity(val);
                if (val !== defaultQty) setStatus('custom');
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>
        )}

        {/* Optional Notes */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <MessageSquare size={13} className="text-cyan-400" />
            Delivery Note / Override Reason
          </label>
          <input
            type="text"
            placeholder="e.g. Out of town, Extra guests visiting..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Submit */}
        <GlassButton
          variant="primary"
          size="lg"
          className="w-full"
          icon={<Save size={18} />}
          loading={loading}
          onClick={handleSave}
        >
          Save & Update Calendar
        </GlassButton>
      </div>
    </BottomModal>
  );
};
