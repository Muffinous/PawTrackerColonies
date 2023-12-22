import React, { useState, useEffect } from 'react';
import './Profile.css';
import { IonContent, IonPage, IonButton, IonToolbar, IonHeader, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import ColoniesPopup from '../../components/ColoniesPopUp/ColoniesPopup';
// @ts-ignore
import { getColoniesFromServer, saveColoniesToServer } from '@services/coloniesService';
import Colony from '../../types/Colony';
import { useHistory } from 'react-router-dom';

// Assuming getColoniesFromServer returns an array of numbers
const Profile: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userColonies, setUserColonies] = useState<Colony[]>([]);
  const history = useHistory();

  useEffect(() => {
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  const handleSaveColonies = (selectedColonies: Colony[]) => {
    // Save the selected colonies to the server
    saveColoniesToServer(selectedColonies);

    // Update the state to reflect the changes
    setUserColonies(selectedColonies);
  };

  const handleColonySelection = (colony: Colony) => {
    console.log(`Selected Colonies: ${JSON.stringify(colony)}`);
    // Navigate to the ReportFeeding page with the colony ID as a parameter
    history.push(`/report-feeding/${colony.id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="app-title">PawTracker (Colonies version)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="home-container">
        <div className="header">
          <img src={pawLogo} alt="Cat Logo" className="logo" />
          <h1>Profile</h1>
        </div>
        <div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
