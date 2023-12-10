import React from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface ColoniesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ColoniesPopup: React.FC<ColoniesPopupProps> = ({ isOpen, onClose }) => {
  const history = useHistory();

  const handlePopupClose = () => {
    // Close the popup
    onClose();
    // Navigate to the home page
    history.push('/home');

    // Print a message to the console
    console.log('Popup closed and navigated to home page');
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
      <IonContent>
        {/* Add your content here */}
        <p>This is the content of your popup.</p>
        <IonButton expand="full" onClick={handlePopupClose}>
          Close and Stay in Home
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default ColoniesPopup;
