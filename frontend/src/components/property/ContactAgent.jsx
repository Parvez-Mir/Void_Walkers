import { useState } from 'react';
import { Phone, MessageCircle, Calendar, User } from 'lucide-react';

export function ContactAgent({ builder }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !phone) return;
    // TODO: wire to /api/v1/leads when the endpoint is ready
    setSubmitted(true);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <User className="w-7 h-7 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-foreground">Sales Team</h3>
          <p className="text-sm text-muted-foreground truncate">{builder}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-600">Available now</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-semibold py-2.5 shadow-lg shadow-amber-500/30 transition"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold py-2.5 transition"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
      </div>

      {submitted ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
          <p className="text-sm font-medium text-emerald-800">Got it.</p>
          <p className="text-xs text-emerald-700 mt-1">The sales team will reach out shortly.</p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-sm font-medium text-foreground">Request a callback</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none px-3 py-2.5 text-sm"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            type="tel"
            className="w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 transition"
          >
            <Calendar className="w-4 h-4" />
            Schedule Visit
          </button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          Your data is secure and only shared with the verified developer.
        </p>
      </div>
    </div>
  );
}
