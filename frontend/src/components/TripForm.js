'use client';

import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function TripForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    destination: '',
    numberOfDays: 1,
    budgetType: 'Medium',
    interests: [],
  });
  const [errors, setErrors] = useState({});

  const interestOptions = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'History'];
  const budgetOptions = ['Low', 'Medium', 'High'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    } else if (formData.destination.length < 2) {
      newErrors.destination = 'Destination must be at least 2 characters';
    } else if (formData.destination.length > 100) {
      newErrors.destination = 'Destination must not exceed 100 characters';
    }
    if (formData.numberOfDays < 1 || formData.numberOfDays > 90) {
      newErrors.numberOfDays = 'Days must be between 1 and 90';
    }
    if (formData.interests.length === 0) {
      newErrors.interests = 'Select at least 1 interest';
    }
    if (formData.interests.length > 6) {
      newErrors.interests = 'Select maximum 6 interests';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (name) => {
    if (!errors[name]) return;
    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfDays' ? parseInt(value, 10) : value,
    }));
    clearError(name);
  };

  const handleInterestChange = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
    clearError('interests');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface p-5 md:p-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
          Trip builder
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Plan your next route</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Pick the basics and let the planner draft a day-by-day trip.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Tokyo, Paris, New York"
            className={`field ${errors.destination ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`}
          />
          {errors.destination && <p className="mt-2 text-sm text-red-600 dark:text-red-300">{errors.destination}</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Duration</label>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
              {formData.numberOfDays} {formData.numberOfDays === 1 ? 'day' : 'days'}
            </span>
          </div>
          <input
            type="range"
            name="numberOfDays"
            value={formData.numberOfDays}
            onChange={handleChange}
            min="1"
            max="90"
            className="w-full cursor-pointer accent-teal-600"
          />
          <div className="mt-1 flex justify-between text-xs font-medium text-slate-400">
            <span>1 day</span>
            <span>90 days</span>
          </div>
          {errors.numberOfDays && <p className="mt-2 text-sm text-red-600 dark:text-red-300">{errors.numberOfDays}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Budget</label>
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-950">
            {budgetOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, budgetType: option }))}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  formData.budgetType === option
                    ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-800 dark:text-teal-300'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Interests</label>
            <span className="text-xs font-semibold text-slate-400">{formData.interests.length}/6 selected</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map((interest) => {
              const checked = formData.interests.includes(interest);
              const disabled = !checked && formData.interests.length >= 6;

              return (
                <label
                  key={interest}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                    checked
                      ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-400/10 dark:text-teal-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
                  } ${disabled ? 'cursor-not-allowed opacity-45' : ''}`}
                >
                  <span>{interest}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleInterestChange(interest)}
                    disabled={disabled}
                    className="h-4 w-4 accent-teal-600"
                  />
                </label>
              );
            })}
          </div>
          {errors.interests && <p className="mt-2 text-sm text-red-600 dark:text-red-300">{errors.interests}</p>}
        </div>

        <button type="submit" disabled={loading} className="primary-button w-full">
          {loading && <LoadingSpinner />}
          {loading ? 'Planning trip...' : 'Plan my trip'}
        </button>
      </div>
    </form>
  );
}
