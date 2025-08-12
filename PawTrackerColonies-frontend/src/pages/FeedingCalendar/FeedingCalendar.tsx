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
import UserFeedingScheduleService from '../../services/userFeeding.service';
import UserFeedingSchedule from '../../models/UserFeedingSchedule';
import { getDateValue } from '../../services/date.service';

function getMonthDays(year: number, month: number) {
    const days = [];
    const lastDay = new Date(year, month + 1, 0);
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }
    return days;
}

const FeedingCalendar: React.FC = () => {
    const [feedingData, setFeedingData] = useState<UserFeedingSchedule[]>([]);
    const [currentMonth, setCurrentMonth] = useState<number>(7); // August (0-indexed)
    const [currentYear, setCurrentYear] = useState<number>(2025);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const { user } = useUser();

    useEffect(() => {
        console.log("User Colonies:", user);
        const fetchFeedingData = async () => {
            if (!user) return;
            try {
                const data = await UserFeedingScheduleService.getAllUserFeedingSchedulesByColonyId('9b650ff3-9505-4969-89fe-2b568f760819');
                setFeedingData(data);
                console.log("All user feeding schedules:", data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFeedingData();
    }, [user]);

    const monthDays = getMonthDays(currentYear, currentMonth);

    const getFeedingInfo = (date: Date) => {
        const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const dayName = daysOfWeek[new Date(date).getDay()];

        const entry = feedingData.find(d => d.dayOfWeek === dayName);
        if (!entry) return null;
        console.log("entry ", entry, dayName)
        return entry;
    };

    const handleDayClick = (info: any) => {
        console.log("Clicked user info:", info);
        if (info && info.name) {
            setSelectedUser(info);
            setShowModal(true);
        }
    };
    
    const firstWeekDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
    const weeks: Date[][] = [];
    let week: Date[] = [];
    for (let i = 0; i < firstWeekDay; i++) {
        week.push(null as any);
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
                                        const info = getFeedingInfo(day);
                                        const isYou = info && info.user && info.user.uid === user?.uid; return (
                                            <IonCol key={dIdx} style={{ textAlign: 'center', padding: 6 }}>
                                                <div
                                                    className={isYou ? 'calendar-day-fed' : 'calendar-day'}
                                                    style={{
                                                        borderRadius: '50%',
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
                                                    onClick={() => handleDayClick(info?.user)}
                                                >
                                                    {day.getDate()}
                                                </div>
                                                <div style={{ fontSize: 12, marginTop: 2 }}>
                                                    {!isYou && info?.user.uid
                                                        ? info.user.profileImg
                                                            ? <img src={info.user.profileImg || placeholderImage}
                                                                alt={info.user.name}
                                                                style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--ion-color-primary)' }}
                                                                onClick={() => handleDayClick(info.user)}
                                                            />
                                                            : <img
                                                                src={placeholderImage}
                                                                alt={info.user.name}
                                                                style={{
                                                                    width: 24,
                                                                    height: 24,
                                                                    borderRadius: '50%',
                                                                    objectFit: 'cover',
                                                                    border: '2px solid var(--ion-color-primary)',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => handleDayClick(info.user)}
                                                            />
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