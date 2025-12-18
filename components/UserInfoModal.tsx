'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  idNumber: string;
  birthDate: string;
  sex: 'male' | 'female' | '';
  maritalStatus: 'single' | 'married' | '';
  isReservist: boolean;
  isCombatUnit: boolean;
}

export default function UserInfoModal({ isOpen, onClose }: UserInfoModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<UserData>({
    idNumber: '',
    birthDate: '',
    sex: '',
    maritalStatus: '',
    isReservist: false,
    isCombatUnit: false,
  });

  // Calculate age from birth date
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(formData.birthDate);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Store user data in sessionStorage
    sessionStorage.setItem('userData', JSON.stringify({
      ...formData,
      age,
    }));

    // Navigate to results page
    router.push('/results');
  };

  const handleChange = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isFormValid =
    formData.idNumber.length >= 8 &&
    formData.birthDate !== '' &&
    formData.sex !== '' &&
    formData.maritalStatus !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-warm p-8 text-white z-10 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold mb-2">Let's Find Your Perfect Lot</h2>
          <p className="text-white/90">Tell us a bit about yourself to get personalized results</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* ID Number */}
          <div className="animate-slide-up">
            <label htmlFor="idNumber" className="label-text">
              Identification Number
            </label>
            <input
              type="text"
              id="idNumber"
              value={formData.idNumber}
              onChange={(e) => handleChange('idNumber', e.target.value.replace(/\D/g, ''))}
              maxLength={9}
              placeholder="Enter your ID number"
              className="input-field"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Your ID is kept private and secure</p>
          </div>

          {/* Birth Date */}
          <div className="animate-slide-up animation-delay-200">
            <label htmlFor="birthDate" className="label-text">
              Date of Birth
            </label>
            <input
              type="date"
              id="birthDate"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="input-field"
              required
            />
            {age > 0 && (
              <p className="mt-1 text-xs text-terracotta-600 font-medium">Age: {age} years</p>
            )}
          </div>

          {/* Sex */}
          <div className="animate-slide-up animation-delay-400">
            <label className="label-text">Sex</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange('sex', 'male')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.sex === 'male'
                    ? 'border-terracotta-500 bg-terracotta-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.sex === 'male' ? 'border-terracotta-500' : 'border-gray-300'
                  }`}>
                    {formData.sex === 'male' && (
                      <div className="w-3 h-3 rounded-full bg-terracotta-500" />
                    )}
                  </div>
                  <span className="font-medium">Male</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('sex', 'female')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.sex === 'female'
                    ? 'border-terracotta-500 bg-terracotta-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.sex === 'female' ? 'border-terracotta-500' : 'border-gray-300'
                  }`}>
                    {formData.sex === 'female' && (
                      <div className="w-3 h-3 rounded-full bg-terracotta-500" />
                    )}
                  </div>
                  <span className="font-medium">Female</span>
                </div>
              </button>
            </div>
          </div>

          {/* Marital Status */}
          <div className="animate-slide-up animation-delay-600">
            <label className="label-text">Marital Status</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange('maritalStatus', 'single')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.maritalStatus === 'single'
                    ? 'border-terracotta-500 bg-terracotta-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.maritalStatus === 'single' ? 'border-terracotta-500' : 'border-gray-300'
                  }`}>
                    {formData.maritalStatus === 'single' && (
                      <div className="w-3 h-3 rounded-full bg-terracotta-500" />
                    )}
                  </div>
                  <span className="font-medium">Single</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('maritalStatus', 'married')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.maritalStatus === 'married'
                    ? 'border-terracotta-500 bg-terracotta-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.maritalStatus === 'married' ? 'border-terracotta-500' : 'border-gray-300'
                  }`}>
                    {formData.maritalStatus === 'married' && (
                      <div className="w-3 h-3 rounded-full bg-terracotta-500" />
                    )}
                  </div>
                  <span className="font-medium">Married</span>
                </div>
              </button>
            </div>
          </div>

          {/* Army Service Questions */}
          <div className="space-y-4 pt-4 border-t border-gray-200 animate-slide-up animation-delay-800">
            <p className="text-sm font-medium text-gray-700">Military Service (for eligible benefits)</p>

            {/* Reservist */}
            <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isReservist}
                onChange={(e) => handleChange('isReservist', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-terracotta-500 focus:ring-terracotta-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Army Reservist</div>
                <div className="text-sm text-gray-600">Currently serving in the reserves</div>
              </div>
            </label>

            {/* Combat Unit */}
            <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isCombatUnit}
                onChange={(e) => handleChange('isCombatUnit', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-terracotta-500 focus:ring-terracotta-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Combat Unit</div>
                <div className="text-sm text-gray-600">Served or serving in a combat unit</div>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full btn-primary text-lg ${
                !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                Find My Lot
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </button>
            {!isFormValid && (
              <p className="mt-2 text-xs text-center text-gray-500">
                Please fill in all required fields
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
