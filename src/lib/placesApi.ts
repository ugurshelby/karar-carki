import type { Venue } from '../types';

type AutocompleteSuggestion = {
  description: string;
  placeId: string;
};

type PlaceDetails = Pick<
  Venue,
  'placeId' | 'name' | 'rating' | 'priceLevel' | 'photoUrl' | 'address' | 'lat' | 'lng'
>;

function getGoogle() {
  return (globalThis as unknown as { google?: typeof google }).google;
}

export function isPlacesReady(): boolean {
  const g = getGoogle();
  return !!g?.maps?.places;
}

function getAutocompleteService(): google.maps.places.AutocompleteService {
  const g = getGoogle();
  if (!g?.maps?.places) {
    throw new Error('Google Places is not loaded');
  }
  return new g.maps.places.AutocompleteService();
}

let placesService: google.maps.places.PlacesService | null = null;
function getPlacesService(): google.maps.places.PlacesService {
  const g = getGoogle();
  if (!g?.maps?.places) {
    throw new Error('Google Places is not loaded');
  }
  if (placesService) return placesService;
  const el = document.createElement('div');
  el.style.display = 'none';
  document.body.appendChild(el);
  placesService = new g.maps.places.PlacesService(el);
  return placesService;
}

export async function getAutocompleteSuggestions(input: string): Promise<AutocompleteSuggestion[]> {
  if (!input.trim()) return [];
  if (!isPlacesReady()) return [];

  const svc = getAutocompleteService();
  return await new Promise((resolve) => {
    svc.getPlacePredictions(
      { input, language: 'tr' },
      (predictions: google.maps.places.AutocompletePrediction[] | null) => {
        const list = (predictions ?? [])
          .filter((p): p is google.maps.places.AutocompletePrediction => !!p?.place_id && !!p.description)
          .map((p) => ({ description: p.description, placeId: p.place_id }));
        resolve(list);
      }
    );
  });
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  if (!placeId) return null;
  if (!isPlacesReady()) return null;

  const svc = getPlacesService();
  return await new Promise((resolve) => {
    svc.getDetails(
      {
        placeId,
        fields: ['place_id', 'name', 'rating', 'price_level', 'photos', 'formatted_address', 'geometry'],
        language: 'tr',
      },
      (place, status) => {
        if (status !== 'OK' || !place) {
          resolve(null);
          return;
        }

        const photo = place.photos?.[0];
        const photoUrl = photo ? photo.getUrl({ maxWidth: 800 }) : null;
        const loc = place.geometry?.location;

        resolve({
          placeId: place.place_id ?? placeId,
          name: place.name ?? '',
          rating: typeof place.rating === 'number' ? place.rating : null,
          priceLevel: typeof place.price_level === 'number' ? place.price_level : null,
          photoUrl,
          address: place.formatted_address ?? null,
          lat: typeof loc?.lat === 'function' ? loc.lat() : null,
          lng: typeof loc?.lng === 'function' ? loc.lng() : null,
        });
      }
    );
  });
}

