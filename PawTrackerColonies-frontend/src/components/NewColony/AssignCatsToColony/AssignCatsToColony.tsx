import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cat } from '../../../models/Cat';
import Colony from '../../../models/Colony';
import { getCatImage, getCats } from '../../../services/cat.service';
import { useHistory, useLocation } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonIcon } from '@ionic/react';
import './AssignCatsToColony.css';
import CatCard from '../../CatCard/CatCard';
import { arrowBack, arrowForward, eyeOutline } from 'ionicons/icons';

const AssignCatsToColony: React.FC = () => {
    const [colonies, setColonies] = useState<Colony[]>([]);
    const [cats, setCats] = useState<Cat[]>([]);
    const [selectedColony, setSelectedColony] = useState<Colony | null>(null);
    const [selectedCats, setSelectedCats] = useState<Cat[]>([]);
    const [message, setMessage] = useState<string>('');
    const [imgSrc, setImgSrc] = useState('');

    const location = useLocation<{ colony?: Colony }>();
    const colony = location.state?.colony;
    const history = useHistory();

    useEffect(() => {
        console.log('Colony from state:', colony);
        setSelectedColony(colony || null)
        const fetchCats = async () => {
            console.log('Colony from state:', colony);
            const cats = await getCats();
            setCats(cats);
            console.log('Cats fetched:', cats);
        };
        fetchCats();
    }, []);

    const handleAssign = async () => {
        console.log('Selected colony:', selectedColony);
        if (!selectedColony || selectedCats.length === 0) {
            setMessage('Please select a colony and at least one cat.');
            return;
        }
        try {
            history.replace('/review-colony', { colony: selectedColony, cats: selectedCats });
            setMessage('Cats assigned successfully!');
        } catch {
            setMessage('Error assigning cats.');
        }
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.replace('/new-colony', { colony })}>
                            <IonIcon slot="icon-only" icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="app-title">Register a new colony</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.push('/review-colony', { colony: colony, cats: selectedCats })}>
                            <IonIcon slot="icon-only" icon={arrowForward} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="register-colony-container">
                <div className="register-colony-form">
                    <h2>Assign Cats to Colony</h2>
                    {colony && (
                        <div className="colony-card">
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>Name: {colony.name}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <div><strong>Location:</strong> {colony?.location?.address}</div>
                                    <div className="label-container">
                                        <IonLabel className="status-label">
                                            Number of cats: {colony?.totalCats || 0}
                                        </IonLabel>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </div>
                    )}

                    <div>
                        <label className="cat-cards-label">Select the cats that are in the colony:</label>
                        <div className="cat-cards-asssign">
                            {cats.map(cat => (
                                cat.id && (
                                    <CatCard
                                        key={cat.id}
                                        cat={cat}
                                        checked={selectedCats.some(selectedCat => selectedCat.id === cat.id)}
                                        onChange={checked => {
                                            if (checked) {
                                                setSelectedCats([...selectedCats, cat]);
                                            } else {
                                                setSelectedCats(selectedCats.filter(selectedCat => selectedCat.id !== cat.id));
                                            }
                                        }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                    <div className="button-container">
                        <IonButton expand="full" shape="round" className="register-colony-button" onClick={handleAssign}>
                            Next step
                        </IonButton>
                    </div>
                    {message && <div>{message}</div>}
                </div>
            </IonContent>
        </IonPage >
    );
};

export default AssignCatsToColony;