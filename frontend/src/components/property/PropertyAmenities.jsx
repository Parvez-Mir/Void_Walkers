import { Dumbbell, Waves, Users, Baby, Shield, Zap, Car, Trees, Wifi, Flame, Bell, Building } from 'lucide-react';

const ICON_MAP = {
  Pool: Waves,
  'Swimming Pool': Waves,
  Gym: Dumbbell,
  'Club house': Users,
  Clubhouse: Users,
  'Play area': Baby,
  'Children Play Area': Baby,
  Security: Shield,
  '24/7 Security': Shield,
  'Power backup': Zap,
  'Power Backup': Zap,
  Parking: Car,
  Garden: Trees,
  Lift: Building,
  'Visitor parking': Car,
  'Internet ready': Wifi,
  'Gas pipeline': Flame,
  'Pet friendly': Bell,
};

export function PropertyAmenities({ amenities, builder, projectName, possession, age }) {
  const list = amenities && amenities.length ? amenities : ['Lift', 'Parking', 'Security', 'Power backup'];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-lg mt-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Amenities</h3>
      <div className="grid grid-cols-2 gap-3">
        {list.map((amenity, index) => {
          const Icon = ICON_MAP[amenity] || Shield;
          return (
            <div key={`${amenity}-${index}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm text-foreground">{amenity}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Project Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Builder</span>
            <span className="font-medium text-foreground text-right">{builder}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Project</span>
            <span className="font-medium text-foreground text-right">{projectName}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-foreground text-right">{age}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Possession</span>
            <span className="font-medium text-amber-600 text-right">{possession}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
