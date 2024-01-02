import React, { useState, useEffect } from 'react';
import './Reports.css';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import { getColoniesReports } from '../../services/coloniesService';
import ColonyReport from '../../types/ColonyReport';

const Reports: React.FC = () => {
  const [existingReports, setExistingReports] = useState<ColonyReport[]>([]);

  useEffect(() => {
    const fetchExistingReports = async () => {
      try {
        const colonies = await getColoniesReports();
        if (Array.isArray(colonies)) {
          setExistingReports(colonies);
        } else {
          console.error('Invalid data received from server:', colonies);
        }
      } catch (error) {
        console.error('Error fetching existing reports:', error);
      }
    };

    fetchExistingReports();
  }, []);

  return (
    <IonPage>
      {/* ... your existing code ... */}
      <IonContent className="home-container">
        <div className="header">
          <img src={pawLogo} alt="Cat Logo" className="logo" />
          <h1>Reports</h1>
        </div>
        <div>
          {existingReports.length > 0 ? (
            existingReports.map((colony, index) => (
              <IonCard key={index} className="report-card">
                <IonCardHeader>
                  <IonCardTitle>{colony.name}</IonCardTitle>
                  <div className="report-details">
                    <IonLabel className="date-label">29/3/2023</IonLabel>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <IonLabel>Feeder: Mimi</IonLabel>
                  {/* Add more details or customize the card content */}
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            <p>No reports available.</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Reports;
