import React, { useEffect, useState } from 'react';
import './RegisterCats.css'; // Archivo CSS para estilos
import { IonInput, IonButton, IonContent, IonPage, IonHeader, IonTitle, IonToolbar, IonLoading, IonButtons, IonBackButton, IonSelect, IonSelectOption, IonTextarea, IonActionSheet, IonLabel, IonItem, IonIcon } from '@ionic/react';
import { Cat } from '../../../models/Cat';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { createCats } from '../../../services/cat.service';
import { chevronDownOutline, chevronForwardOutline, trash } from 'ionicons/icons';
import ColonyService from '../../../services/colony.service';
import { useHistory } from 'react-router-dom';
import CustomAlert from '../../customAlert/CustomAlert';

const RegisterCats: React.FC = () => {
    const history = useHistory();

    const [isDarkMode, setIsDarkMode] = useState(
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    const initialCat: Cat = {
        id: null,
        img: '',
        name: '',
        furColor: null,
        spayedNeutered: null,
        approximateAge: null,
        gender: null,
        observations: null,
    };


    const [cats, setCats] = useState<Cat[]>([initialCat]);
    const [errors, setErrors] = useState<Array<{ name?: string; furColor?: string, colonies?: string }>>(
        cats.map(() => ({ name: '', furColor: '', colonies: '' }))
    );
    const [colonies, setColonies] = useState<{ id: string; name: string; location: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [openCards, setOpenCards] = useState<number[]>([]);
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const loadColonies = async () => {
            try {
                const coloniesData = await ColonyService.getColonies();
                setColonies(
                    coloniesData.map(colony => ({
                        id: colony.id,
                        name: colony.name,
                        location: colony.location.address || '',
                    }))
                );
                console.log("colony", coloniesData.map(colony => colony.id));
            } catch (error) {
                console.error('Error fetching colonies:', error);
            }
        };

        loadColonies();
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handler = (event: MediaQueryListEvent) => {
            setIsDarkMode(event.matches);
        };

        mediaQuery.addEventListener('change', handler);

        // Cleanup al desmontar
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const toggleCard = (index: number) => {
        setOpenCards((prevOpenCards) =>
            prevOpenCards.includes(index)
                ? prevOpenCards.filter((i) => i !== index) // Cierra si ya está abierta
                : [...prevOpenCards, index] // Abre si está cerrada
        );
    };

    const addCat = () => {
        setCats(prevCats => {
            const newCats = [...prevCats, { ...initialCat }];
            // Open only the last added card (new cat)
            setOpenCards([newCats.length - 1]);
            return newCats;
        });
    };


    const updateCat = (index: number, field: keyof Cat, value: any) => {
        setCats((prevCats) => {
            const updatedCats = [...prevCats];
            updatedCats[index] = {
                ...updatedCats[index],
                [field]: value,
            };
            return updatedCats;
        });
    };

    const handleSubmit = async () => {
        if (!validateCats()) {
            return;
        }
        setLoading(true);
        try {
            const formattedCats = cats.map(cat => ({
                ...cat,
                colonies: (cat.colonies ?? []).map(colony =>
                    typeof colony === "string" ? { id: colony } : colony
                )
            }));
            await createCats(formattedCats);
            setShowAlert(true);
        } catch (error) {
            console.error('Error registering cats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
        history.push('/home');
    };

    const validateCats = (): boolean => {
        let valid = true;
        const newErrors = cats.map((cat, i) => {
            const error: { name?: string; furColor?: string; colonies?: string } = {};
            if (!cat.name || cat.name.trim() === '') {
                error.name = `Name is required.`;
                valid = false;
            }
            if (!cat.furColor || cat.furColor.trim() === '') {
                error.furColor = `Fur color is required.`;
                valid = false;
            }
            if (!cat.colonies || cat.colonies.length === 0) {
                error.colonies = "At least one colony must be selected.";
                valid = false;
            }

            return error;
        });
        setErrors(newErrors);
        return valid;
    };


    // Function to handle taking a photo
    const takePhoto = () => {
        console.log("Taking photo...")
    };


    // Function to handle selecting from library
    const selectFromLibrary = async (index: number) => {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Uri,
                source: CameraSource.Photos // Open the device's image library to select a photo
            });

            // Check if the image object and webPath are defined
            if (image && image.webPath) {
                try {
                    console.log("image", image)
                    // Fetch the selected image as a Blob object
                    const response = await fetch(image.webPath);
                    const blob = await response.blob();

                    // Create a File object from the Blob
                    const file = new File([blob], 'profile_photo.jpg', { type: blob.type });
                    updateCat(index, 'img', image.webPath);
                    // Update the profile photo state with the selected File object
                    console.log("file ", file)
                    setProfilePhoto(file);
                } catch (error) {
                    console.error('Error fetching image as Blob:', error);
                }
            } else {
                console.error('Error: Selected image or webPath is undefined.');
            }
        } catch (error) {
            console.error('Error selecting from library:', error);
        }
    };


    // Function to handle canceling the action
    const cancel = () => {
        // Hide the action sheet or handle any other cancellation logic
        setShowActionSheet(false);
    };

    // Add this function inside your RegisterCats component
    const deleteCat = (index: number) => {
        setCats(prevCats => prevCats.filter((_, i) => i !== index));
        setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));
        setOpenCards(prevOpenCards => prevOpenCards.filter(i => i !== index));
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/new-colony" />
                    </IonButtons>
                    <IonTitle>Register Cats</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="register-cats-container">
                <div className="register-cats-form">
                    {cats.map((cat, index) => (
                        <div key={index} className="cat-card">
                            {/* Encabezado de la tarjeta */}
                            <div className="cat-card-header" onClick={() => toggleCard(index)}>
                                <h2>{cat.name || `Cat ${index + 1}`}</h2>
                                <IonButton size="small" fill="clear" color="dark">
                                    <IonIcon icon={openCards.includes(index) ? chevronDownOutline : chevronForwardOutline} />
                                </IonButton>
                            </div>
                            {/* Contenido de la tarjeta */}
                            {openCards.includes(index) && (
                                <div className="cat-card-body" style={{ backgroundColor: isDarkMode ? '#1e1e1e' : 'transparent' }}>
                                    <div className="photo-field-container" >
                                        <label htmlFor="profilePhotoInput">
                                            <img
                                                src={profilePhoto ? URL.createObjectURL(profilePhoto) : 'src/assets/placeholders/cat-placeholder.png'}
                                                alt="Profile image"
                                                className="cat-preview-image"
                                                onClick={() => setShowActionSheet(true)}
                                            />
                                        </label>
                                        <IonLabel>Edit photo</IonLabel>
                                        <IonActionSheet
                                            isOpen={showActionSheet}
                                            onDidDismiss={() => setShowActionSheet(false)}
                                            buttons={[
                                                {
                                                    text: 'Take Photo',
                                                    handler: () => {
                                                        takePhoto()
                                                    }
                                                },
                                                {
                                                    text: 'Select from Library',
                                                    handler: () => {
                                                        selectFromLibrary(index)
                                                    }
                                                },
                                                {
                                                    text: 'Cancel',
                                                    role: 'cancel',
                                                    handler: () => {
                                                        cancel()
                                                    }
                                                }
                                            ]}
                                        />
                                    </div>

                                    <IonInput
                                        type="text"
                                        value={cat.name}
                                        placeholder="Cat name"
                                        className="input-field"
                                        onIonChange={(e) => updateCat(index, 'name', e.detail.value || '')}
                                    />
                                    {errors[index]?.name && <div className="error-message">{errors[index].name}</div>}

                                    <IonInput
                                        type="text"
                                        value={cat.furColor ?? ''}
                                        placeholder="Fur Color"
                                        className="input-field"
                                        onIonChange={(e) => updateCat(index, 'furColor', e.detail.value || null)}
                                    />
                                    {errors[index]?.furColor && <div className="error-message">{errors[index].furColor}</div>}

                                    <IonItem className="select-field">
                                        <IonSelect
                                            label="Spayed/Neutered"
                                            value={cat.spayedNeutered}
                                            onIonChange={(e) => updateCat(index, 'spayedNeutered', e.detail.value || null)}
                                        >
                                            <IonSelectOption value={true}>Yes</IonSelectOption>
                                            <IonSelectOption value={false}>No</IonSelectOption>
                                            <IonSelectOption value={null}>Unknown</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>


                                    <IonInput
                                        type="number"
                                        value={cat.approximateAge ?? ''}
                                        placeholder="Approximate Age"
                                        className="input-field"
                                        onIonChange={(e) =>
                                            updateCat(
                                                index,
                                                'approximateAge',
                                                e.detail.value ? parseInt(e.detail.value, 10) : null
                                            )
                                        }
                                    />

                                    <IonItem className="select-field">
                                        <IonSelect
                                            label='Gender'
                                            value={cat.gender}
                                            onIonChange={(e) => updateCat(index, 'gender', e.detail.value || null)}

                                        >
                                            <IonSelectOption value="M">Male</IonSelectOption>
                                            <IonSelectOption value="F">Female</IonSelectOption>
                                            <IonSelectOption value="U">Unknown</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>

                                    <IonTextarea
                                        value={cat.observations ?? ''}
                                        placeholder="Observations"
                                        className="textarea-field"
                                        onIonChange={(e) => updateCat(index, 'observations', e.detail.value || null)}
                                    />

                                    <IonItem className="select-field">
                                        <IonSelect
                                            label='Assign Colonies'
                                            multiple={true}
                                            value={cat.colonies || []}
                                            placeholder="Select Colonies"
                                            onIonChange={e => updateCat(index, 'colonies', e.detail.value || null)}
                                        >
                                            {colonies.map(colony => (
                                                <IonSelectOption key={colony.id ?? `colony-${index}`} value={colony.id}>
                                                    {colony.name} - {colony.location}
                                                </IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                    {errors[index]?.colonies && <div className="error-message">{errors[index].colonies}</div>}

                                    {cats.length > 1 && (
                                        <IonButton
                                            color="danger"
                                            fill="outline"
                                            size="small"
                                            onClick={() => deleteCat(index)}
                                            className="delete-cat-button"
                                        >
                                            Delete
                                            <IonIcon icon={trash} slot="end" />
                                        </IonButton>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="button-container">
                        <IonButton expand="full" shape="round" className="register-cats-button" onClick={addCat}>
                            Add Another Cat
                        </IonButton>
                        <IonButton expand="full" shape="round" className="register-colony-button" onClick={handleSubmit}>
                            Submit
                        </IonButton>

                    </div>
                    {showAlert && (
                        <CustomAlert
                            message="Cat registered!"
                            onClose={handleAlertClose}
                        />
                    )}
                    <IonLoading isOpen={loading} message="Submitting..." />
                </div>
            </IonContent>
        </IonPage >
    );
};

export default RegisterCats;
