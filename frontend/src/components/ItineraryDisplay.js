'use client';

import { useState } from 'react';

export default function ItineraryDisplay({ trip, onUpdate, loading }) {
  const [editingDay, setEditingDay] = useState(null);
  const [editActivities, setEditActivities] = useState('');

  const handleEditDay = (day) => {
    const dayData = trip.itinerary.find((item) => item.day === day);
    setEditingDay(day);
    setEditActivities(dayData?.activities?.join('\n') || '');
  };

  const handleSaveDay = async () => {
    if (editingDay === null) return;

    const activities = editActivities
      .split('\n')
      .map((activity) => activity.trim())
      .filter(Boolean);

    await onUpdate(editingDay, activities);
    setEditingDay(null);
  };

  if (!trip.itinerary || trip.itinerary.length === 0) {
    return (
      <div className="surface p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        No itinerary generated yet.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
            Daily plan
          </p>
          <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Your itinerary</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{trip.itinerary.length} planned days</p>
      </div>

      <div className="space-y-3">
        {trip.itinerary.map((dayData) => (
          <article key={dayData.day} className="surface overflow-hidden">
            <div className="flex gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white dark:bg-teal-400 dark:text-slate-950">
                D{dayData.day}
              </div>

              <div className="min-w-0 flex-1">
                {editingDay === dayData.day ? (
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h4 className="font-bold text-slate-950 dark:text-white">Day {dayData.day}</h4>
                      <span className="text-xs font-medium text-slate-400">One activity per line</span>
                    </div>
                    <textarea
                      value={editActivities}
                      onChange={(e) => setEditActivities(e.target.value)}
                      className="field min-h-32"
                      rows="5"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={handleSaveDay} disabled={loading} className="primary-button px-4 py-2">
                        Save changes
                      </button>
                      <button onClick={() => setEditingDay(null)} className="secondary-button">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-950 dark:text-white">Day {dayData.day}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {dayData.activities?.length || 0} activities
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditDay(dayData.day)}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-400/10"
                      >
                        Edit
                      </button>
                    </div>
                    <ol className="space-y-2">
                      {dayData.activities?.map((activity, index) => (
                        <li key={index} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                            {index + 1}
                          </span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
