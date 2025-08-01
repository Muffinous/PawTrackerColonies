// src/components/LocationPicker/LocationPicker.tsx
import React, { useEffect, useRef, useState } from 'react';
import './LocationPicker.css';
import { Autocomplete } from '@react-google-maps/api';
import { ColonyLocation } from '../../models/Location';
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Add global declaration for google namespace
declare global {
    interface Window {
        google: typeof google;
    }
    // Removed duplicate declaration of google.maps.places.Autocomplete
}


interface Props {
    onLocationSelected: (location: ColonyLocation) => void;
    initialLocation?: ColonyLocation | null;
}

const LocationPicker: React.FC<Props> = ({ onLocationSelected, initialLocation }) => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [inputValue, setInputValue] = useState(initialLocation?.address ?? '');

    useEffect(() => {
        if (!window.google) {
            // Aquí se puede cargar el script si aún no está cargado
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }, []);

    useEffect(() => {
        setInputValue(initialLocation?.address ?? '');
    }, [initialLocation]);

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                let country = '';
                let postalCode = '';

                if (place.address_components) {
                    const countryComponent = place.address_components.find((comp: any) =>
                        comp.types.includes('country')
                    );
                    country = countryComponent ? countryComponent.long_name : '';

                    const postalComponent = place.address_components.find((comp: any) =>
                        comp.types.includes('postal_code')
                    );
                    postalCode = postalComponent ? postalComponent.long_name : '';

                }

                onLocationSelected({
                    address: place.formatted_address ?? '',
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                    country: country,
                    postalCode: postalCode,
                });
            }
        }
    };

    return (
        <Autocomplete
            onLoad={ref => (autocompleteRef.current = ref)}
            onPlaceChanged={onPlaceChanged}
        >
            <input
                type="text"
                className="input-field"
                placeholder="Enter your address or location"
                value={inputValue}
                onChange={e => {
                    setInputValue(e.target.value);
                    if (e.target.value === '') {
                        onLocationSelected({
                            address: '',
                            latitude: 0,
                            longitude: 0,
                            country: '',
                            postalCode: '',
                        });
                    }
                }}
            />
        </Autocomplete>
    );
};

export default LocationPicker;