import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import logoSvg from '../../assets/logo.svg';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      alert('Invalid reset link. Please request a new password reset.');
      navigate('/auth/login');
    }
  }, [token, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 4) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (validateForm()) {
      try {
        await resetPassword(token, formData.newPassword);
        // Navigation will be handled by AuthContext
      } catch (error) {
        console.error('Password reset failed:', error);
      }
    }
  };

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F5F5F5] font-comfortaa">
      <div className="flex h-full">
        <div className="w-1/2 flex items-center justify-center p-8 bg-[#F5F5F5] relative">
          {error && (
            <div className="absolute top-4 right-4 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg shadow-md z-20 max-w-sm">
              {error}
            </div>
          )}
          
          <Card className="w-full max-w-lg mx-auto bg-[#EFECE7] border-black border-2 rounded-[30px] shadow-[10px_4px_4px_0px_rgba(0,0,0,0.25)] font-comfortaa">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <img src={logoSvg} alt="Logo" className="w-48 h-auto" />
              </div>
              <CardTitle className="text-[50px] font-comfortaa font-semibold text-[#78746C] leading-[1.4]">
                RESET PASSWORD
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 px-12 pb-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <p className="text-[20px] font-comfortaa text-[#78746C] text-center leading-relaxed">
                  Enter your new password below.
                </p>

                <div className="space-y-4">
                  <label
                    htmlFor="newPassword"
                    className="block text-[30px] font-comfortaa font-semibold text-[#121212] text-center"
                  >
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-black rounded-none px-0 py-2 text-[25px] font-comfortaa text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                  />
                  {errors.newPassword && (
                    <p className="text-red-600 text-[18px] font-comfortaa text-center">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-[30px] font-comfortaa font-semibold text-[#121212] text-center"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-black rounded-none px-0 py-2 text-[25px] font-comfortaa text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-[18px] font-comfortaa text-center">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-[rgba(203,175,135,0.3)] text-[#121212] hover:bg-[rgba(203,175,135,0.5)] border-2 border-black rounded-[30px] py-6 text-[40px] font-comfortaa font-semibold backdrop-blur-[100px] transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(0deg, rgba(203, 175, 135, 0.3), rgba(203, 175, 135, 0.3)), linear-gradient(0deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))'
                    }}
                    disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
                  >
                    {isLoading ? "Updating..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/2 bg-[#EFECE7] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-comfortaa font-bold text-[#78746C] mb-4">
              Welcome Back
            </h2>
            <p className="text-xl font-comfortaa text-[#78746C]">
              Set your new password to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 