import React, { useState, useEffect } from 'react';
import './Reports.css';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import { getColoniesFromServer } from '../../services/coloniesService';
import Colony from '../../types/Colony';

const Reports: React.FC = () => {
  const [existingReports, setExistingReports] = useState<Colony[]>([]);

  useEffect(() => {
    const fetchExistingReports = async () => {
      try {
        const colonies = await getColoniesFromServer();
        if (colonies) {
          setExistingReports(colonies);
        }
      } catch (error) {
        console.error('Error fetching existing reports:', error);
      }
    };

    fetchExistingReports();
  }, []);

  useEffect(() => {
    console.log('existingReports ', existingReports);
  }, [existingReports]);

  return (
    <IonPage>
      {/* ... your existing code ... */}
      <IonContent className="home-container">
        <div className="header">
          <img src={pawLogo} alt="Cat Logo" className="logo" />
          <h1>Reports</h1>
        </div>
        <div>
          {existingReports.map((colony, index) => (
            <IonCard key={index} className="report-card">
              <IonCardHeader>
                <IonCardTitle>{colony}</IonCardTitle>
                <div className="report-details">
                  <IonLabel className="date-label">29/3/2023</IonLabel>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <IonLabel>Feeder: Mimi</IonLabel>
                {/* Add more details or customize the card content */}
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Reports;
