import React, { useEffect, useState } from 'react';
import './NewColony.css'; // Import the CSS file for styling
import { IonInput, IonButton, IonContent, IonPage, IonIcon, IonToolbar, IonHeader, IonTitle, IonRouterLink, IonLoading, IonBackButton, IonButtons } from '@ionic/react';
import { pawOutline } from 'ionicons/icons';
import pawLogo from '../../assets/pawlogo.png'; // Import the cat image
import { useHistory } from 'react-router-dom';
//import firebase from 'firebase/app';
//import 'firebase/auth';
import PlacesAutocomplete, { Suggestion } from 'react-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '../../constants/apiKeys';

const NewColony: React.FC = () => {
    const history = useHistory();
    const [colonyName, setColonyName] = useState('');
    const [location, setLocation] = useState('');
    const [catsNumber, setNumberOfCats] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!window.google) {
            // Aquí se puede cargar el script si aún no está cargado
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }, []);

    const handleNextStep = async () => {
        try {
            setLoading(true);
            history.push(`/register-cats`);
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        console.log('navigated to home page');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/profile" />
                    </IonButtons>
                    <IonTitle className="app-title">Register a new colony</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="register-colony-container">
                <div className="register-colony-form">
                    <h1>Name of the colony</h1>
                    <IonInput type="text" placeholder="Name of the colony" value={colonyName} onIonChange={(e) => setColonyName(e.detail.value!)} className="input-field" />
                    <h1>Location</h1>
                    <IonInput type="text" placeholder="Insert the location" value={location} onIonChange={(e) => setLocation(e.detail.value!)} className="input-field" />
                    {/* <PlacesAutocomplete
                        value={location}
                        onChange={setLocation}
                        onSelect={setLocation}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                            <div>
                                <IonInput
                                    {...getInputProps({ placeholder: 'Search for a location' })}
                                />
                                <div>
                                    {suggestions.map((suggestion: Suggestion) => (
                                        <div
                                            {...getSuggestionItemProps(suggestion)}
                                            key={suggestion.placeId}
                                        >
                                            {suggestion.description}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete> */}
                    <IonInput
                        type="number"
                        placeholder="Number of cats"
                        value={catsNumber}
                        onIonChange={(e) => setNumberOfCats(e.detail.value!)}
                        className="input-field"
                    />
                    <div className="button-container">
                        <IonButton expand="full" shape="round" className="register-colony-button" onClick={handleNextStep}>
                            Next step
                        </IonButton>
                    </div>
                    <IonLoading isOpen={loading} message={'Registering...'} />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default NewColony;
