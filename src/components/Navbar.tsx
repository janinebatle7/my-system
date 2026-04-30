import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, LogOut, User, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <UtensilsCrossed className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Clara's Best</h1>
              <p className="text-xs text-gray-500 leading-tight">Pinoy Kakanin Delicacies</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {isAdmin ? <Shield className="w-4 h-4 text-amber-600" /> : <User className="w-4 h-4 text-gray-400" />}
              <span className="font-medium">{user?.fullName}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {isAdmin ? 'Admin' : 'Customer'}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
