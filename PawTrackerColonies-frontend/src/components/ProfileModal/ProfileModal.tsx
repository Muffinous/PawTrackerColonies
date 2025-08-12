import React, { useEffect, useState } from 'react';
import { IonModal, IonCard, IonCardHeader, IonCardContent, IonButton, IonHeader, IonTitle, IonToolbar, IonIcon, IonContent } from '@ionic/react';
import { callOutline, close, mailOutline } from 'ionicons/icons';
import userPlaceholderImage from '../../assets/placeholders/user-placeholder.png';
import './ProfileModal.css';
import UserFeedingScheduleService from '../../services/userFeeding.service';
import { UserFeedingScheduleResponse } from '../../models/UserFeedingScheduleResponse';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        uid: string;
        name: string;
        lastname?: string;
        profileImg?: string;
        date?: string;
        colony?: string;
        email?: string;
        phoneNumber?: string;
    } | null;
}

const capitalize = (str?: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
    const [feedingData, setFeedingData] = useState<UserFeedingScheduleResponse | null>(null);

    useEffect(() => {
        console.log("User Colonies:", user);
        const fetchFeedingData = async () => {
            if (!user) return;
            try {
                const data = await UserFeedingScheduleService.getAllUserFeedingSchedules(user.uid);
                setFeedingData(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFeedingData();
    }, [user]);


    return (
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
                                            <p className="feeder-name">
                                                {capitalize(user?.name)} {capitalize(user?.lastname)}
                                            </p>
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

                <IonCard key={2} className="report-card-user">
                    <IonCardHeader>
                        <div className="summary-title">
                            <h6> - Feeding Schedule - </h6>
                        </div>
                    </IonCardHeader>
                    <IonCardContent>
                        {feedingData && feedingData.colonies && feedingData.colonies.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {feedingData.colonies?.map((schedule, idx) => (
                                    <div key={idx} style={{ textAlign: 'center' }}>
                                        <div
                                            style={{
                                                display: 'inline-block',
                                                padding: '6px 14px',
                                                borderRadius: 16,
                                                background: 'var(--ion-color-secondary)',
                                                color: 'var(--ion-color-primary)',
                                                fontWeight: 'bold',
                                                fontSize: 14,
                                                marginBottom: 2,
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                                            }}
                                        >
                                            {schedule.dayOfWeek ? schedule.dayOfWeek.charAt(0).toUpperCase() + schedule.dayOfWeek.slice(1).toLowerCase() : 'Unknown'}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#888' }}>
                                            {schedule.colony?.name ? `${schedule.colony.name}` : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#888' }}>No feeding days registered.</p>
                        )}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonModal>
    );
};

export default ProfileModal;