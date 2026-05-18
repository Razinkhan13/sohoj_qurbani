import { useCallback, useRef, useState } from 'react';
import type { UserLocation } from '../types';

interface GeolocationState {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
  stopTracking: () => void;
}

export function useGeolocation(): GeolocationState {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLocation(null);
    setError(null);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।');
      return;
    }
    // Clear any previous watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    setLoading(true);
    setError(null);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setLoading(false);
      },
      (err) => {
        const messages: Record<number, string> = {
          [err.PERMISSION_DENIED]: 'লোকেশন অ্যাক্সেসের অনুমতি দিন।',
          [err.POSITION_UNAVAILABLE]: 'লোকেশন তথ্য পাওয়া যাচ্ছে না।',
          [err.TIMEOUT]: 'লোকেশন পেতে সময় বেশি লাগছে। পুনরায় চেষ্টা করুন।',
        };
        setError(messages[err.code] ?? 'লোকেশন পাওয়া যায়নি।');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );

    watchIdRef.current = id;
  }, []);

  return { location, loading, error, requestLocation, stopTracking };
}
