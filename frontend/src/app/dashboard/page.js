'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';
import Navbar from '@/components/Navbar';
import TripForm from '@/components/TripForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import BudgetEstimate from '@/components/BudgetEstimate';
import HotelSuggestions from '@/components/HotelSuggestions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { tripAPI } from '@/utils/api';

export default function Dashboard() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchTrips();
  }, [router]);

  const fetchTrips = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const response = await tripAPI.getTrips();
      setTrips(response.data.trips);
    } catch (fetchError) {
      setError('Failed to load trips. Please try again.');
      console.error('Failed to fetch trips:', fetchError);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCreateTrip = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tripAPI.createTrip(formData);
      const newTrip = response.data.trip;
      setTrips([...trips, newTrip]);
      setSelectedTrip(newTrip);

      setGeneratingId(newTrip._id);
      const itineraryResponse = await tripAPI.generateItinerary(newTrip._id);
      const generatedTrip = itineraryResponse.data.trip;
      setSelectedTrip(generatedTrip);
      setTrips((currentTrips) =>
        currentTrips.map((trip) => (trip._id === generatedTrip._id ? generatedTrip : trip))
      );
    } catch (createError) {
      setError(createError.response?.data?.message || 'Failed to create trip. Please try again.');
      console.error('Failed to create trip:', createError);
    } finally {
      setGeneratingId(null);
      setLoading(false);
    }
  };

  const handleUpdateItinerary = async (day, activities) => {
    if (!selectedTrip) return;
    try {
      const response = await tripAPI.updateItinerary(selectedTrip._id, day, activities);
      setSelectedTrip(response.data.trip);
      setError(null);
    } catch (updateError) {
      setError('Failed to update itinerary');
      console.error('Failed to update itinerary:', updateError);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      await tripAPI.deleteTrip(tripId);
      setTrips(trips.filter((trip) => trip._id !== tripId));
      if (selectedTrip?._id === tripId) {
        setSelectedTrip(null);
      }
      setError(null);
    } catch (deleteError) {
      setError('Failed to delete trip');
      console.error('Failed to delete trip:', deleteError);
    }
  };

  if (initialLoading) {
    return (
      <div className="app-shell">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
              Build and refine your trips
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Create a trip, review the generated plan, then edit each day until it feels ready to travel.
            </p>
          </div>
          <div className="surface px-4 py-3">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Saved trips</p>
            <p className="text-2xl font-black text-slate-950 dark:text-white">{trips.length}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold underline-offset-4 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
          <aside className="space-y-6">
            <TripForm onSubmit={handleCreateTrip} loading={loading} />

            <section className="surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">My trips</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {trips.length}
                </span>
              </div>

              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {trips.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 p-5 text-center dark:border-slate-700">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">No trips yet</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create one to see it here.</p>
                  </div>
                ) : (
                  trips.map((trip) => {
                    const selected = selectedTrip?._id === trip._id;

                    return (
                      <article
                        key={trip._id}
                        className={`rounded-lg border p-4 transition ${
                          selected
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-400/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700'
                        }`}
                      >
                        <button onClick={() => setSelectedTrip(trip)} className="block w-full text-left">
                          <h3 className="font-bold text-slate-950 dark:text-white">{trip.destination}</h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {trip.numberOfDays} days | {trip.budgetType}
                          </p>
                          {trip.interests?.length > 0 && (
                            <p className="mt-2 line-clamp-1 text-xs font-medium text-slate-400">
                              {trip.interests.join(', ')}
                            </p>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(trip._id)}
                          className="mt-3 text-sm font-bold text-red-600 transition hover:text-red-700 dark:text-red-300"
                        >
                          Delete
                        </button>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </aside>

          <section>
            {selectedTrip ? (
              <div className="space-y-8">
                <div className="surface overflow-hidden">
                  <div className="border-b border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-200">Selected trip</p>
                    <h2 className="mt-2 text-3xl font-black">{selectedTrip.destination}</h2>
                  </div>
                  <div className="grid gap-4 p-5 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Duration</p>
                      <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{selectedTrip.numberOfDays} days</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Budget</p>
                      <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{selectedTrip.budgetType}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Interests</p>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {selectedTrip.interests?.join(', ') || 'None selected'}
                      </p>
                    </div>
                  </div>
                </div>

                {generatingId === selectedTrip._id ? (
                  <div className="surface p-8 text-center">
                    <div className="flex items-center justify-center gap-3 text-lg font-bold text-slate-950 dark:text-white">
                      <LoadingSpinner />
                      Generating your itinerary...
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      This can take a moment while the AI drafts the route.
                    </p>
                  </div>
                ) : (
                  <>
                    <ItineraryDisplay trip={selectedTrip} onUpdate={handleUpdateItinerary} loading={false} />
                    <BudgetEstimate budget={selectedTrip.budgetEstimate} />
                    <HotelSuggestions hotels={selectedTrip.hotelSuggestions} />
                  </>
                )}
              </div>
            ) : (
              <div className="surface flex min-h-[420px] items-center justify-center p-8 text-center">
                <div className="max-w-md">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
                    Ready when you are
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                    Create or select a trip
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Your itinerary, budget, and stay recommendations will appear here.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
