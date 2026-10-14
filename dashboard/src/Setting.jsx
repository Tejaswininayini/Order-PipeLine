import React from 'react';
import { useAuth } from '../AuthContext';

export default function Settings() {
  const { settings, updateSettings } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <h2 style={{ marginBottom: '20px' }}>System Settings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={settings.emailNotifications} 
            onChange={(e) => updateSettings('emailNotifications', e.target.checked)} 
          />
          <span>Enable Real-time Kafka Email Alerts</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={settings.autoRefresh} 
            onChange={(e) => updateSettings('autoRefresh', e.target.checked)} 
          />
          <span>Auto-refresh Order Table every 5 seconds</span>
        </label>
      </div>
    </div>
  );
}