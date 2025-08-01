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
import { saveColoniesToServer } from '../../services/coloniesService';
import Colony from '../../models/Colony';
import { useUser } from '../contexts/UserContextType';
import ColonyService from '../../services/colony.service';
import UserColony from '../../models/UserColony';

interface ColoniesPopupProps {
  isOpen: boolean;
  userColonies: UserColony[];
  onClose: () => void;
  onSave: (selectedColonies: Colony[]) => void;
}

const ColoniesPopup: React.FC<ColoniesPopupProps> = ({ isOpen, userColonies, onClose, onSave, }) => {
  const [selectedColonies, setSelectedColonies] = useState<Colony[]>([]);
  const [coloniesData, setColoniesData] = useState<Colony[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.uid) return;

    const activeColonies = userColonies.map((uc) => ({
      id: uc.colonyId,
      name: uc.name,
      cats: uc.cats,
      totalCats: uc.cats.length,
      location: uc.location
    }));
    setSelectedColonies(activeColonies);

    const fetchColonies = async () => {
      try {
        // Fetch colonies from the server
        const allColoniesData = await fetchAllColonyData();
        console.log("allColoniesData ", allColoniesData)
        if (allColoniesData)
          setColoniesData(allColoniesData);

      } catch (error) {
        console.error('Error fetching colonies:', error);
      }
    };

    if (isOpen) {
      fetchColonies();
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("🟢 selectedColonies updated", selectedColonies);
    console.log("USER COLONIES", userColonies)

  }, [selectedColonies]);

  const fetchAllColonyData = async () => {

    try {
      const coloniesData = await ColonyService.getColonies();
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
    if (!user || !user.uid) {
      console.error('User data is not available.');
      return;
    }

    const originalIds = userColonies.map((uc) => uc.colonyId).sort();
    const selectedIds = selectedColonies.map((c) => c.id).sort();

    const arraysAreEqual = (a: string[], b: string[]) => {
      if (a.length !== b.length) return false;
      return a.every((val, index) => val === b[index]);
    };

    if (!arraysAreEqual(originalIds, selectedIds)) {
      // Hay cambios: actualiza
      await ColonyService.updateUserColonies(selectedColonies, user.uid);
      onSave(selectedColonies);
    } else {
      console.log("No changes detected. Skipping backend call.");
    }

    onClose();
  };


  const handleColonySelection = (colony: Colony) => {
    console.log("colony ", colony)
    console.log("selectedColonies 1 ", selectedColonies)
    // Toggle selection
    setSelectedColonies((prevSelectedColonies) => {
      if (prevSelectedColonies.some((c) => c.id === colony.id)) {
        // Colony is already selected, remove it
        console.log("ADD")
        return prevSelectedColonies.filter((c) => c.id !== colony.id);
      } else {
        console.log("REMOVE")
        // Colony is not selected, add it
        return [...prevSelectedColonies, colony];
      }
    });
    console.log("selectedColonies 2 ", selectedColonies)
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
              backgroundColor: selectedColonies.some((selected) => selected.id === colony.id)
                ? 'var(--ion-color-secondary)'
                : 'inherit',
            }}
          >
            <IonCardHeader>
              <IonCardTitle>{colony.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {/* You can add more details or customize the card content */}
              <p>Location: {colony.location?.address} </p>
              <p>Nº Cats: {colony.cats.length} </p>
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
