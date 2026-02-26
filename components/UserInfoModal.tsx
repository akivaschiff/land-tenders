'use client';

import { useState, FormEvent, useEffect } from 'react';

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
  contact: string;
}

export default function UserInfoModal({ isOpen, onClose }: UserInfoModalProps) {
  const [formData, setFormData] = useState<UserData>({
    idNumber: '',
    birthDate: '',
    sex: '',
    maritalStatus: '',
    isReservist: false,
    isCombatUnit: false,
    contact: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    // Show success message
    setIsSubmitted(true);

    // Close modal after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
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
      // Reset form when modal closes
      setFormData({
        idNumber: '',
        birthDate: '',
        sex: '',
        maritalStatus: '',
        isReservist: false,
        isCombatUnit: false,
        contact: '',
      });
      setIsSubmitted(false);
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
    formData.maritalStatus !== '' &&
    formData.contact !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-scale-in" dir="rtl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-warm p-8 text-white z-10 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="סגור"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold mb-2 text-right">גלו את ההנחות שלכם</h2>
          <p className="text-white/90 text-right">מלאו את הפרטים ונחזור אליכם עם הנחות מותאמות אישית</p>
        </div>

        {/* Success Message */}
        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center mb-6 animate-scale-in">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">תודה רבה!</h3>
            <p className="text-gray-600 text-center max-w-md mb-2">
              קיבלנו את הפרטים שלכם בהצלחה
            </p>
            <p className="text-terracotta-600 font-medium text-center">
              נחזור אליכם בהקדם עם ההנחות המותאמות אישית
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* ID Number */}
          <div className="animate-slide-up">
            <label htmlFor="idNumber" className="label-text text-right">
              מספר תעודת זהות
            </label>
            <input
              type="text"
              id="idNumber"
              value={formData.idNumber}
              onChange={(e) => handleChange('idNumber', e.target.value.replace(/\D/g, ''))}
              maxLength={9}
              placeholder="הזינו מספר תעודת זהות"
              className="input-field text-right"
              dir="ltr"
              required
            />
            <p className="mt-1 text-xs text-gray-500 text-right">הפרטים שלכם נשמרים באופן מאובטח ופרטי</p>
          </div>

          {/* Birth Date */}
          <div className="animate-slide-up animation-delay-200">
            <label htmlFor="birthDate" className="label-text text-right">
              תאריך לידה
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
              <p className="mt-1 text-xs text-terracotta-600 font-medium text-right" dir="ltr">גיל: {age} שנים</p>
            )}
          </div>

          {/* Sex */}
          <div className="animate-slide-up animation-delay-400">
            <label className="label-text text-right">מין</label>
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
                  <span className="font-medium">זכר</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.sex === 'male' ? 'border-terracotta-500' : 'border-gray-300'
                  }`}>
                    {formData.sex === 'male' && (
                      <div className="w-3 h-3 rounded-full bg-terracotta-500" />
                    )}
                  </div>
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
                  <span className="font-medium">נקבה</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.sex === 'female' ? 'border-terracotta-500' : 'border-gray-300'
                  }`}>
                    {formData.sex === 'female' && (
                      <div className="w-3 h-3 rounded-full bg-terracotta-500" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Marital Status */}
          <div className="animate-slide-up animation-delay-600">
            <label className="label-text text-right">מצב משפחתי</label>
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
                  <span className="font-medium">רווק</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.maritalStatus === 'single' ? 'border-terracotta-500' : 'border-gray-300'
                  }`}>
                    {formData.maritalStatus === 'single' && (
                      <div className="w-3 h-3 rounded-full bg-terracotta-500" />
                    )}
                  </div>
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
                  <span className="font-medium">נשוי</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.maritalStatus === 'married' ? 'border-terracotta-500' : 'border-gray-300'
                  }`}>
                    {formData.maritalStatus === 'married' && (
                      <div className="w-3 h-3 rounded-full bg-terracotta-500" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Army Service Questions */}
          <div className="space-y-4 pt-4 border-t border-gray-200 animate-slide-up animation-delay-800">
            <p className="text-sm font-medium text-gray-700 text-right">שירות צבאי (לזכאות להנחות)</p>

            {/* Reservist */}
            <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex-1 text-right">
                <div className="font-medium text-gray-900">שירות מילואים</div>
                <div className="text-sm text-gray-600">בשירות מילואים כיום</div>
              </div>
              <input
                type="checkbox"
                checked={formData.isReservist}
                onChange={(e) => handleChange('isReservist', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-terracotta-500 focus:ring-terracotta-500"
              />
            </label>

            {/* Combat Unit */}
            <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex-1 text-right">
                <div className="font-medium text-gray-900">יחידה קרבית</div>
                <div className="text-sm text-gray-600">שירות ביחידה קרבית</div>
              </div>
              <input
                type="checkbox"
                checked={formData.isCombatUnit}
                onChange={(e) => handleChange('isCombatUnit', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-terracotta-500 focus:ring-terracotta-500"
              />
            </label>
          </div>

          {/* Contact Information */}
          <div className="animate-slide-up">
            <label htmlFor="contact" className="label-text text-right">
              אימייל או טלפון
            </label>
            <input
              type="text"
              id="contact"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              placeholder="example@email.com או 050-1234567"
              className="input-field text-right"
              dir="ltr"
              required
            />
            <p className="mt-1 text-xs text-gray-500 text-right">נחזור אליכם עם פרטי ההנחות המותאמות אישית</p>
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
                שלחו את הפרטים
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            {!isFormValid && (
              <p className="mt-2 text-xs text-center text-gray-500">
                אנא מלאו את כל השדות הנדרשים
              </p>
            )}
            <p className="mt-4 text-sm text-center text-gray-600">
              נעבור על הפרטים ונחזור אליכם בהקדם עם ההנחות המותאמות לכם
            </p>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
