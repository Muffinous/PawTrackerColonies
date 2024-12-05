// EditProfile.tsx

import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonLabel, IonBackButton, IonButtons, IonText, IonActionSheet } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './EditProfile.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import User from '../../../types/User';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const EditProfile: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null); // State to store the selected profile photo
    const [showActionSheet, setShowActionSheet] = useState(false); // State to control the visibility of the action sheet

    const [userData, setUserData] = useState<{ id: string; data: User } | null>(null);
    const history = useHistory();

    useEffect(() => {
        let isMounted = true;
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);

                if (parsedUser) {
                    const storage = getStorage();
                    try {
                        if (parsedUser.userData.profilePicture !== '') {
                            // Create a reference to the user's profile picture
                            const imageRef = ref(storage, parsedUser.userData.profilePicture);
                            // Get the download URL for the profile picture
                            const imageURL = await getDownloadURL(imageRef);
                            // Update the user's profile picture URL
                            parsedUser.userData.profilePicture = imageURL;
                        } else {
                            parsedUser.userData.profilePicture = 'src/assets/placeholders/user-placeholder.png';
                        }
                    } catch (error) {
                        console.error('Error fetching download URL:', error);
                        // Handle the error, e.g., display a placeholder image
                        parsedUser.userData.profilePicture = 'src/assets/placeholders/user-placeholder.png';
                    }
                } else {
                    // If the user is not authenticated, display a placeholder image
                    parsedUser.userData.profilePicture = 'src/assets/placeholders/user-placeholder.png';
                }

                // Update user data state
                setUserData({ id: parsedUser.id, data: parsedUser.userData });
            }
        });

        // Cleanup the subscription when the component unmounts
        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);


    useEffect(() => {
        if (userData !== null) {
            setName(userData.data.name);
            setEmail(userData.data.email);
            setUsername(userData.data.username);
        }
    }, [userData]);

    const handleSubmit = () => {
        // Implement logic to update user's profile data
        // For example, you can use an API call to update the data on the server

        // After updating the data, redirect the user to the profile page
        history.push('/profile');
    };

    // Function to handle file input change
    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setProfilePhoto(files[0]);
        }
    };

    // Function to handle clicking on the profile photo
    const handleProfilePhotoClick = () => {
        // Trigger input file click when clicking on the profile photo
        const fileInput = document.getElementById('profile-photo-input');
        if (fileInput) {
            fileInput.click();
        }
    };

    // Function to handle taking a photo
    const takePhoto = () => {
        console.log("Taking photo...")
    };

    // Function to handle selecting from library
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

                <div className="edit-profile-form">
                    <IonText>
                        <p>Edit your profile information.</p>
                    </IonText>
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
                            placeholder={userData?.data.name}
                            onIonChange={(e) => setName(e.detail.value!)}
                        />
                    </div>
                    <div className="input-field-container">
                        <IonLabel>Email</IonLabel>
                        <IonInput
                            type="text"
                            value={email}
                            placeholder={userData?.data.email}
                            onIonChange={(e) => setEmail(e.detail.value!)}
                        />
                    </div>
                    <div className="input-field-container">
                        <IonLabel>Username</IonLabel>
                        <IonInput
                            type="text"
                            value={username}
                            placeholder={userData?.data.username}
                            onIonChange={(e) => setUsername(e.detail.value!)}
                        />
                    </div>
                    <IonButton expand="block" onClick={handleSubmit}>Save Changes</IonButton>
                </div>
            </IonContent>
        </IonPage >
    );
};

export default EditProfile;
