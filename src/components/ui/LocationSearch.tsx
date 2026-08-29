import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Locate, X, Navigation } from 'lucide-react'
import { getCurrentLocation, searchLocations, geocodeAddress, type LocationSuggestion } from '../../lib/geocoding'

interface LocationSearchProps {
  value: string
  onChange: (value: string) => void
  onCoordinates?: (lat: number, lng: number) => void
  placeholder?: string
  className?: string
}

export default function LocationSearch({
  value,
  onChange,
  onCoordinates,
  placeholder = 'Search for an address...',
  className = '',
}: LocationSearchProps) {
  const [detectingLocation, setDetectingLocation] = useState(false)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [locationDetected, setLocationDetected] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Auto-detect location on mount if no value
  useEffect(() => {
    if (!value && navigator.geolocation) {
      // Don't auto-detect, but show a suggestion
    }
  }, [value])

  // Debounced search
  const handleInputChange = useCallback((val: string) => {
    onChange(val)
    setHighlightIdx(-1)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (val.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const results = await searchLocations(val)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setLoading(false)
    }, 300)
  }, [onChange])

  // Select a suggestion
  const selectSuggestion = async (suggestion: LocationSuggestion) => {
    onChange(suggestion.text)
    setShowSuggestions(false)
    setLoading(true)

    const result = await geocodeAddress(suggestion.text)
    if (result && onCoordinates) {
      onCoordinates(result.latitude, result.longitude)
    }
    setLoading(false)
  }

  // Detect current GPS location
  const detectMyLocation = useCallback(async () => {
    setDetectingLocation(true)
    try {
      const result = await getCurrentLocation()
      if (result) {
        onChange(result.formattedAddress)
        if (onCoordinates) {
          onCoordinates(result.latitude, result.longitude)
        }
        setLocationDetected(true)
      } else {
        // GPS failed, show friendly message
        alert('Could not detect your location. Please ensure location access is enabled in your browser settings.')
      }
    } catch {
      alert('Location detection failed. Please try again or enter your address manually.')
    }
    setDetectingLocation(false)
  }, [onChange, onCoordinates])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault()
      selectSuggestion(suggestions[highlightIdx])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* GPS Location Banner */}
      {!value && (
        <button
          onClick={detectMyLocation}
          disabled={detectingLocation}
          className="w-full mb-3 flex items-center justify-center gap-2.5 py-3.5 rounded-[14px] font-medium text-[14px] transition-all disabled:opacity-60"
          style={{
            background: detectingLocation ? '#F5F3FF' : 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
            color: detectingLocation ? '#6D28D9' : 'white',
            border: detectingLocation ? '1.5px solid #E8E7F0' : 'none',
            boxShadow: detectingLocation ? 'none' : '0 8px 24px rgba(109, 40, 217, 0.25)',
          }}
        >
          <Navigation className={`w-4.5 h-4.5 ${detectingLocation ? 'animate-spin' : ''}`} />
          {detectingLocation ? 'Detecting your location...' : '📍 Use My Current Location (GPS)'}
        </button>
      )}

      {/* Detected indicator */}
      {locationDetected && (
        <div className="mb-3 flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-green-50 border border-green-100">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[13px] font-medium text-green-700">Location detected successfully</span>
        </div>
      )}

      {/* Search input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B5FD] pointer-events-none z-10" />
          <input
            ref={inputRef}
            type="text"
            defaultValue={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="form-input !pl-11 !pr-10"
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
          />
          {value && (
            <button
              onClick={() => {
                onChange('')
                setLocationDetected(false)
                if (inputRef.current) inputRef.current.value = ''
                setSuggestions([])
                setShowSuggestions(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8DA3] hover:text-[#6D28D9] z-10"
              aria-label="Clear location"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {loading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 border-2 border-[#E8E7F0] border-t-[#6D28D9] rounded-full animate-spin" />
            </div>
          )}
        </div>

        {value && (
          <button
            onClick={detectMyLocation}
            disabled={detectingLocation}
            className="px-4 py-2.5 rounded-[14px] text-[13px] font-medium border border-[#E8E7F0] text-[#6D28D9] hover:bg-[#F5F3FF] hover:border-[#C4B5FD] transition-all shrink-0 flex items-center gap-2"
          >
            <Locate className={`w-4 h-4 ${detectingLocation ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{detectingLocation ? 'Detecting...' : 'GPS'}</span>
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-[16px] border border-[#E8E7F0] overflow-hidden shadow-[0_20px_60px_rgba(109,40,217,0.12)]"
          role="listbox"
        >
          {suggestions.map((s, i) => (
            <button
              key={`${s.text}-${i}`}
              onClick={() => selectSuggestion(s)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all ${
                i === highlightIdx
                  ? 'bg-[#F5F3FF]'
                  : 'hover:bg-[#FAFAFF]'
              }`}
              role="option"
              aria-selected={i === highlightIdx}
            >
              <MapPin className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[#111129] truncate">{s.text}</p>
                {s.subtext && (
                  <p className="text-[11px] text-[#8B8DA3] truncate">{s.subtext}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Hint */}
      <p className="text-[11px] text-[#8B8DA3] mt-2">
        💡 Click the GPS button above or type an address to search
      </p>
    </div>
  )
}
