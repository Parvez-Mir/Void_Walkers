import { useState } from 'react';
import { Navbar } from '../components/globalghar/Navbar';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { PropertyHealthDashboard } from '../components/dashboard/PropertyHealthDashboard';
import { IncidentTimeline } from '../components/dashboard/IncidentTimeline';
import { DocumentVault } from '../components/dashboard/DocumentVault';
import { ComplianceCalendar } from '../components/dashboard/ComplianceCalendar';
import { ValuationMonitor } from '../components/dashboard/ValuationMonitor';
import { ComingSoon } from '../components/dashboard/ComingSoon';

const SECTIONS = {
  health: PropertyHealthDashboard,
  incidents: IncidentTimeline,
  documents: DocumentVault,
  compliance: ComplianceCalendar,
  valuation: ValuationMonitor,
  'coming-soon': ComingSoon,
};

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('health');
  const Section = SECTIONS[activeSection] || PropertyHealthDashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />

      <main className="pt-20">
        <div className="flex">
          <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <Section />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
