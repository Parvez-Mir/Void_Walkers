import { Link } from 'react-router-dom';
import { Bed, MapPin, Maximize, Shield, Sparkles } from 'lucide-react';
import {
  formatArea,
  formatBhk,
  formatPrice,
  getLocationLabel,
  getPropertyIdentifier,
  getPropertyImage,
  getScore,
  getScoreLevel,
} from '../../utils/propertyFormat';

const scoreStyles = {
  excellent: 'from-emerald-400 to-emerald-600',
  good: 'from-amber-400 to-amber-600',
  average: 'from-orange-400 to-orange-600',
  developing: 'from-slate-400 to-slate-600',
};

export function PropertyCard({ property, index = 0, scoreKey = 'investmentScore' }) {
  const identifier = getPropertyIdentifier(property);
  const score = getScore(property, scoreKey);
  const scoreLevel = getScoreLevel(score);

  return (
    <Link
      to={`/properties/${identifier}`}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10"
    >
      <div className="relative h-64 overflow-hidden bg-muted">
        <img
          src={getPropertyImage(property, index)}
          alt={property?.title || 'Property listing'}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading={index < 3 ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <div className={`absolute right-4 top-4 rounded-full bg-gradient-to-r ${scoreStyles[scoreLevel]} px-3 py-1.5 text-sm font-bold text-white shadow-lg`}>
          Score {score}
        </div>
        {property?.isFeatured && (
          <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
            <Sparkles className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-xl font-bold text-foreground transition-colors group-hover:text-amber-600">
          {property?.title || 'Premium property in Ahmedabad'}
        </h3>
        <p className="mb-4 flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-amber-500" />
          {getLocationLabel(property)}
        </p>

        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="text-2xl font-bold text-amber-600">
            {formatPrice(property?.pricing?.expectedPrice, property?.listingType)}
          </span>
          <div className="flex shrink-0 items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {formatBhk(property)}
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              {formatArea(property?.area?.superBuiltupArea, property?.area?.areaUnit)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">
            {property?.building?.projectName || property?.propertyCode || 'Verified listing'}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <Shield className="h-3.5 w-3.5" />
            AI verified
          </span>
        </div>
      </div>
    </Link>
  );
}
