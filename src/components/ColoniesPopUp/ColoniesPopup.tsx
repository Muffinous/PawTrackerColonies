import React, { useEffect, useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import './ColoniesPopup.css'
// @ts-ignore
import { getColoniesFromServer, saveColoniesToServer } from '../../services/coloniesService';
import Colony from '../../models/Colony';
import User from '../../models/User';
import { useUser } from '../contexts/UserContextType';
import ColonyService from '../../services/colony.service';

interface ColoniesPopupProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
  onSave: (selectedColonies: Colony[]) => void;
}

const ColoniesPopup: React.FC<ColoniesPopupProps> = ({ isOpen, userId, onClose, onSave, }) => {
  const [selectedColonies, setSelectedColonies] = useState<Colony[]>([]);
  const [coloniesData, setColoniesData] = useState<Colony[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.uid) return;

    const fetchColonies = async () => {
      try {
        // Fetch colonies from the server
        const allColoniesData = await fetchAllColonyData();
        console.log("allColoniesData ", allColoniesData)
        //setColoniesData(allColoniesData);
      } catch (error) {
        console.error('Error fetching colonies:', error);
      }
    };

    if (isOpen) {
      fetchColonies();
    }
  }, [isOpen]);


  const fetchAllColonyData = async () => {

    try {
      const coloniesData = await ColonyService.getColonies();
      console.log("coloniesData ", JSON.stringify(coloniesData))
      return coloniesData
    } catch (error) {
      console.error("Error fetching colony data:", error);
    }

  };

  const handlePopupClose = () => {

    // Close the popup
    onClose();

    // Print a message to the console
    console.log('Popup closed');
  };

  const handleSave = async () => {
    // Check if userData is defined before calling userData.id
    if (user && user.uid) {
      await saveColoniesToServer(selectedColonies, user.uid);
    } else {
      console.error('User data is not available.');
      // You might want to handle this case appropriately, e.g., show an error message.
      return;
    }
    onSave(selectedColonies);
    // Close the popup
    onClose();
  };

  const handleColonySelection = (colony: Colony) => {
    // Toggle selection
    setSelectedColonies((prevSelectedColonies) => {
      if (prevSelectedColonies.some((c) => c.id === colony.id)) {
        // Colony is already selected, remove it
        return prevSelectedColonies.filter((c) => c.id !== colony.id);
      } else {
        // Colony is not selected, add it
        return [...prevSelectedColonies, colony];
      }
    });
  };


  return (
    <IonModal isOpen={isOpen} onDidDismiss={handlePopupClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Choose the Colonies You Feed</IonTitle>
          <IonButton slot="end" onClick={onClose}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="colonies-popup-content">
        {/* Render the list of colonies */}
        {coloniesData.map((colony) => (
          <IonCard
            key={colony.id} // Add this key prop
            onClick={() => handleColonySelection(colony)}
            style={{
              backgroundColor: selectedColonies.includes(colony)
                ? 'var(--ion-color-secondary)'
                : 'inherit',
            }}
          >
            <IonCardHeader>
              <IonCardTitle>{colony.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {/* You can add more details or customize the card content */}
              <p>Description or additional information about the colony.</p>
            </IonCardContent>
          </IonCard>
        ))}
        <div className="button-container">
          <IonButton
            shape="round"
            expand="full"
            onClick={handleSave}
            className="save-colonies-button"
          >
            Save colonies
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ColoniesPopup;
