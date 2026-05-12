"use client";

export default function PrintButton() {
  return (
    <button
      className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-6 py-2 rounded-full font-label font-bold text-xs tracking-widest transition-colors flex items-center gap-2"
      onClick={() => window.print()}
    >
      <span className="material-symbols-outlined text-sm">print</span>
      Drucken
    </button>
  );
}
