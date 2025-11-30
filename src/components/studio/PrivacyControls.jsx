import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Trash2, WifiOff, Database } from "lucide-react";
import { toast } from "sonner";

export default function PrivacyControls({ onOfflineModeToggle, offlineMode = false }) {
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  const handlePurgeData = () => {
    // Clear IndexedDB
    indexedDB.deleteDatabase('melodymaker-db');
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    toast.success('All local data purged successfully');
    setShowPurgeConfirm(false);
  };

  const getStorageUsage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = (estimate.usage / 1024 / 1024).toFixed(2);
      const quota = (estimate.quota / 1024 / 1024).toFixed(2);
      return `${usage} MB / ${quota} MB`;
    }
    return 'Unknown';
  };

  const [storageInfo, setStorageInfo] = useState('Calculating...');

  React.useEffect(() => {
    getStorageUsage().then(setStorageInfo);
  }, []);

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy & Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Offline Mode */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-slate-400" />
            <div>
              <Label className="text-white font-medium">100% Offline Mode</Label>
              <p className="text-xs text-slate-500 mt-1">
                All processing happens locally. No data sent to servers.
              </p>
            </div>
          </div>
          <Switch
            checked={offlineMode}
            onCheckedChange={onOfflineModeToggle}
          />
        </div>

        {/* Storage Usage */}
        <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Local Storage Usage</span>
          </div>
          <div className="text-xs text-slate-500">{storageInfo}</div>
        </div>

        {/* Data Management */}
        <div className="space-y-3">
          <Label className="text-slate-300">Data Management</Label>
          
          {!showPurgeConfirm ? (
            <Button
              onClick={() => setShowPurgeConfirm(true)}
              variant="outline"
              className="w-full border-red-700 text-red-400 hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Purge All Local Data
            </Button>
          ) : (
            <div className="space-y-2 p-4 rounded-lg bg-red-900/20 border border-red-700">
              <p className="text-sm text-red-300 font-medium">
                ⚠️ This will permanently delete:
              </p>
              <ul className="text-xs text-red-400 space-y-1 ml-4">
                <li>• All projects and takes</li>
                <li>• Style learning profiles</li>
                <li>• Settings and preferences</li>
                <li>• Local autosaves</li>
              </ul>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handlePurgeData}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Confirm Purge
                </Button>
                <Button
                  onClick={() => setShowPurgeConfirm(false)}
                  variant="outline"
                  className="flex-1 border-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Info */}
        <div className="p-3 rounded-lg bg-green-900/20 border border-green-700/50">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-400 mt-0.5" />
            <div className="text-xs text-green-300 space-y-1">
              <div className="font-medium">Your privacy is protected:</div>
              <div>• All audio & MIDI processing happens in your browser</div>
              <div>• No uploads to external servers</div>
              <div>• Style profiles stored locally only</div>
              <div>• Reference files never leave your device</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}