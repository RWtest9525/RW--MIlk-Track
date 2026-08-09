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

  const defaultQty = user?.vendor?.defaultDailyQuantity ?? 1.5;

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
    try {
      await updateDateLog(
        dateStr,
        status,
        status === 'missed' ? 0 : quantity,
        notes.trim() || undefined
      );
    } catch (err) {
      console.error('Save log error:', err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Daily Delivery"
      subtitle={formatDateTitle(dateStr)}
    >
      <div className="space-y-5 text-slate-900">
        {/* Status Selection Chips */}
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
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
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                status === 'delivered'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm font-extrabold scale-[1.02]'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 size={20} className={status === 'delivered' ? 'text-emerald-600' : 'text-slate-400'} />
              <span className="text-xs font-bold mt-1.5">Delivered</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{defaultQty} Litres</span>
            </button>

            {/* Missed Chip */}
            <button
              type="button"
              onClick={() => {
                setStatus('missed');
                setQuantity(0);
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                status === 'missed'
                  ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm font-extrabold scale-[1.02]'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <XCircle size={20} className={status === 'missed' ? 'text-rose-600' : 'text-slate-400'} />
              <span className="text-xs font-bold mt-1.5">Missed</span>
              <span className="text-[10px] text-slate-500 mt-0.5">0 Litres</span>
            </button>

            {/* Custom Chip */}
            <button
              type="button"
              onClick={() => {
                setStatus('custom');
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                status === 'custom'
                  ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm font-extrabold scale-[1.02]'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <PlusCircle size={20} className={status === 'custom' ? 'text-amber-600' : 'text-slate-400'} />
              <span className="text-xs font-bold mt-1.5">Custom</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Extra Qty</span>
            </button>
          </div>
        </div>

        {/* Quantity Controls (If Delivered or Custom) */}
        {status !== 'missed' && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-700">Quantity (Litres)</label>
              <span className="text-lg font-black text-[#0284C7]">{quantity.toFixed(1)} L</span>
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
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    quantity === preset
                      ? 'bg-cyan-50 border-[#0284C7] text-[#0284C7] font-black'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
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
              className="w-full accent-[#0284C7] cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
            />
          </div>
        )}

        {/* Optional Notes */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
            <MessageSquare size={13} className="text-[#0284C7]" />
            Delivery Note / Reason (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Out of town, Extra milk..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        {/* Submit */}
        <GlassButton
          variant="primary"
          size="lg"
          className="w-full font-black py-3.5 shadow-md shadow-cyan-500/20"
          icon={<Save size={18} />}
          loading={loading}
          onClick={handleSave}
        >
          Save & Update Log
        </GlassButton>
      </div>
    </BottomModal>
  );
};
