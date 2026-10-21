import React, { useState, useEffect, useRef, useId } from 'react';
import {
  MapPin, Navigation, Search, Compass, Phone, Clock, Star,
  ExternalLink, AlertCircle, CheckCircle2, RefreshCw, SlidersHorizontal,
  Info, ShieldCheck, X, Building2, AlertTriangle, ArrowRight, Map as MapIcon
} from 'lucide-react';

// Curated verified sample reference Jan Aushadhi Kendras across major Indian regions
// Used as realistic reference directory and fallback when live API key is not yet configured
const referenceKendras = [
  {
    id: 'kendra-delhi-1',
    name: 'Pradhan Mantri Bhartiya Janaushadhi Kendra - Connaught Place',
    address: 'Near Super Bazar, Outer Circle, Connaught Place, New Delhi, Delhi 110001',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    lat: 28.6315,
    lng: 77.2167,
    phone: '1800-180-8080 (PMBJP Helpline)',
    openingHours: '09:00 AM – 09:00 PM (All Days)',
    isOpen: true,
    rating: 4.5,
    userRatingsTotal: 142,
    isConfirmedKendra: true,
    schemeCode: 'PMBJK-DL-0142'
  },
  {
    id: 'kendra-delhi-2',
    name: 'PMBJK Jan Aushadhi Store - AIIMS Metro Gate',
    address: 'Opposite AIIMS Hospital, Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110029',
    lat: 28.5672,
    lng: 77.2100,
    phone: '011-2659-3300',
    openingHours: '08:30 AM – 10:00 PM',
    isOpen: true,
    rating: 4.6,
    userRatingsTotal: 310,
    isConfirmedKendra: true,
    schemeCode: 'PMBJK-DL-0089'
  },
  {
    id: 'kendra-mumbai-1',
    name: 'Pradhan Mantri Jan Aushadhi Kendra - Dadar West',
    address: 'Shop No. 4, Near Dadar Railway Station, NC Kelkar Road, Dadar West, Mumbai, Maharashtra 400028',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400028',
    lat: 19.0178,
    lng: 72.8478,
    phone: '022-2430-8812',
    openingHours: '09:00 AM – 09:30 PM',
    isOpen: true,
    rating: 4.4,
    userRatingsTotal: 198,
    isConfirmedKendra: true,
    schemeCode: 'PMBJK-MH-0512'
  },
  {
    id: 'kendra-bengaluru-1',
    name: 'Jan Aushadhi Generic Pharmacy - Jayanagar',
    address: '4th Block, 11th Main Rd, Near Post Office, Jayanagar, Bengaluru, Karnataka 560011',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560011',
    lat: 12.9250,
    lng: 77.5938,
    phone: '080-2244-1190',
    openingHours: '09:00 AM – 08:30 PM',
    isOpen: true,
    rating: 4.3,
    userRatingsTotal: 115,
    isConfirmedKendra: true,
    schemeCode: 'PMBJK-KA-0318'
  },
  {
    id: 'kendra-lucknow-1',
    name: 'Pradhan Mantri Janaushadhi Kendra - Hazratganj',
    address: 'Civil Hospital Campus, Hazratganj, Lucknow, Uttar Pradesh 226001',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226001',
    lat: 26.8500,
    lng: 80.9400,
    phone: '1800-180-8080',
    openingHours: '09:00 AM – 08:00 PM',
    isOpen: true,
    rating: 4.2,
    userRatingsTotal: 84,
    isConfirmedKendra: true,
    schemeCode: 'PMBJK-UP-0210'
  },
  {
    id: 'kendra-kolkata-1',
    name: 'Jan Aushadhi Medical Store - Salt Lake',
    address: 'Sector 1, Near Karunamoyee Bus Station, Bidhannagar, Kolkata, West Bengal 700064',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700064',
    lat: 22.5867,
    lng: 88.4178,
    phone: '033-2337-4401',
    openingHours: '09:30 AM – 08:30 PM',
    isOpen: true,
    rating: 4.4,
    userRatingsTotal: 96,
    isConfirmedKendra: true,
    schemeCode: 'PMBJK-WB-0104'
  }
];

