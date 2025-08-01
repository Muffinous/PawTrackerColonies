import React from 'react';
import { IonModal, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonContent } from '@ionic/react';
import { callOutline, close, mailOutline } from 'ionicons/icons';
import userPlaceholderImage from '../../assets/placeholders/user-placeholder.png';
import './ProfileModal.css';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        name: string;
        lastname?: string;
        profileImg?: string;
        date?: string;
        colony?: string;
        email?: string;
        phoneNumber?: string;
    } | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => (

    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
            <IonToolbar>
                <IonTitle>
                </IonTitle>
                <IonButton slot="end" onClick={onClose}>
                    <IonIcon icon={close} />
                </IonButton>
            </IonToolbar>
        </IonHeader>
        <IonContent style={{ margin: 24 }}>

            <IonCard key={1} className="report-card-user">
                <IonCardHeader>
                    <div className="summary-title">
                        <h6> - Feeder - </h6>
                    </div>
                </IonCardHeader>
                <IonCardContent>
                    <div className="feeder-content">
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <div style={{ flex: 1 }}>
                                <div className="feeder-header">
                                    <div className="feeder-name-section">
                                        <div className="dot-line">&middot; &middot; &middot; &middot; &middot; &middot; &middot;</div>
                                        <p className="feeder-name">{user?.name} {user?.lastname}</p>
                                        <div className="dot-line">&middot; &middot; &middot; &middot; &middot; &middot; &middot;</div>
                                    </div>
                                </div>
                                <div className="feeder-info">
                                    <div className="feeder-contact">
                                        <IonIcon icon={mailOutline} className="contact-icon" />
                                        <a href={`mailto:${user?.email}`}>{user?.email}</a>
                                    </div>
                                    <div className="feeder-contact">
                                        <IonIcon icon={callOutline} className="contact-icon" />
                                        <a href={`tel:${user?.phoneNumber}`}>{user?.phoneNumber}</a>
                                    </div>
                                </div>
                            </div>
                            <div className="feeder-profile">
                                <img className="profile-picture" alt="Profile image" src={user?.profileImg || userPlaceholderImage} />
                            </div>
                        </div>
                    </div>
                </IonCardContent>
            </IonCard>
        </IonContent>
    </IonModal>
);

export default ProfileModal;