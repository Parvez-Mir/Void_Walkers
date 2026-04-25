import { FileText, CheckCircle, Download, ExternalLink, Shield, Calendar } from 'lucide-react';

export function DocumentPreview({ documents, reraId }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Document Preview</h2>
          <p className="text-sm text-muted-foreground">RERA status and property documents</p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 mb-6">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-foreground">RERA Status</h3>
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-700">
                  <CheckCircle className="w-3 h-3" />
                  {documents.reraStatus}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Gujarat RERA Registered</p>
            </div>
          </div>
          <button
            type="button"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition"
          >
            <ExternalLink className="w-4 h-4" />
            Verify
          </button>
        </div>

        <div className="p-3 rounded-lg bg-white/80 mb-4">
          <p className="text-xs text-muted-foreground mb-1">RERA Registration Number</p>
          <p className="text-sm font-mono font-medium text-foreground break-all">{reraId}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-emerald-700">
          <Calendar className="w-4 h-4" />
          <span>
            Verified: <span className="font-medium">{documents.reraExpiry}</span>
          </span>
        </div>
      </div>

      {documents.approvals.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">Government Approvals</h3>
          <div className="flex flex-wrap gap-2">
            {documents.approvals.map((approval, index) => (
              <span
                key={index}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {approval}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-foreground mb-3">Available Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.available.map((doc, index) => (
            <button
              key={index}
              type="button"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-medium text-foreground">{doc}</span>
              </div>
              <Download className="w-5 h-5 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
