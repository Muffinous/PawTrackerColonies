import React, { useState, useEffect } from 'react';
import './Home.css';
import { IonContent, IonPage, IonButton, IonToolbar, IonHeader, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import ColoniesPopup from '../../components/ColoniesPopUp/ColoniesPopup';
// @ts-ignore
import { getColoniesFromServer, saveColoniesToServer } from '../../services/coloniesService';
import Colony from '../../types/Colony';
import { useHistory } from 'react-router-dom';

// Assuming getColoniesFromServer returns an array of numbers
const Home: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userColonies, setUserColonies] = useState<Colony[]>([]);
  const history = useHistory();

  useEffect(() => {
    setIsPopupOpen(true);
    // Fetch user colonies from the server when the component mounts
    const fetchUserColonies = async () => {
      try {
        const colonies = await getColoniesFromServer(); // Assuming this function returns an array of colony IDs
        setUserColonies(colonies);
      } catch (error) {
        console.error('Error fetching user colonies:', error);
      }
    };
    fetchUserColonies();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  const openPopup = () => {
    setIsPopupOpen(true);
  };

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
          <IonTitle className="app-title">Your App Name</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="login-container">
        <div className="login-form">
          <img src={pawLogo} alt="Cat Logo" className="logo" />
          <h1>Home</h1>
        </div>
        <div>
          {Array.isArray(userColonies) && userColonies.length > 0 ? (
            <>
              <h2 className="custom-title">Colonies you currently feed</h2>
              {/* Render the list of colonies as cards */}
              {userColonies.map((colony) => (
                <IonCard key={colony.id}>
                  <IonCardHeader>
                    <IonCardTitle>{colony.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {/* You can add more details or customize the card content */}
                    <p>Description or additional information about the colony.</p>
                    <IonButton
                      expand="full"
                      onClick={() => handleColonySelection(colony)}
                    >
                      Report Feeding
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </>
          ) : (
            <p>No colonies currently selected.</p>
          )}
          <div className="button-container">
            <IonButton className="select-colonies-btn" expand="full" onClick={openPopup}>
              Select your colonies
            </IonButton>
          </div>
        </div>
        {isPopupOpen && <ColoniesPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} onSave={handleSaveColonies} />}
      </IonContent>
    </IonPage>
  );
};

export default Home;
