// ReportFeeding.tsx
import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonModal,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { close } from 'ionicons/icons';
import CatSwiper from '../../services/CatSwiper'; // Adjust the import path based on your project structure
import './ReportFeeding.css';

interface ReportFeedingProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportFeeding: React.FC<ReportFeedingProps> = ({ isOpen, onClose }) => {
  const { colonyId } = useParams<{ colonyId: string }>();
  const history = useHistory();

  const cats = [
    { id: 1, image: 'assets/pawlogo.png', name: 'teo' },
    { id: 2, image: 'assets/pawlogo.png', name: 'perla' },
    { id: 3, image: 'assets/pawlogo.png', name: 'KITTINA' },
  ];

  const handlePopupClose = () => {
    // Close the modal
    history.goBack(); // This assumes you want to go back to the previous page

    // Print a message to the console
    console.log('Popup closed');
  };

  const handleSwipe = (direction: string, currentIndex: number) => {
    // Handle swipe direction (you can customize this logic)
    if (direction === 'right') {
      console.log(`Swiped right on cat ${currentIndex + 1}`);
    } else if (direction === 'left') {
      console.log(`Swiped left on cat ${currentIndex + 1}`);
    }
  };

  return (
    <IonModal isOpen={true} onDidDismiss={handlePopupClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Report for Colony [NAME]</IonTitle>
          <IonButton slot="end" onClick={handlePopupClose}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="report-container">
        <div className="report-form">
          <CatSwiper cats={cats} onSwipe={handleSwipe} />
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ReportFeeding;
