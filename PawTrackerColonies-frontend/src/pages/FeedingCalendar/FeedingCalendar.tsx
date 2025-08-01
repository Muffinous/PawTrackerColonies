import React, { useEffect, useState } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonIcon,
    IonButton, IonButtons
} from '@ionic/react';
import { personCircle, checkmarkCircle, closeCircle, arrowBack } from 'ionicons/icons';
import placeholderImage from '../../assets/placeholders/user-placeholder.png';
import ProfileModal from '../../components/ProfileModal/ProfileModal';
import { useUser } from '../../components/contexts/UserContextType';

// Simulación de datos de alimentación
const mockFeedingData = [
    {
        date: '2025-08-01',
        colony: 'Tunnel',
        user: {
            id: 'ca9e1f6f-e710-47e4-b249-1fd1a7e0824b',
            name: 'Tú',
            lastname: 'Martínez',
            profileImg: placeholderImage,
            email: 'tu@email.com',
            phoneNumber: '600123456'
        }
    },
    {
        date: '2025-08-02',
        colony: 'Tunnel',
        user: {
            name: 'Juan',
            lastname: 'Pérez',
            profileImg: placeholderImage,
            email: 'juan@email.com',
            phoneNumber: '600654321'
        }
    },
    {
        date: '2025-08-03',
        colony: 'Tunnel',
        user: {
            id: 'ca9e1f6f-e710-47e4-b249-1fd1a7e0824b',
            name: 'Tú',
            lastname: 'Martínez',
            profileImg: placeholderImage,
            email: 'tu@email.com',
            phoneNumber: '600123456'
        }
    },
    {
        date: '2025-08-04',
        colony: 'Tunnel',
        user: {
            name: 'Ana',
            lastname: 'García',
            profileImg: placeholderImage,
            email: 'ana@email.com',
            phoneNumber: '600987654'
        }
    },
    {
        date: '2025-08-05',
        colony: 'Tunnel',
        user: {
            id: 'ca9e1f6f-e710-47e4-b249-1fd1a7e0824b',
            name: 'Tú',
            lastname: 'Martínez',
            profileImg: placeholderImage,
            email: 'tu@email.com',
            phoneNumber: '600123456'
        }
    }
];


function getMonthDays(year: number, month: number) {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }
    return days;
}

const FeedingCalendar: React.FC = () => {
    const [feedingData, setFeedingData] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState<number>(7); // Agosto (0-indexed)
    const [currentYear, setCurrentYear] = useState<number>(2025);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const { user } = useUser();

    useEffect(() => {
        setFeedingData(mockFeedingData);
        console.log("Feeding Data:", mockFeedingData);
    }, []);

    const monthDays = getMonthDays(currentYear, currentMonth);

    const getFeedingInfo = (dateStr: string) => {
        const entry = feedingData.find(d => d.date === dateStr);
        console.log("Feeding Data:", dateStr, feedingData);

        if (!entry) return { name: null };
        return entry;
    };

    const handleDayClick = (info: any) => {
        if (info && info.name) {
            setSelectedUser(info);
            setShowModal(true);
        }
    };

    // Para cuadrícula tipo calendario
    const firstWeekDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Domingo
    const weeks: Date[][] = [];
    let week: Date[] = [];
    for (let i = 0; i < firstWeekDay; i++) {
        week.push(null as any); // Días vacíos al inicio
    }
    monthDays.forEach(day => {
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
        week.push(day);
    });
    if (week.length) {
        while (week.length < 7) week.push(null as any);
        weeks.push(week);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonButton onClick={() => window.history.back()}>
                            <IonIcon slot="icon-only" icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="app-title">Feeding Calendar</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>
                            {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonGrid>
                            <IonRow>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <IonCol key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: '#666' }}>{day}</IonCol>
                                ))}
                            </IonRow>
                            {weeks.map((week, wIdx) => (
                                <IonRow key={wIdx}>
                                    {week.map((day, dIdx) => {
                                        if (!day) return <IonCol key={dIdx}></IonCol>;
                                        const dateStr = day.toISOString().slice(0, 10);
                                        const info = getFeedingInfo(dateStr);
                                        const isYou = info.user && info.user.id === user?.uid;
                                        return (
                                            <IonCol key={dIdx} style={{ textAlign: 'center', padding: 6 }}>
                                                <div
                                                    className={isYou ? 'calendar-day-fed' : 'calendar-day'}
                                                    style={{
                                                        borderRadius: isYou ? '50%' : '8px',
                                                        background: isYou ? 'var(--ion-color-secondary)' : '#f8f9fa',
                                                        color: isYou ? '#fff' : '#222',
                                                        width: 36,
                                                        height: 36,
                                                        margin: '0 auto',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold',
                                                        boxShadow: isYou ? '0 0 6px var(--ion-color-secondary)' : 'none',
                                                    }}
                                                >
                                                    {day.getDate()}
                                                </div>
                                                <div style={{ fontSize: 12, marginTop: 2 }}>
                                                    {isYou
                                                        ? <IonIcon icon={checkmarkCircle} color="light" style={{ fontSize: 24 }} />
                                                        : info.user
                                                            ? info.user.profileImg
                                                                ? <img src={info.user.profileImg}
                                                                    alt={info.user.name}
                                                                    style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--ion-color-primary)' }}
                                                                    onClick={() => handleDayClick(info.user)}
                                                                />
                                                                : <IonIcon icon={personCircle} color="primary" style={{ fontSize: 24 }} />
                                                            : null
                                                    }
                                                </div>
                                            </IonCol>
                                        );
                                    })}
                                </IonRow>
                            ))}
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
            </IonContent>
            <ProfileModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                user={selectedUser}
            />
        </IonPage>
    );
};

export default FeedingCalendar;