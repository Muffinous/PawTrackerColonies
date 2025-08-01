import { IonModal, IonText, IonButton } from '@ionic/react';
import './ConfirmPopup.css';

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ isOpen, message, onConfirm, onCancel }) => (
    <IonModal className='confirm-popup' isOpen={isOpen} onDidDismiss={onCancel} backdropDismiss={true}>
        <div style={{ padding: '24px', textAlign: 'center' }}>
            <IonText color="dark">
                <h2>{message}</h2>
            </IonText>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <IonButton color="danger" onClick={onConfirm}>Yes</IonButton>
                <IonButton onClick={onCancel}>No</IonButton>
            </div>
        </div>
    </IonModal>
);

export default ConfirmPopup;