import { Phone, MessageCircle, User, Handshake, ShieldCheck, ArrowRight } from 'lucide-react';

export function ContactAgent({ builder }) {
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

      {/* Trusted partner CTA */}
      <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/40 border border-amber-200 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-white border border-amber-200 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Handshake className="w-5 h-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-foreground">Connect with our Trusted Partner</h4>
            <p className="text-xs text-muted-foreground mt-1">
              End-to-end transaction support — site visits, paperwork, registration, and post-purchase setup handled by verified local partners vetted for NRI buyers.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 transition"
        >
          <Handshake className="w-4 h-4" />
          Connect Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <p className="text-xs text-center text-muted-foreground">
          Only shared with verified partners that meet our trust criteria.
        </p>
      </div>
    </div>
  );
}
