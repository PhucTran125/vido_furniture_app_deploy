'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Mail, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, defaultMessage }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default message when modal opens
  useEffect(() => {
    if (isOpen && defaultMessage) {
      setFormData(prev => ({ ...prev, message: defaultMessage }));
    }
  }, [isOpen, defaultMessage]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = t.contact.requiredField;
    if (!formData.lastName.trim()) newErrors.lastName = t.contact.requiredField;
    if (!formData.email.trim()) {
      newErrors.email = t.contact.requiredField;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t.contact.invalidEmail;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t.contact.requiredField;
    } else if (!/^[+]?[\d\s\-().]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = t.contact.invalidPhone;
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send');
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[20px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-gray-900 tracking-tight uppercase mb-2">
              {t.contact.sendInquiry}
            </h2>
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              {t.contact.inquirySubtitle}
            </p>
          </div>

          {/* Direct Contact Info */}
          <div className="border-l-4 border-accent pl-4 py-2 mb-6">
            <div className="space-y-1.5">
              {COMPANY_INFO.contacts.map((contact, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Mail size={13} className="text-gray-400 shrink-0" />
                  <p className="text-xs text-gray-600">
                    <a href={`mailto:${contact.email}`} className="hover:text-accent transition-colors">
                      {contact.email}
                    </a>
                    {' / '}
                    <a href={`tel:${contact.phone.replace(/[\s()]/g, '')}`} className="hover:text-accent transition-colors font-semibold">
                      {contact.phone}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {t.contact.nameLabel} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent focus:ring-accent'}`}
                  />
                  <span className={`text-xs mt-1 block ${errors.firstName ? 'text-red-500' : 'text-gray-400'}`}>
                    {errors.firstName || t.contact.firstName}
                  </span>
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent focus:ring-accent'}`}
                  />
                  <span className={`text-xs mt-1 block ${errors.lastName ? 'text-red-500' : 'text-gray-400'}`}>
                    {errors.lastName || t.contact.lastName}
                  </span>
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {t.contact.emailField} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent focus:ring-accent'}`}
              />
              {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {t.contact.phoneLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent focus:ring-accent'}`}
              />
              {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {t.contact.commentLabel}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-y"
              />
            </div>

            {/* Status */}
            {status === 'success' && (
              <p className="text-green-600 text-sm">{t.contact.successMessage}</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 text-sm">{t.contact.errorMessage}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-primary hover:bg-accent text-white font-bold text-sm uppercase tracking-wider py-3 px-10 rounded-lg transition-colors disabled:opacity-60"
            >
              {status === 'sending' ? t.contact.sending : t.contact.submitBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
