import { MapPin, Bed, Maximize, Building, Calendar, Compass, Shield, Heart, Share2 } from 'lucide-react';

export function PropertyHeader({ property }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
      <div className="flex flex-wrap gap-2 mb-4">
        {property.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-1 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            RERA Verified
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2.5 py-1 text-xs font-semibold">
          AI Analyzed
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {property.age}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {property.name}
          </h1>
          <p className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
            <span>{property.fullAddress}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            By <span className="text-amber-600 font-medium">{property.builder}</span>
            {property.projectName && property.projectName !== 'NA' && (
              <> • {property.projectName}</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition"
          >
            <Heart className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Price</p>
          <p className="text-3xl md:text-4xl font-bold text-amber-600">{property.price}</p>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Per sqft</p>
            <p className="text-lg font-semibold text-foreground">{property.pricePerSqft}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-sm text-muted-foreground">EMI</p>
            <p className="text-lg font-semibold text-foreground">{property.emi}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { Icon: Bed, label: 'Configuration', value: property.bhk, bg: 'bg-amber-100', fg: 'text-amber-600' },
          { Icon: Maximize, label: 'Super Area', value: `${property.sqft} sqft`, bg: 'bg-teal-100', fg: 'text-teal-600' },
          { Icon: Building, label: 'Floor', value: property.floor, bg: 'bg-blue-100', fg: 'text-blue-600' },
          { Icon: Compass, label: 'Facing', value: property.facing, bg: 'bg-purple-100', fg: 'text-purple-600' },
        ].map(({ Icon, label, value, bg, fg }) => (
          <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${fg}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-semibold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <Calendar className="w-5 h-5 text-amber-600" />
        <div>
          <p className="text-sm font-medium text-amber-800">Expected Possession</p>
          <p className="text-amber-700">{property.possession}</p>
        </div>
      </div>
    </div>
  );
}
