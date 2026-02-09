import React from 'react';
import { StatusPage } from '@/components/monitoring/StatusPage';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PublicStatusPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <Link to="/part17-test">
            <Button variant="ghost" size="sm" className="gap-2">
              <Shield className="w-4 h-4" />
              Part 17 Overview
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-white">GRATIS System Status</h1>
          </div>
          <p className="text-gray-400">
            Real-time monitoring of all GRATIS platform services and infrastructure.
          </p>
        </div>

        <StatusPage />
      </div>
    </div>
  );
}
