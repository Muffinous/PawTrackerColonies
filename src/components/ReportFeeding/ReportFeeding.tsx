import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonModal,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { close } from 'ionicons/icons';
import CatSwiper from '../../services/CatSwiper'
import './ReportFeeding.css';

interface ReportFeedingProps {
  isOpen: boolean;
  onClose: () => void;
  onEnd: () => void;
}

const ReportFeeding: React.FC<ReportFeedingProps> = ({isOpen, onClose, onEnd}) => {
  const { colonyId } = useParams<{ colonyId: string }>();
  const history = useHistory();
  const cats = [
    { id: 1, image: 'assets/pawlogo.png', name: 'teo' },
    { id: 2, image: 'assets/pawlogo.png', name: 'perla'},
    { id: 3, image: 'assets/pawlogo.png', name: 'perla'},
  ];

  const handlePopupClose = () => {
    // Close the modal
    history.goBack(); // This assumes you want to go back to the previous page

    // Print a message to the console
    console.log("Popup closed");
  };

  const handleSwipe = (currentIndex: number, isRight: boolean) => {
    // Handle swipe action (e.g., update cat status in the backend)
    console.log(`Cat ${cats[currentIndex].id} was swiped to the ${isRight ? 'right' : 'left'}.`);
  };  

  const handleEndSwipe = () => {
    // Handle the end of swiping (if needed)
    console.log("Swiping ended");
    onEnd();
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
          <div>
            <h1>Report Feeding Page for Colony ID: {colonyId}</h1>
            {/* You can add your report feeding form or content here */}
          </div>
          <CatSwiper cats={cats} onSwipe={handleSwipe} onEnd={handleEndSwipe}/>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ReportFeeding;
