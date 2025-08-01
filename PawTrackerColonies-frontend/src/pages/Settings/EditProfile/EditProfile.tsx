// EditProfile.tsx

import React, { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonLabel, IonBackButton, IonButtons, IonText, IonActionSheet } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './EditProfile.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useUser } from '../../../components/contexts/UserContextType';
import UserService from '../../../services/user.service';

const EditProfile: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [telephone, setPhoneNumber] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null); // State to store the selected profile photo
    const [showActionSheet, setShowActionSheet] = useState(false); // State to control the visibility of the action sheet
    const { user, setUser } = useUser();
    const history = useHistory();
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        username: '',
        telephone: ''
    });

    const nameRef = useRef<HTMLIonInputElement>(null);
    const emailRef = useRef<HTMLIonInputElement>(null);
    const usernameRef = useRef<HTMLIonInputElement>(null);
    const telephoneRef = useRef<HTMLIonInputElement>(null);

    useEffect(() => {
        if (!user?.uid) return;
        setName(user.name ?? '');
        setEmail(user.email ?? '');
        setUsername(user.username ?? '');
        setPhoneNumber(user.phoneNumber ?? '');
    }, []);


    const handleSubmit = async () => {
        console.log('handleSubmit, telephone:', telephone);

        const currentName = nameRef.current?.value?.toString() ?? name;
        const currentEmail = emailRef.current?.value?.toString() ?? email;
        const currentUsername = usernameRef.current?.value?.toString() ?? username;
        const currentTelephone = telephoneRef.current?.value?.toString() ?? telephone;


        const { isValid, newErrors } = await validateForm();
        setErrors(newErrors);
        if (!isValid || !user?.uid) return;

        // Crea el objeto de cambios
        const updates: Partial<typeof user> & { uid: string } = { uid: user.uid };

        console.log("telephone", telephone, "user.phoneNumber", user.phoneNumber)
        if (currentName !== user.name) updates.name = currentName;
        if (currentEmail !== user.email) updates.email = currentEmail;
        if (currentUsername !== user.username) updates.username = currentUsername;
        if (currentTelephone !== user.phoneNumber) updates.phoneNumber = currentTelephone;

        // profilePhoto aquí se trataría aparte (no lo estás enviando aún)

        console.log("updates", updates);
        console.log({
            name,
            userName: user.name,
            email,
            userEmail: user.email,
            username,
            userUsername: user.username,
            telephone,
            userPhoneNumber: user.phoneNumber,
            'updates keys length': Object.keys(updates).length
        });


        if (Object.keys(updates).length === 1) { // Solo tiene uid
            console.log("No changes detected");
            return;
        }

        try {
            const updatedUser = await UserService.updateUser(updates);
            console.log("Updated user", updatedUser);
            setUser(updatedUser);
            // Opcional: redirigir
            // history.push('/profile');
        } catch (error) {
            console.error("Update failed", error);
        }
    };



    // Function to handle taking a photo
    const takePhoto = () => {
        console.log("Taking photo...")
    };

    // Function to handle selecting from library
    const selectFromLibrary = async () => {
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

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            email: '',
            username: '',
            telephone: ''
        };

        if (!name || name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters long.';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            newErrors.email = 'Invalid email address.';
            isValid = false;
        }

        if (!username || username.includes(' ')) {
            newErrors.username = 'Username is required and cannot contain spaces.';
            isValid = false;
        }

        const phoneRegex = /^\+?\d{7,15}$/;
        if (telephone && !phoneRegex.test(telephone)) {
            newErrors.telephone = 'Phone number is not valid.';
            isValid = false;
        }
        console.log("isValid", isValid, "newErrors", newErrors);
        return { isValid, newErrors };
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/profile" />
                    </IonButtons>
                    <IonTitle className="app-title">Edit Profile</IonTitle>

                </IonToolbar>
            </IonHeader>
            <IonContent className="edit-profile-container">
                <form
                    className="edit-profile-form"
                    onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div className="edit-profile-form">
                        <div className="photo-field-container" style={{ justifyContent: "center" }}>
                            <label htmlFor="profilePhotoInput">
                                <img
                                    style={{ width: "65px", height: "65px", marginBottom: "10px", borderRadius: "50%", objectFit: "cover" }}
                                    src={profilePhoto ? URL.createObjectURL(profilePhoto) : 'src/assets/placeholders/user-placeholder.png'}
                                    alt="Profile image"
                                    className="profileImg"
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
                                            selectFromLibrary()
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

                        <div className="input-field-container">
                            <IonLabel>Name</IonLabel>
                            <IonInput
                                type="text"
                                value={name}
                                placeholder={user?.name}
                                ref={nameRef}
                                onIonChange={(e) => setName(e.detail.value!)}
                            />
                        </div>
                        <div>
                            {errors.name && (
                                <IonText color="danger">
                                    <p style={{ margin: 0, fontSize: '0.8rem' }}>{errors.name}</p>
                                </IonText>
                            )}
                        </div>
                        <div className="input-field-container">
                            <IonLabel>Email</IonLabel>
                            <IonInput
                                type="text"
                                value={email}
                                placeholder={user?.email}
                                ref={emailRef}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                            />
                            {errors.email && <IonText color="danger"><p>{errors.email}</p></IonText>}
                        </div>
                        <div className="input-field-container">
                            <IonLabel>Username</IonLabel>
                            <IonInput
                                type="text"
                                value={username}
                                placeholder={user?.username}
                                ref={usernameRef}
                                onIonChange={(e) => setUsername(e.detail.value!)}
                            />
                            {errors.username && <IonText color="danger"><p>{errors.username}</p></IonText>}

                        </div>
                        <div className="input-field-container">
                            <IonLabel>Telephone</IonLabel>
                            <IonInput
                                type="text"
                                value={telephone}
                                placeholder={user?.phoneNumber}
                                ref={telephoneRef}
                                onIonChange={
                                    (e) => {
                                        setPhoneNumber(e.detail.value ?? '');
                                        console.log("e.detail.value", e.detail.value);
                                    }
                                }

                            />
                            {errors.telephone && <IonText color="danger"><p>{errors.telephone}</p></IonText>}
                        </div>
                        <IonButton expand="block" type="submit">Save Changes</IonButton>
                    </div>
                </form>
            </IonContent>
        </IonPage >
    );
};

export default EditProfile;
