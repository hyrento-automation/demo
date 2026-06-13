import { useState, useCallback, useEffect } from 'react';

// Add basic type definitions for window.google to avoid needing @types/google.maps
declare global {
  interface Window {
    google: any;
  }
}

interface Prediction {
  description: string;
  place_id: string;
}

export function useGooglePlaces() {
  const [autocompleteService, setAutocompleteService] = useState<any>(null);

  const initService = useCallback(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
    }
  }, []);

  useEffect(() => {
    // If the script is already loaded when this hook mounts
    if (window.google && window.google.maps && window.google.maps.places) {
      initService();
    }
  }, [initService]);

  const fetchPredictions = useCallback(
    (input: string, callback: (predictions: Prediction[]) => void) => {
      if (!autocompleteService || !input) {
        callback([]);
        return;
      }

      autocompleteService.getPlacePredictions(
        { input, componentRestrictions: { country: 'mu' } }, // Restricted to Mauritius as per context
        (predictions: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            callback(predictions.map((p: any) => ({ description: p.description, place_id: p.place_id })));
          } else {
            callback([]);
          }
        }
      );
    },
    [autocompleteService]
  );

  return { fetchPredictions, initService };
}
