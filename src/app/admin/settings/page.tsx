'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Settings, Shield, Bell, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">System Settings</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Platform Configurations
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure database connection, notification gateways, and role defaults
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-6 max-w-2xl">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <Database className="w-5 h-5 text-brand-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">PostgreSQL Backend Connection</h3>
                <p className="text-xs text-slate-500">Prisma ORM schema initialized and ready for production migration</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">DATABASE_URL</label>
                <input
                  type="text"
                  readOnly
                  value="postgresql://resora_admin:********@localhost:5432/resora_db"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-slate-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campus Name & Branding</label>
                <input
                  type="text"
                  defaultValue="RESORA Smart Campus Resource Network"
                  className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div className="pt-2">
                <button className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md">
                  Save Platform Settings
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
