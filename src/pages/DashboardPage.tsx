import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { FocusableButton } from '../components/FocusableButton';

const DashboardPage: React.FC = () => {
  const { userInfo, logout } = useAuthStore();
  const navigate = useNavigate();
  const { focusSelf } = useFocusable();

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Simple way to handle back button or "logout" via spatial nav if needed
  // For now, we rely on a Logout Button.

  return (
    <div className="min-h-screen bg-background text-text p-safe-area flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-6">Welcome, {userInfo?.username}</h1>

      <div className="bg-surface p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl mb-4">Account Status</h2>
        <div className="space-y-2 mb-8">
             <p><span className="text-gray-400">Status:</span> {userInfo?.status}</p>
             <p><span className="text-gray-400">Expires:</span> {userInfo?.exp_date ? new Date(parseInt(userInfo.exp_date) * 1000).toLocaleDateString() : 'Never'}</p>
             <p><span className="text-gray-400">Active Connections:</span> {userInfo?.active_cons} / {userInfo?.max_connections}</p>
        </div>

        {/* We need a FocusableButton here. Importing locally to avoid circular deps if any, usually fine. */}
        <LogoutButton onLogout={handleLogout} />
      </div>
    </div>
  );
};

// Extracted to separate component to cleanly use hook
const LogoutButton = ({ onLogout }: { onLogout: () => void }) => {
    return <FocusableButton label="Logout" onClick={onLogout} className="w-full" />;
};

export default DashboardPage;
