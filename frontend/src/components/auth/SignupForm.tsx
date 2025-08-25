import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Briefcase, Shield, Music, Star, ExternalLink, CheckCircle } from 'lucide-react';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

interface RoleConfig {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: string[];
  requiresSerato?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onSwitchToLogin
}) => {
  // Check for Serato verification from callback
  React.useEffect(() => {
    const seratoVerified = sessionStorage.getItem('seratoVerified');
    if (seratoVerified === 'true') {
      setSeratoConnected(true);
      sessionStorage.removeItem('seratoVerified'); // Clean up
    }
  }, []);
  const { signup, error, clearError, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT' // Default role
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[]
  });
  
  // Serato verification state for VERIFIED_DJ
  const [seratoVerificationStep, setSeratoVerificationStep] = useState(false);
  const [seratoConnected, setSeratoConnected] = useState(false);
  const [seratoConnecting, setSeratoConnecting] = useState(false);
  const [seratoError, setSeratoError] = useState<string | null>(null);

  // Role configurations with descriptions and icons
  const roleConfigs: Record<string, RoleConfig> = {
    RUNNER: {
      name: 'Runner',
      description: 'I execute missions and provide music services',
      icon: User,
      color: 'green',
      features: ['Mission execution', 'Expense tracking', 'Check-ins']
    },
    DJ: {
      name: 'DJ',
      description: 'I\'m a DJ who wants to earn money playing music',
      icon: Music,
      color: 'blue',
      features: ['Music curation', 'Playlist creation', 'Basic missions']
    },
    VERIFIED_DJ: {
      name: 'Verified DJ',
      description: 'I\'m a verified DJ with Serato integration access',
      icon: Star,
      color: 'emerald',
      features: ['Serato integration', 'Advanced missions', 'Priority access'],
      requiresSerato: true
    },
    CLIENT: {
      name: 'Client',
      description: 'I need music services for my events',
      icon: Briefcase,
      color: 'purple',
      features: ['Mission creation', 'Booking management', 'Analytics']
    },
    CURATOR: {
      name: 'Curator',
      description: 'I manage teams and oversee platform operations',
      icon: Shield,
      color: 'amber',
      features: ['Team management', 'Advanced missions', 'Quality control']
    }
  };

  const validatePassword = (password: string) => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    return { score, feedback };
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (passwordStrength.score < 3) {
      errors.password = 'Password does not meet security requirements';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    // Check if VERIFIED_DJ role requires Serato verification
    const selectedRole = roleConfigs[formData.role as keyof typeof roleConfigs];
    if (selectedRole.requiresSerato && !seratoConnected) {
      setSeratoVerificationStep(true);
      return;
    }

    // Get stored verification data if available
    const verificationData = sessionStorage.getItem('seratoVerificationData');
    const seratoData = verificationData ? JSON.parse(verificationData) : null;
    
    const result = await signup(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.role,
      seratoConnected // Pass Serato verification status
    );
    
    if (result.success) {
      // Check if this is a CURATOR application that needs approval
      if (result.needsApproval && result.role === 'CURATOR') {
        // Redirect to curator thank you page
        window.location.href = '/curator-thank-you';
      } else {
        onSuccess?.();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }

    // Reset Serato verification if role changes
    if (name === 'role') {
      setSeratoVerificationStep(false);
      setSeratoConnected(false);
      setSeratoError(null);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    if (passwordStrength.score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getRoleColorClasses = (role: string, isSelected: boolean) => {
    const config = roleConfigs[role as keyof typeof roleConfigs];
    const colorMap = {
      green: isSelected ? 'border-green-600 bg-green-50 ring-2 ring-green-600' : 'border-gray-300 bg-white hover:bg-gray-50',
      blue: isSelected ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600' : 'border-gray-300 bg-white hover:bg-gray-50',
      emerald: isSelected ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600' : 'border-gray-300 bg-white hover:bg-gray-50',
      purple: isSelected ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600' : 'border-gray-300 bg-white hover:bg-gray-50',
      amber: isSelected ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600' : 'border-gray-300 bg-white hover:bg-gray-50'
    };
    return colorMap[config.color as keyof typeof colorMap];
  };

  const getRoleTextColor = (role: string, isSelected: boolean, type: 'title' | 'description') => {
    const config = roleConfigs[role as keyof typeof roleConfigs];
    const colorMap = {
      green: isSelected ? (type === 'title' ? 'text-green-900' : 'text-green-700') : (type === 'title' ? 'text-gray-900' : 'text-gray-500'),
      blue: isSelected ? (type === 'title' ? 'text-blue-900' : 'text-blue-700') : (type === 'title' ? 'text-gray-900' : 'text-gray-500'),
      emerald: isSelected ? (type === 'title' ? 'text-emerald-900' : 'text-emerald-700') : (type === 'title' ? 'text-gray-900' : 'text-gray-500'),
      purple: isSelected ? (type === 'title' ? 'text-purple-900' : 'text-purple-700') : (type === 'title' ? 'text-gray-900' : 'text-gray-500'),
      amber: isSelected ? (type === 'title' ? 'text-amber-900' : 'text-amber-700') : (type === 'title' ? 'text-gray-900' : 'text-gray-500')
    };
    return colorMap[config.color as keyof typeof colorMap];
  };

  const getRoleIconColor = (role: string, isSelected: boolean) => {
    const config = roleConfigs[role as keyof typeof roleConfigs];
    const colorMap = {
      green: isSelected ? 'text-green-600' : 'text-gray-400',
      blue: isSelected ? 'text-blue-600' : 'text-gray-400',
      emerald: isSelected ? 'text-emerald-600' : 'text-gray-400',
      purple: isSelected ? 'text-purple-600' : 'text-gray-400',
      amber: isSelected ? 'text-amber-600' : 'text-gray-400'
    };
    return colorMap[config.color as keyof typeof colorMap];
  };

  const initiateSeratoConnection = async () => {
    try {
      setSeratoConnecting(true);
      setSeratoError(null);
      
      // Use local file verification instead of OAuth
      const response = await fetch('/api/serato-file/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSeratoConnected(true);
          setSeratoVerificationStep(false);
          // Store verification data for signup
          sessionStorage.setItem('seratoVerificationData', JSON.stringify(data.verification));
        } else {
          setSeratoError(data.message || 'Failed to verify Serato installation');
        }
      } else {
        const error = await response.json();
        setSeratoError(error.message || 'Failed to verify Serato installation');
      }
      
    } catch (error) {
      setSeratoError('Failed to verify Serato installation. Please make sure Serato DJ Pro is installed.');
    } finally {
      setSeratoConnecting(false);
    }
  };

  const goBackToForm = () => {
    setSeratoVerificationStep(false);
    setSeratoConnected(false);
    setSeratoError(null);
  };

  // Render Serato verification step
  if (seratoVerificationStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Serato Verification Required
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Verified DJ accounts require Serato integration
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <Star className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Verify Your Serato Installation
              </h3>
              <p className="text-sm text-gray-600">
                To complete your Verified DJ registration, we need to verify your Serato DJ Pro installation. 
                This analyzes your library and DJ activity to determine your skill level.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-medium text-emerald-900 mb-2">What We Analyze:</h4>
                <ul className="text-sm text-emerald-800 space-y-1">
                  <li>• Your music library size and organization</li>
                  <li>• DJ session history and experience</li>
                  <li>• Crate organization and preparation</li>
                  <li>• Track analysis completion</li>
                  <li>• Recent DJ activity</li>
                </ul>
              </div>

              {seratoError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{seratoError}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={goBackToForm}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Back
                </button>
                <button
                  onClick={initiateSeratoConnection}
                  disabled={seratoConnecting}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {seratoConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Serato Installation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join Club Run
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your role and start your music mission journey
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-3">
                I want to join as a:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {Object.entries(roleConfigs).map(([roleKey, config]) => {
                  const IconComponent = config.icon;
                  const isSelected = formData.role === roleKey;
                  
                  return (
                    <label key={roleKey} className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${getRoleColorClasses(roleKey, isSelected)}`}>
                      <input
                        type="radio"
                        name="role"
                        value={roleKey}
                        className="sr-only"
                        checked={isSelected}
                        onChange={handleInputChange}
                      />
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <IconComponent className={`h-6 w-6 ${getRoleIconColor(roleKey, isSelected)}`} />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className={`text-sm font-medium ${getRoleTextColor(roleKey, isSelected, 'title')}`}>
                            {config.name}
                          </div>
                          <div className={`text-sm ${getRoleTextColor(roleKey, isSelected, 'description')}`}>
                            {config.description}
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-gray-500">
                              Features: {config.features.join(', ')}
                            </div>
                            {config.requiresSerato && (
                              <div className="text-xs text-emerald-600 mt-1 flex items-center">
                                <Star className="w-3 h-3 mr-1" />
                                Requires Serato verification
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded ${
                          level <= passwordStrength.score ? getPasswordStrengthColor() : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password strength: {passwordStrength.score}/5
                  </p>
                  {passwordStrength.feedback.length > 0 && (
                    <ul className="mt-1 text-xs text-gray-500 list-disc list-inside">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Registration failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                `Create ${roleConfigs[formData.role as keyof typeof roleConfigs]?.name.toLowerCase()} account`
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}; 