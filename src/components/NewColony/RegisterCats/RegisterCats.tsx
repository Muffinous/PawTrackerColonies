import React, { useState } from 'react';
import './RegisterCats.css'; // Archivo CSS para estilos
import { IonInput, IonButton, IonContent, IonPage, IonHeader, IonTitle, IonToolbar, IonLoading, IonButtons, IonBackButton, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react';
import { Cat } from '../../../types/Cat';

const RegisterCats: React.FC = () => {
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
    const [loading, setLoading] = useState(false);
    const [openCards, setOpenCards] = useState<number[]>([]);


    const toggleCard = (index: number) => {
        setOpenCards((prevOpenCards) =>
            prevOpenCards.includes(index)
                ? prevOpenCards.filter((i) => i !== index) // Cierra si ya está abierta
                : [...prevOpenCards, index] // Abre si está cerrada
        );
    };

    const addCat = () => {
        setCats([...cats, { ...initialCat }]);
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
        try {
            setLoading(true);
            console.log('Cats data:', cats);
            // Lógica para guardar los datos de los gatos en la base de datos
        } catch (error) {
            console.error('Error registering cats:', error);
        } finally {
            setLoading(false);
        }
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
                                    {openCards.includes(index) ? 'Close' : 'Open'}
                                </IonButton>
                            </div>
                            {/* Contenido de la tarjeta */}
                            {openCards.includes(index) && (
                                <div className="cat-card-body">
                                    <IonInput
                                        type="text"
                                        value={cat.name}
                                        placeholder="Cat name"
                                        className="input-field"
                                        onIonChange={(e) => updateCat(index, 'name', e.detail.value || '')}
                                    />
                                    <IonInput
                                        type="text"
                                        value={cat.furColor ?? ''}
                                        placeholder="Fur Color"
                                        className="input-field"
                                        onIonChange={(e) => updateCat(index, 'furColor', e.detail.value || null)}
                                    />
                                    <IonSelect
                                        value={cat.spayedNeutered}
                                        placeholder="Spayed/Neutered"
                                        className="select-field"
                                        onIonChange={(e) =>
                                            updateCat(index, 'spayedNeutered', e.detail.value)
                                        }
                                    >
                                        <IonSelectOption value={true}>Yes</IonSelectOption>
                                        <IonSelectOption value={false}>No</IonSelectOption>
                                    </IonSelect>
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
                                    <IonSelect
                                        value={cat.gender}
                                        placeholder="Gender"
                                        className="select-field"
                                        onIonChange={(e) => updateCat(index, 'gender', e.detail.value)}
                                    >
                                        <IonSelectOption value="M">Male</IonSelectOption>
                                        <IonSelectOption value="F">Female</IonSelectOption>
                                    </IonSelect>
                                    <IonTextarea
                                        value={cat.observations ?? ''}
                                        placeholder="Observations"
                                        className="textarea-field"
                                        onIonChange={(e) => updateCat(index, 'observations', e.detail.value || null)}
                                    />
                                    <IonButton
                                        onClick={() => {
                                            console.log('Updated Cat:', cat);
                                        }}
                                    >
                                        Save
                                    </IonButton>
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
                    <IonLoading isOpen={loading} message="Submitting..." />
                </div>
            </IonContent>
        </IonPage >
    );
};

export default RegisterCats;
