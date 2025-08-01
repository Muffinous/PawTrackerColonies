import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import Colony from '../../models/Colony';
import { Cat } from '../../models/Cat';
import ColonyService from '../../services/colony.service';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonModal, IonAlert } from '@ionic/react';
import { arrowBack, arrowForward, checkmarkDone, trash } from 'ionicons/icons';
import { getCatImage } from '../../services/cat.service';
import catPlaceholderImage from '../../assets/placeholders/cat-placeholder.png';
import ConfirmPopup from '../../components/ConfirmPopup/ConfirmPopup';
import CustomAlert from '../../components/customAlert/CustomAlert';

const ColonyReviewPage: React.FC = () => {
    const location = useLocation<{ colony: Colony, cats: Cat[] }>();
    const { colony, cats } = location.state || {};
    const history = useHistory();
    const [selectedCats, setSelectedCats] = useState<Cat[]>([]);
    const [catImages, setCatImages] = useState<{ [id: string]: string }>({});
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState<string>('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [catToDelete, setCatToDelete] = useState<Cat | null>(null);
    const [showConfirmNumber, setShowConfirmNumber] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        console.log('Colony from state:', colony);
        console.log('Cats from state:', cats);
        setSelectedCats(cats);
        const fetchImages = async () => {
            const images: { [id: string]: string } = {};
            for (const cat of cats) {
                if (cat.id) {
                    const hasValidImg = cat.img !== undefined && cat.img !== null && cat.img !== '';
                    images[cat.id] = hasValidImg
                        ? await getCatImage(cat.img ?? '')
                        : catPlaceholderImage;
                }
            }
            setCatImages(images);
        };

        if (cats.length > 0) {
            fetchImages();
        }
    }, [cats]);

    const onSubmit = async () => {
        try {
            colony.cats = selectedCats;

            if (selectedCats.length > colony.totalCats) {
                colony.totalCats = selectedCats.length;
            } else if (selectedCats.length < colony.totalCats) {
                // Show confirmation popup
                setShowConfirmNumber(true); // You need a state for this popup
                return;
            }

            await registerColony(colony);

            // Redirect or show success message
        } catch (error) {
            console.error('Error submitting colony data:', error);
        }
    };

    // Helper function to register the colony
    const registerColony = async (colony: Colony) => {
        try {
            const response = await ColonyService.createColony(colony);
            console.log('Colony created successfully:', response);
            setShowAlert(true);
            // Redirect or show success message here
        } catch (error) {
            console.error('Error submitting colony data:', error);
        }
    };


    const handleDeleteClick = (cat: Cat) => {
        setCatToDelete(cat);
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (catToDelete) {
            setSelectedCats(prev => prev.filter(c => c.id !== catToDelete.id));
            setCatToDelete(null);
        }
        setShowConfirm(false);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    const handleAlertClose = () => {
        setShowAlert(false);
        history.push('/home');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.replace('/assign-cats-to-colony', { colony, cats })}>
                            <IonIcon slot="icon-only" icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="app-title">Register a new colony</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="register-colony-container">
                <div className="register-colony-form">
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

                    <div className="colony-card">
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Cats assigned in the colony</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                {selectedCats.length > 0 ? (
                                    selectedCats.map(cat => {
                                        const catId = typeof cat.id === 'string' && cat.id ? cat.id : `placeholder-${cat.name}`;
                                        return (
                                            <div key={catId} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                <img
                                                    src={catImages[catId] || catPlaceholderImage}
                                                    alt={cat.name}
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', marginRight: '12px', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setModalImage(catImages[catId] || catPlaceholderImage);
                                                        setShowModal(true);
                                                    }}
                                                />
                                                <strong style={{ flex: 1 }}>{cat.name}</strong>
                                                <IonButton
                                                    color="danger"
                                                    size="small"
                                                    onClick={() => handleDeleteClick(cat)}
                                                >
                                                    <IonIcon icon={trash} />
                                                </IonButton>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div>No cats selected.</div>
                                )}
                            </IonCardContent>
                        </IonCard>
                    </div>
                </div>
                <IonModal
                    isOpen={showModal}
                    onDidDismiss={() => setShowModal(false)}
                    backdropDismiss={true}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
                        <img src={modalImage} alt="Cat" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '8px' }} />
                        <IonButton onClick={() => setShowModal(false)} style={{ marginTop: '16px' }}>Close</IonButton>
                    </div>
                </IonModal>

                <ConfirmPopup
                    isOpen={showConfirm}
                    message={`Are you sure you want to remove ${catToDelete?.name} from the colony ${colony?.name}?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </IonContent>

            <div
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 100,
                }}
            >
                <IonButton
                    color="primary"
                    shape="round" className="register-colony-button"
                    style={{ maxWidth: '320px', width: '90%' }}
                    onClick={onSubmit}
                >
                    Register Colony
                </IonButton>
            </div>
            <IonAlert
                isOpen={showConfirmNumber}
                onDidDismiss={() => setShowConfirmNumber(false)}
                header="Update Number of Cats"
                message={`You have registered only ${selectedCats?.length} cats, but the estimated number is ${colony?.totalCats}. Is this correct?`}
                inputs={[
                    {
                        name: 'newTotalCats',
                        type: 'number',
                        placeholder: 'Approximate number of cats',
                        min: selectedCats?.length,
                        value: colony?.totalCats,
                    },
                ]}
                buttons={[
                    {
                        text: 'Update and register',
                        handler: async (data) => {
                            colony.totalCats = parseInt(data.newTotalCats, 10);
                            setShowConfirmNumber(false);
                            await registerColony(colony);
                        },
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => setShowConfirmNumber(false),
                    },

                ]}
            />
            {showAlert && (
                <CustomAlert
                    message="Cat registered!"
                    onClose={handleAlertClose}
                />
            )}
        </IonPage>

    )
};

export default ColonyReviewPage;
