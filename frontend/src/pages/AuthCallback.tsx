import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth?error=auth_callback_failed');
          return;
        }

        if (data.session) {
          console.log('✅ User authenticated successfully:', data.session.user.email);
          navigate('/dashboard');
        } else {
          console.log('❌ No session found in callback');
          navigate('/auth?error=no_session');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth?error=callback_error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-tech-black flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Signing you in...</h2>
        <p className="text-gray-400">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
} 