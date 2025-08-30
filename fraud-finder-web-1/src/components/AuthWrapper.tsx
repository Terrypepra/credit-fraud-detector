// AuthWrapper.tsx - Authentication Gate for Credit Fraud Detector
// --------------------------------------------------------------
// Handles authentication state, login/register switching, and user context.
// Refined for clarity, maintainability, and a human touch.

import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { authService, User } from "@/services/authService";
import { Shield, Brain } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { User as UserIcon } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  // State for authentication and UI
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  // State for logout confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // State for profile modal
  const [showProfile, setShowProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token is invalid, clear it
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful login/register
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    const currentUser = authService.getUser();
    setUser(currentUser);
  };

  // Handle logout
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setShowLogoutConfirm(false);
  };
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated: show login/register
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">FraudGuard</h1>
                <p className="text-blue-200 text-sm">Advanced Credit Card Fraud Detection</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-300">
              <Brain className="h-4 w-4" />
              <span className="text-sm">Powered by Machine Learning</span>
            </div>
          </div>

          {/* Auth Form */}
          {showLogin ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={() => setShowLogin(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setShowLogin(true)}
            />
          )}

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-blue-300 text-xs">
              Secure authentication powered by JWT tokens
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: show app with user info and logout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header with user info */}
      <header className="border-b border-blue-800/30 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FraudGuard</h1>
                <p className="text-blue-200 text-sm">Advanced Credit Card Fraud Detection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-blue-200">Welcome,</div>
                <button
                  className="text-white font-medium underline hover:text-blue-400"
                  onClick={() => {
                    setEditName(user?.name || "");
                    setShowProfile(true);
                  }}
                  aria-label="View or edit profile"
                >
                  {user?.name || user?.email}
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
              {/* Logout Confirmation Dialog */}
              <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out? You will need to sign in again to access the app.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={cancelLogout}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmLogout}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      {children}

      {/* User Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <UserIcon className="inline h-5 w-5 mr-2 text-blue-400" />
              User Profile
            </DialogTitle>
            <DialogDescription>View and edit your profile information.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              // Update name in localStorage and state
              const updatedUser = { ...user, name: editName };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
              setShowProfile(false);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="profile-name" className="block text-blue-200 mb-1">Full Name</label>
              <input
                id="profile-name"
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-700/50 border border-blue-800/30 text-white"
              />
            </div>
            <div>
              <label className="block text-blue-200 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2 rounded bg-slate-700/50 border border-blue-800/30 text-white opacity-70 cursor-not-allowed"
              />
            </div>
            <DialogFooter>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 