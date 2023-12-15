import React, { useState } from 'react';
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
import { saveColoniesToServer } from '../../services/coloniesService';
import Colony from '../../types/Colony';

interface ColoniesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedColonies: Colony[]) => void;
}

const coloniesData = [
  { id: 1, name: 'Colony A' },
  { id: 2, name: 'Colony B' },
  { id: 3, name: 'Colony C' },
  { id: 4, name: 'Colony D' },
];

const ColoniesPopup: React.FC<ColoniesPopupProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedColonies, setSelectedColonies] = useState<Colony[]>([]);

  const handlePopupClose = () => {
    saveColoniesToServer(selectedColonies);

    // Close the popup
    onClose();

    // Print a message to the console
    console.log('Popup closed');
  };

  const handleSave = () => {
    // Save colonies and call the callback
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
            key={colony.id}
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
