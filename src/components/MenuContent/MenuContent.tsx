import React, { useEffect, useRef, useState } from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButtons, IonMenuButton } from '@ionic/react';
import User from '../../types/User';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import './MenuContent.css';
import { useHistory } from 'react-router-dom';

const MenuContent: React.FC = () => {
    const [userData, setUserData] = useState<{ id: string; data: User } | null>(null);
    const history = useHistory();
    const menuRef = useRef<HTMLIonMenuElement>(null); // Ref to the IonMenu component

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
                            console.log("No hay foto")
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
            console.log("Final User Data MENU:", userData);
        }
    }, [userData]);

    const handleEditProfile = () => {
        // Redirect to the edit profile page
        history.push('/edit-profile');
        if (menuRef.current) {
            menuRef.current.close(); // Close the menu after navigating
        }
    };
    

    const handleNewColony = () => {
        // Redirect to the edit profile page
        history.push('/new-colony');
        if (menuRef.current) {
            menuRef.current.close(); // Close the menu after navigating
        }
    };

    return (
        <IonMenu side="end" contentId="main" ref={menuRef}>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* Display user data */}
                {userData && (
                    <div className="user-profile">
                        {/* Profile Photo */}
                        <img src={userData.data.profilePicture} alt="Profile" className="profile-photo" />
                        {/* Name */}
                        <div className="user-name">{userData.data.name}</div>
                        {/* Username */}
                        <div className="username">@{userData.data.username}</div>
                        {/* Email */}
                        <div className="user-email">{userData.data.email}</div>
                    </div>
                )}
                <IonList>
                    <IonItem onClick={handleEditProfile}>
                        <IonLabel>Edit Profile</IonLabel>
                    </IonItem>
                    <IonItem onClick={handleNewColony}>
                        <IonLabel>New Colony</IonLabel>
                    </IonItem>
                    {/* Add more menu items as needed */}
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default MenuContent;
