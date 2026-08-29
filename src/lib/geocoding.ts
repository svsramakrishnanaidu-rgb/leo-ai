/**
 * Geocoding Service — Nominatim (OpenStreetMap) + Local Indian Locations
 * No Google Maps dependency — fully free and CORS-friendly
 */

// ── Nominatim (OpenStreetMap) ──────────────────────────────────

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
}

export async function nominatimSearch(query: string): Promise<NominatimResult[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=in&limit=5`,
      { headers: { 'Accept-Language': 'en' } }
    )
    return await res.json()
  } catch {
    return []
  }
}

export async function nominatimReverse(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  } catch {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  }
}

// ── Common Indian locations for instant search ─────────────────

export const INDIAN_LOCATIONS = [
  { text: 'Guntur, Andhra Pradesh, India', lat: 16.3067, lng: 80.4365 },
  { text: 'Vijayawada, Andhra Pradesh, India', lat: 16.5062, lng: 80.6480 },
  { text: 'Hyderabad, Telangana, India', lat: 17.3850, lng: 78.4867 },
  { text: 'Visakhapatnam, Andhra Pradesh, India', lat: 17.6868, lng: 83.2185 },
  { text: 'Tirupati, Andhra Pradesh, India', lat: 13.6288, lng: 79.4192 },
  { text: 'Bengaluru, Karnataka, India', lat: 12.9716, lng: 77.5946 },
  { text: 'Chennai, Tamil Nadu, India', lat: 13.0827, lng: 80.2707 },
  { text: 'Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777 },
  { text: 'Delhi, India', lat: 28.7041, lng: 77.1025 },
  { text: 'Kolkata, West Bengal, India', lat: 22.5726, lng: 88.3639 },
  { text: 'Pune, Maharashtra, India', lat: 18.5204, lng: 73.8567 },
  { text: 'Ahmedabad, Gujarat, India', lat: 23.0225, lng: 72.5714 },
  { text: 'Jaipur, Rajasthan, India', lat: 26.9124, lng: 75.7873 },
  { text: 'Lucknow, Uttar Pradesh, India', lat: 26.8467, lng: 80.9462 },
  { text: 'Bhopal, Madhya Pradesh, India', lat: 23.2599, lng: 77.4126 },
  { text: 'Patna, Bihar, India', lat: 25.6093, lng: 85.1376 },
  { text: 'Kochi, Kerala, India', lat: 9.9312, lng: 76.2673 },
  { text: 'Nagpur, Maharashtra, India', lat: 21.1458, lng: 79.0882 },
  { text: 'Indore, Madhya Pradesh, India', lat: 22.7196, lng: 75.8577 },
  { text: 'Thiruvananthapuram, Kerala, India', lat: 8.5241, lng: 76.9366 },
  { text: 'MG Road, Guntur, Andhra Pradesh, India', lat: 16.3067, lng: 80.4365 },
  { text: 'Amaravati, Andhra Pradesh, India', lat: 16.5134, lng: 80.5170 },
  { text: 'Suryapet, Telangana, India', lat: 17.1413, lng: 79.6294 },
  { text: 'Nellore, Andhra Pradesh, India', lat: 14.4426, lng: 79.9865 },
  { text: 'Kurnool, Andhra Pradesh, India', lat: 15.8281, lng: 78.0373 },
  { text: 'Rajahmundry, Andhra Pradesh, India', lat: 17.0005, lng: 81.8040 },
  { text: 'Kakinada, Andhra Pradesh, India', lat: 16.9891, lng: 82.2475 },
  { text: 'Warangal, Telangana, India', lat: 17.9784, lng: 79.5941 },
  { text: 'Karimnagar, Telangana, India', lat: 18.4386, lng: 79.1288 },
  { text: 'Machilipatnam, Andhra Pradesh, India', lat: 16.1869, lng: 81.1384 },
]

// ── Types ──────────────────────────────────────────────────────

export interface LocationSuggestion {
  text: string
  subtext?: string
}

export interface GeocodedAddress {
  formattedAddress: string
  latitude: number
  longitude: number
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Search for locations — local Indian database + Nominatim
 */
export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  if (!query.trim() || query.trim().length < 2) return []

  const lower = query.toLowerCase()

  // Instant local match (no network needed)
  const localMatches = INDIAN_LOCATIONS
    .filter(loc => loc.text.toLowerCase().includes(lower))
    .slice(0, 5)
    .map(loc => ({ text: loc.text, subtext: 'India' }))

  // Nominatim search for broader coverage
  if (query.trim().length >= 3) {
    const nominatimResults = await nominatimSearch(query)
    for (const r of nominatimResults) {
      if (!localMatches.find(m => m.text === r.display_name)) {
        localMatches.push({ text: r.display_name, subtext: 'via OpenStreetMap' })
      }
    }
  }

  return localMatches.slice(0, 6)
}

/**
 * Get coordinates for a text address
 */
export async function geocodeAddress(address: string): Promise<GeocodedAddress | null> {
  // Check local database first
  const local = INDIAN_LOCATIONS.find(loc => loc.text === address)
  if (local) {
    return { formattedAddress: local.text, latitude: local.lat, longitude: local.lng }
  }

  // Nominatim fallback
  const results = await nominatimSearch(address)
  if (results[0]) {
    return {
      formattedAddress: results[0].display_name,
      latitude: parseFloat(results[0].lat),
      longitude: parseFloat(results[0].lon),
    }
  }

  return null
}

/**
 * Reverse geocode: coordinates → address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  // Check local database for nearby known locations
  const nearby = INDIAN_LOCATIONS.find(loc =>
    Math.abs(loc.lat - lat) < 0.05 && Math.abs(loc.lng - lng) < 0.05
  )
  if (nearby) return nearby.text

  return nominatimReverse(lat, lng)
}

/**
 * Get current browser location and reverse geocode it
 */
export async function getCurrentLocation(): Promise<GeocodedAddress | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const address = await reverseGeocode(latitude, longitude)
        resolve({ formattedAddress: address, latitude, longitude })
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  })
}