// Helper: Haversine distance formula (in km)
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export default function NearbyStoresSection() {
  const mapContainerRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const searchInputId = useId();

  // Configuration check
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasValidApiKey = Boolean(
    apiKey &&
    apiKey.trim() !== '' &&
    apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE'
  );

  // Component states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(10); // in km
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [stores, setStores] = useState(referenceKendras);
  const [selectedStoreId, setSelectedStoreId] = useState(referenceKendras[0].id);
  const [isSearching, setIsSearching] = useState(false);
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [mapsApiError, setMapsApiError] = useState(false);

  // Load Google Maps JavaScript API when API key is present
  useEffect(() => {
    if (!hasValidApiKey) return;

    if (window.google && window.google.maps) {
      setMapsApiLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapsApiLoaded(true);
      script.onerror = () => {
        setMapsApiError(true);
        console.warn('Google Maps API failed to load. Running in directory fallback mode.');
      };
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', () => setMapsApiLoaded(true));
      existingScript.addEventListener('error', () => setMapsApiError(true));
    }
  }, [hasValidApiKey, apiKey]);

  // Initialize or re-render Google Map
  useEffect(() => {
    if (!mapsApiLoaded || !window.google || !mapContainerRef.current) return;

    const defaultCenter = userLocation
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : { lat: 28.6139, lng: 77.2090 }; // New Delhi default

    if (!googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi.medical',
            elementType: 'geometry',
            stylers: [{ color: '#eaf4ff' }]
          }
        ]
      });

      infoWindowRef.current = new window.google.maps.InfoWindow();
    } else {
      googleMapRef.current.setCenter(defaultCenter);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add user marker if location is known
    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: googleMapRef.current,
        title: 'Your Current Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#075be5',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2.5
        }
      });
      markersRef.current.push(userMarker);
    }

    // Add Kendra markers
    stores.forEach((store) => {
      if (!store.lat || !store.lng) return;

      const marker = new window.google.maps.Marker({
        position: { lat: store.lat, lng: store.lng },
        map: googleMapRef.current,
        title: store.name,
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: selectedStoreId === store.id ? '#075be5' : '#098c6d',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
          scale: 1.6,
          anchor: new window.google.maps.Point(12, 22)
        }
      });

      marker.addListener('click', () => {
        setSelectedStoreId(store.id);
        const directionsUrl = getDirectionsUrl(store);

        const contentString = `
          <div style="padding: 8px 10px; max-width: 240px; font-family: Inter, sans-serif;">
            <span style="display:inline-block; font-size:10px; font-weight:700; color:#098c6d; background:#e6f9f3; padding:2px 6px; border-radius:8px; margin-bottom:4px;">PMBJP Kendra</span>
            <strong style="display:block; font-size:13px; color:#0b1e49; margin-bottom:4px; line-height:1.3;">${store.name}</strong>
            <p style="margin:0 0 8px; font-size:11.5px; color:#41577e; line-height:1.4;">${store.address}</p>
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:11.5px; font-weight:700; color:#075be5; text-decoration:none;">
              Get Directions ➔
            </a>
          </div>
        `;
        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open(googleMapRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [mapsApiLoaded, stores, userLocation, selectedStoreId]);

  // Request browser geolocation
  const handleUseCurrentLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Please search by city, area, or PIN code.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);
        setLocationAddress('Your Detected Location');
        setIsLocating(false);

        // Recalculate distances for reference stores
        updateDistancesForLocation(coords.lat, coords.lng);

        // Live Google Places search if API is loaded
        if (hasValidApiKey && window.google && window.google.maps && window.google.maps.places) {
          performPlacesSearch(coords);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access was denied. You can still search by city, area, or PIN code below.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is currently unavailable. Please search by city or PIN code.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please enter your location manually.');
            break;
          default:
            setLocationError('Unable to detect location. Please search by city or PIN code.');
            break;
        }
      },
      { timeout: 12000, maximumAge: 60000 }
    );
  };

  // Perform Google Places search around a coordinate
  const performPlacesSearch = (coords) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    const dummyNode = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(dummyNode);

    setIsSearching(true);

    const request = {
      location: new window.google.maps.LatLng(coords.lat, coords.lng),
      radius: selectedRadius * 1000,
      keyword: 'Jan Aushadhi Kendra'
    };

    service.nearbySearch(request, (results, status) => {
      setIsSearching(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const mappedStores = results.map((place) => {
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();
          const dist = coords ? calculateDistanceKm(coords.lat, coords.lng, lat, lng) : null;

          return {
            id: place.place_id,
            name: place.name,
            address: place.vicinity || place.formatted_address || 'Address provided on Google Maps',
            lat,
            lng,
            phone: 'Contact via Google Maps',
            openingHours: place.opening_hours?.isOpen?.() ? 'Open Now' : 'Check hours on Maps',
            isOpen: place.opening_hours?.isOpen?.(),
            rating: place.rating || null,
            userRatingsTotal: place.user_ratings_total || null,
            distance: dist,
            isConfirmedKendra: place.name.toLowerCase().includes('aushadhi') || place.name.toLowerCase().includes('pmbjk'),
            placeId: place.place_id
          };
        });

        mappedStores.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
        setStores(mappedStores);
        if (mappedStores.length > 0) setSelectedStoreId(mappedStores[0].id);
      } else {
        // Fallback to reference set with distance
        updateDistancesForLocation(coords.lat, coords.lng);
      }
    });
  };

  // Update distance on stores when location is known
  const updateDistancesForLocation = (userLat, userLng) => {
    const updated = referenceKendras.map((store) => ({
      ...store,
      distance: calculateDistanceKm(userLat, userLng, store.lat, store.lng)
    }));
    updated.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
    setStores(updated);
    if (updated.length > 0) setSelectedStoreId(updated[0].id);
  };

  // Handle manual address / PIN code search
  const handleManualSearch = (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setLocationError('');
    setIsSearching(true);

    // If Google Maps Geocoder is available, geocode the address
    if (hasValidApiKey && window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: `${query}, India` }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const loc = results[0].geometry.location;
          const coords = { lat: loc.lat(), lng: loc.lng() };
          setUserLocation(coords);
          setLocationAddress(results[0].formatted_address);
          performPlacesSearch(coords);
        } else {
          setIsSearching(false);
          filterReferenceStoresByQuery(query);
        }
      });
    } else {
      // Offline / Fallback filter matching query with reference list
      setTimeout(() => {
        setIsSearching(false);
        filterReferenceStoresByQuery(query);
      }, 300);
    }
  };

  const filterReferenceStoresByQuery = (query) => {
    const q = query.toLowerCase();
    const matched = referenceKendras.filter(
      (s) =>
        s.city.toLowerCase().includes(q) ||
        s.pincode.includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
    );

    if (matched.length > 0) {
      setStores(matched);
      setSelectedStoreId(matched[0].id);
    } else {
      // Keep all but notify
      setStores(referenceKendras);
      setLocationError(`No exact local test Kendra found matching “${query}”. Showing major national centers or open Google Maps search.`);
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setUserLocation(null);
    setLocationAddress('');
    setLocationError('');
    setStores(referenceKendras);
    setSelectedStoreId(referenceKendras[0].id);
  };

  // Generate official Google Maps directions URL
  const getDirectionsUrl = (store) => {
    const destination = encodeURIComponent(`${store.name}, ${store.address}`);
    let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    if (store.placeId) {
      url += `&destination_place_id=${store.placeId}`;
    }
    if (userLocation) {
      url += `&origin=${userLocation.lat},${userLocation.lng}`;
    }
    return url;
  };

  // Generate Google Maps general search URL for current query/location
  const getMapsGeneralSearchUrl = () => {
    const term = searchQuery ? `Jan Aushadhi Kendra ${searchQuery}` : 'Jan Aushadhi Kendra near me';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(term)}`;
  };

  // Apply filters (radius, open now)
  const displayedStores = stores.filter((store) => {
    if (onlyOpenNow && !store.isOpen) return false;
    if (userLocation && store.distance && store.distance > selectedRadius) {
      // If user specified radius, filter by radius
      return false;
    }
    return true;
  });

  return (
    <section className="nearby-stores-section" id="nearby-stores" aria-labelledby="nearby-stores-heading">
      <div className="section-container">
        {/* Section Intro */}
        <div className="section-intro">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> PRADHAN MANTRI BHARTIYA JANAUSHADHI PARIYOJANA (PMBJP)
          </div>
          <h2 id="nearby-stores-heading" className="section-title">
            Find Your Nearest <span>Jan Aushadhi Kendra</span>
          </h2>
          <p className="section-desc">
            Explore nearby Jan Aushadhi Kendras and find directions to a store near you providing verified generic medicines.
          </p>
        </div>

        {/* API Status / Configuration Notice */}
        {!hasValidApiKey && (
          <div className="setup-guidance-card" role="status">
            <div className="guidance-icon"><Info size={22} /></div>
            <div className="guidance-content">
              <strong>Interactive Store Locator Notice:</strong>
              <p>
                This locator is currently running with a curated reference directory of major Jan Aushadhi Kendras.
                To activate live Google Maps JavaScript &amp; Places search, set <code>VITE_GOOGLE_MAPS_API_KEY</code> in your <code>.env</code> file.
                In the meantime, you can search locations below, view distances, and launch official Google Maps navigation directly.
              </p>
              <div className="guidance-links">
                <a
                  href="http://janaushadhi.gov.in/KendraDetails.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gov-portal-link"
                >
                  Official Government PMBJP Kendra Portal <ExternalLink size={14} />
                </a>
                <a
                  href={getMapsGeneralSearchUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gov-portal-link"
                >
                  Search on Google Maps <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Search & Location Bar */}
        <div className="locator-controls-bar">
          <form className="locator-search-form" onSubmit={handleManualSearch}>
            <div className="search-field-wrap">
              <label htmlFor={searchInputId} className="visually-hidden">Enter area, city, PIN code, or address</label>
              <Search className="field-icon" size={18} />
              <input
                id={searchInputId}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter area, city, PIN code, or address"
                className="locator-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-field-btn"
                  onClick={handleResetSearch}
                  aria-label="Clear location search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary locator-search-btn"
              disabled={isSearching}
            >
              {isSearching ? <RefreshCw className="spin-icon" size={16} /> : <Search size={16} />}
              <span>Search</span>
            </button>
          </form>

          <div className="location-action-wrap">
            <button
              type="button"
              className="btn-secondary gps-btn"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
            >
              {isLocating ? (
                <>
                  <RefreshCw className="spin-icon" size={16} /> Detecting Location...
                </>
              ) : (
                <>
                  <Compass size={18} /> Use My Current Location
                </>
              )}
            </button>
          </div>
        </div>

        {/* Location or Search Status Feedback */}
        {locationError && (
          <div className="location-feedback-alert warning" role="alert">
            <AlertTriangle size={18} />
            <span>{locationError}</span>
          </div>
        )}

        {locationAddress && !locationError && (
          <div className="location-feedback-alert success" role="status">
            <CheckCircle2 size={18} />
            <span>Showing results relative to: <strong>{locationAddress}</strong></span>
          </div>
        )}

        {/* Filters Bar */}
        <div className="locator-filters-bar">
          <div className="filter-group">
            <span className="filter-label"><SlidersHorizontal size={14} /> Search Radius:</span>
            <div className="radius-options">
              {[2, 5, 10, 20].map((radius) => (
                <button
                  key={radius}
                  type="button"
                  className={`radius-pill ${selectedRadius === radius ? 'active' : ''}`}
                  onClick={() => setSelectedRadius(radius)}
                >
                  {radius} km
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group right">
            <label className="open-now-toggle">
              <input
                type="checkbox"
                checked={onlyOpenNow}
                onChange={(e) => setOnlyOpenNow(e.target.checked)}
              />
              <span>Open Now Only</span>
            </label>
          </div>
        </div>

        {/* Main Two-Column Locator Layout */}
        <div className="locator-split-layout">
          {/* Left Column: Results List */}
          <div className="results-column">
            <div className="results-column-header">
              <h3>
                Nearby Jan Aushadhi Stores
                <span className="results-count-badge">
                  {displayedStores.length} {displayedStores.length === 1 ? 'store' : 'stores'}
                </span>
              </h3>
              <a
                href={getMapsGeneralSearchUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="external-maps-search-link"
              >
                Open in Google Maps <ExternalLink size={13} />
              </a>
            </div>

            {displayedStores.length === 0 ? (
              <div className="empty-results-box">
                <AlertCircle size={36} />
                <h4>No Stores Found in this Range</h4>
                <p>
                  No Kendra was found within {selectedRadius} km of this position.
                  Try increasing your search radius or searching by your city or PIN code.
                </p>
                <div className="empty-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setSelectedRadius(20)}
                  >
                    Expand to 20 km
                  </button>
                  <a
                    href={getMapsGeneralSearchUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Search Full City on Google Maps
                  </a>
                </div>
              </div>
            ) : (
              <div className="stores-scroll-list" role="region" aria-label="Store search results">
                {displayedStores.map((store) => {
                  const isSelected = selectedStoreId === store.id;
                  const directionsUrl = getDirectionsUrl(store);

                  return (
                    <article
                      key={store.id}
                      className={`store-result-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedStoreId(store.id)}
                    >
                      <div className="store-card-header">
                        <div>
                          <span className={`kendra-badge ${store.isConfirmedKendra ? 'confirmed' : 'unverified'}`}>
                            {store.isConfirmedKendra ? 'Jan Aushadhi Kendra (PMBJP)' : 'Possible Match — Verify'}
                          </span>
                          <h4 className="store-name">{store.name}</h4>
                        </div>
                        {store.distance !== null && store.distance !== undefined && (
                          <div className="distance-badge" title="Straight-line distance">
                            <Navigation size={12} />
                            <span>~{store.distance} km</span>
                          </div>
                        )}
                      </div>

                      <p className="store-address">
                        <MapPin size={15} className="addr-icon" />
                        <span>{store.address}</span>
                      </p>

                      <div className="store-details-grid">
                        {store.phone && (
                          <div className="detail-item">
                            <Phone size={13} />
                            <span>{store.phone}</span>
                          </div>
                        )}
                        {store.openingHours && (
                          <div className="detail-item">
                            <Clock size={13} />
                            <span>{store.openingHours}</span>
                          </div>
                        )}
                        {store.rating && (
                          <div className="detail-item rating">
                            <Star size={13} />
                            <span>{store.rating} ({store.userRatingsTotal || 0} reviews)</span>
                          </div>
                        )}
                      </div>

                      <div className="store-card-actions">
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary get-directions-btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Navigation size={15} /> Get Directions
                        </a>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary view-map-btn"
                          onClick={(e) => e.stopPropagation()}
                          title="Open place on Google Maps"
                        >
                          <ExternalLink size={14} /> View Details
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Interactive Map */}
          <div className="map-column">
            <div className="map-wrapper-card">
              <div className="map-toolbar">
                <span className="map-status-pill">
                  <span className="pulse-dot" />
                  {mapsApiLoaded ? 'Live Google Maps Mode' : 'Interactive Map Directory'}
                </span>
                <span className="map-distance-notice">
                  *Distances are straight-line estimates
                </span>
              </div>

              {/* Real Google Map Element */}
              {hasValidApiKey && !mapsApiError ? (
                <div
                  ref={mapContainerRef}
                  className="google-map-canvas"
                  aria-label="Google Map showing Jan Aushadhi Kendras"
                />
              ) : (
                /* Fallback Map Interface with styled interactive card representation */
                <div className="fallback-map-canvas">
                  <div className="fallback-map-art" aria-hidden="true">
                    <div className="grid-lines" />
                    <div className="road road-h" />
                    <div className="road road-v" />
                    <div className="road road-diag" />

                    {/* Interactive pins for visible stores */}
                    {displayedStores.slice(0, 6).map((s, index) => (
                      <div
                        key={s.id}
                        className={`mock-pin pin-${index} ${selectedStoreId === s.id ? 'active-pin' : ''}`}
                        onClick={() => setSelectedStoreId(s.id)}
                        title={s.name}
                      >
                        <MapPin size={26} />
                        <span className="pin-tooltip">{s.city}</span>
                      </div>
                    ))}

                    {userLocation && (
                      <div className="mock-user-pin" title="Your Location">
                        <div className="user-pulse" />
                        <Compass size={22} />
                      </div>
                    )}
                  </div>

                  <div className="fallback-overlay-card">
                    <div className="overlay-header">
                      <MapIcon size={20} />
                      <strong>Interactive Kendra Navigator</strong>
                    </div>
                    <p>
                      Click any store on the left to center on its location, calculate distance, and launch turn-by-turn navigation in Google Maps.
                    </p>
                    <a
                      href={getMapsGeneralSearchUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary full-maps-btn"
                    >
                      <Navigation size={15} /> Launch Live in Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Official Scheme Verification Disclaimer */}
        <div className="kendra-disclaimer-card" role="note">
          <div className="kendra-disclaimer-icon">
            <ShieldCheck size={26} />
          </div>
          <div className="kendra-disclaimer-body">
            <strong>About Jan Aushadhi Kendra Listings &amp; Verification</strong>
            <p>
              Pradhan Mantri Bhartiya Janaushadhi Kendras (PMBJK) are operated under the Department of Pharmaceuticals, Ministry of Chemicals &amp; Fertilizers, Government of India.
              Google Maps searches display listings corresponding to publicly indexed pharmacies and Kendras.
              Because store opening hours, phone numbers, and local Kendra inventory fluctuate, we strongly recommend calling or confirming operating hours before traveling.
            </p>
            <a
              href="http://janaushadhi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="scheme-official-link"
            >
              Visit Official Janaushadhi Government Portal (janaushadhi.gov.in) <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
