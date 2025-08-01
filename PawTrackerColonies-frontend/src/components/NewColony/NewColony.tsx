import React, { useEffect, useState } from 'react';
import './NewColony.css'; // Import the CSS file for styling
import { IonInput, IonButton, IonContent, IonPage, IonToolbar, IonHeader, IonTitle, IonLoading, IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import Colony from '../../models/Colony';
import LocationPicker from '../LocationPicker/LocationPicker';
import { ColonyLocation } from '../../models/Location';

const NewColony: React.FC = () => {
    const history = useHistory();
    const [colonyName, setColonyName] = useState('');
    const [totalCats, setTotalCats] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [errors, setErrors] = useState<{ colonyName?: string; location?: string }>({})
    const location = useLocation<{ colony?: Colony }>();

    const [colonyLocation, setColonyLocation] = useState<ColonyLocation | null>(null)


    const colony = location.state?.colony;

    useEffect(() => {
        // If colony is provided in the state, set the initial values
        if (colony) {
            if (colony.location) {
                const loc = colony.location as ColonyLocation;
                setColonyLocation(loc);
            }
            setColonyName(colony.name || '');
            setTotalCats(colony.totalCats || null);
        }
    }, [colony]);

    const validateForm = (): boolean => {
        const newErrors: { colonyName?: string; location?: string } = {};
        if (!colonyName.trim()) newErrors.colonyName = 'Colony name is required.';
        if (!colonyLocation) newErrors.location = 'Location is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = async () => {
        if (!validateForm()) return;

        try {

            console.log('Total cats :', totalCats);
            const createdColony = {
                name: colonyName,
                location: colonyLocation,
                totalCats: totalCats
            };

            console.log('Creating colony:', createdColony);
            history.replace('/assign-cats-to-colony', { colony: createdColony });
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

    const handleLocationSelected = (loc: ColonyLocation) => {
        if (!loc.address) {
            setColonyLocation(null);

            return;
        }
        setColonyLocation(loc);

    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" />
                    </IonButtons>
                    <IonTitle >Register a new colony</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="register-colony-container">
                <div className="register-colony-form">
                    <h1>Name of the colony</h1>
                    <IonInput
                        type="text"
                        placeholder="Name of the colony"
                        value={colonyName}
                        onIonInput={e => setColonyName(String(e.target.value ?? ""))}
                        className="input-field" />
                    {errors.colonyName && <div className="error-message">{errors.colonyName}</div>}


                    <h1>Location</h1>
                    <div style={{ width: '100%' }}>
                        <LocationPicker
                            onLocationSelected={handleLocationSelected}
                            initialLocation={colonyLocation} />
                    </div>


                    {colonyLocation && (
                        <IonCard className="location-details-card">
                            <IonCardHeader>
                                <IonCardTitle>Location details</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent className="report-feeding-content text-center">
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12">
                                            <b>Address: </b>
                                            <IonLabel className="ion-text-wrap">{colonyLocation?.address}</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="6">
                                            <b>Postal Code: </b>
                                            <IonLabel>{colonyLocation?.postalCode}</IonLabel>
                                        </IonCol>
                                        <IonCol size="6">
                                            <b>Country:</b>
                                            <IonLabel>{colonyLocation?.country}</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="6">
                                            <b>Latitude: </b>
                                            <IonLabel>{colonyLocation?.latitude ?? ''}</IonLabel>
                                        </IonCol>
                                        <IonCol size="6">
                                            <b>Longitude: </b>
                                            <IonLabel>{colonyLocation?.longitude ?? ''}</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {errors.location && <div className="error-message">{errors.location}</div>}

                    <IonInput
                        type="number"
                        placeholder="Number of cats approximately in the colony"
                        value={totalCats ?? ""}
                        onIonInput={e => {
                            const value = String(e.target.value ?? "");
                            setTotalCats(value === "" ? null : parseInt(value, 10));
                        }}
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
