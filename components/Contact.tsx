'use client';

import React, { useState } from 'react';
import { Section } from './ui/Section';
import { COMPANY_INFO } from '@/lib/constants';
import { CheckCircle, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Contact: React.FC = () => {
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

  const benefits = [
    { label: t.contact.factoryDirect, desc: t.contact.factoryDirectDesc },
    { label: t.contact.certifiedEthics, desc: t.contact.certifiedEthicsDesc },
    { label: t.contact.qualityAssurance, desc: t.contact.qualityAssuranceDesc },
  ];

  const companyName = language === 'vi'
    ? 'CÔNG TY CỔ PHẦN NỘI THẤT VIDO VIỆT NAM (VIDO FURNITURE JSC)'
    : 'VIDO VIET NAM FURNITURE JOINT STOCK COMPANY (VIDO FURNITURE JSC)';

  return (
    <Section id="contact" className="bg-background !py-10 md:!py-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase mb-3">
            {t.contact.sectionTitle}
          </h2>
          <p
            className="text-gray-500 text-sm md:text-base max-w-3xl mx-auto leading-relaxed uppercase tracking-wide"
            dangerouslySetInnerHTML={{ __html: t.contact.sectionSubtitle }}
          />
        </div>

        {/* Main Container */}
        <div className="bg-white p-6 md:p-10 rounded-[20px] shadow-md border border-gray-100 mx-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Left Column: Why Partner + Company Name + Direct Contact */}
            <div className="flex flex-col">
              {/* Why Partner */}
              <h4 className="font-heading text-lg font-bold text-gray-900 mb-6">
                {t.contact.whyPartner}
              </h4>

              <div className="space-y-5 mb-8">
                {benefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-accent mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-bold text-gray-900 uppercase">{item.label}</span>{' '}
                      <span className="uppercase">{item.desc}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Company Name */}
              <p className="text-black font-bold text-base leading-snug mb-4">
                {companyName}
              </p>

              {/* Direct Contact */}
              <div className="border-l-4 border-accent pl-5 py-3 mb-8">
                <h4 className="font-heading text-base font-bold text-accent uppercase tracking-wide mb-3">
                  {t.contact.directContact}
                </h4>
                <div className="space-y-2">
                  {COMPANY_INFO.contacts.map((contact, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Mail size={14} className="text-gray-400 mt-1 shrink-0" />
                      <p className="text-sm text-gray-700">
                        <a href={`mailto:${contact.email}`} className="hover:text-accent transition-colors uppercase">
                          {contact.email}
                        </a>
                        {' / '}
                        <a href={`tel:${contact.phone.replace(/[\s()]/g, '')}`} className="hover:text-accent transition-colors">
                          {contact.phone}
                        </a>
                      </p>
                    </div>
                  ))}
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-1 shrink-0" />
                    <p className="text-sm text-gray-700">
                      {t.contact.fullAddress}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Inquiry Form */}
            <div className="bg-[#f8f9fa] rounded-[16px] border border-gray-200 p-6 md:p-8 flex flex-col">
              <h3 className="font-heading text-lg md:text-xl font-bold text-gray-900 mb-1">
                {t.contact.sendInquiry}
              </h3>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-6">
                {t.contact.inquirySubtitle}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                {/* Name Fields */}
                <div className="mb-5">
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

                {/* Email Field */}
                <div className="mb-5">
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

                {/* Phone Field */}
                <div className="mb-5">
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

                {/* Comment / Message */}
                <div className="mb-5 flex-grow">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    {t.contact.commentLabel}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-y"
                  />
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                  <p className="text-green-600 text-sm mb-4">{t.contact.successMessage}</p>
                )}
                {status === 'error' && (
                  <p className="text-red-600 text-sm mb-4">{t.contact.errorMessage}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="self-start bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-wider py-3 px-10 rounded-lg transition-colors disabled:opacity-60"
                >
                  {status === 'sending' ? t.contact.sending : t.contact.submitBtn}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </Section>
  );
};
