// ReportFeeding.tsx
import React, { useEffect, useState } from 'react';
import {
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
import CatSwiper from '../CatSwiper/CatSwiper'; // Adjust the import path based on your project structure
import './ReportFeeding.css';
import ColonyService from '../../services/colony.service';

interface ReportFeedingProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportFeeding: React.FC<ReportFeedingProps> = ({ isOpen, onClose }) => {
  const { colonyId } = useParams<{ colonyId: string }>();
  const history = useHistory();
  const [colony, setColony] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColony = async () => {
      setLoading(true);
      try {
        const data = await ColonyService.getColonyById(colonyId);
        console.log("Colony data fetched: ", data);
        setColony(data);
      } catch (error) {
        console.error('Error fetching colony:', error);
      } finally {
        setLoading(false);
      }
    };

    if (colonyId) {
      fetchColony();
    }
  }, [colonyId]);

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
          <IonTitle>
            Report for Colony {colony ? colony.name : ''}
          </IonTitle>          
          <IonButton slot="end" onClick={handlePopupClose}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="report-container">
        <div className="report-form">
          <CatSwiper colonyId={colonyId} onClose={handlePopupClose}/>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ReportFeeding;
