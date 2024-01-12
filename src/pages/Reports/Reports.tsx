import React, { useState, useEffect } from 'react';
import './Reports.css';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonRouterLink, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import { getColoniesByIdFromServer, getColoniesReports } from '../../services/coloniesService';
import ColonyReport from '../../types/ColonyReport';
import { DocumentReference, collection, getDoc, getFirestore } from 'firebase/firestore';
import Colony from '../../types/Colony';
import User from '../../types/User';
import { getReportsFromServer } from '../../services/reportsService';
import { getUserById } from '../../services/userService';

const Reports: React.FC = () => {
  const [existingReports, setExistingReports] = useState<ColonyReport[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [colony, setColonyData] = useState<Colony[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchExistingReports = async () => {
      try {
        const reports = await getReportsFromServer();
        if (Array.isArray(reports)) {
          const coloniesData = [];

          for (const report of reports) {
            const colonyData = await fetchColonyData(report.colony);
            const userData = await fetchUserData(report.user);

            if (colonyData != null) {
              coloniesData.push(colonyData);
            }
            if (userData != null) {
              report.user = userData;
            }
          }

          if (isMounted) {
            setColonyData(coloniesData)
            setExistingReports(reports);
            setLoading(false);
          }

          console.log("existing reports ", existingReports)
        } else {
          console.error('Invalid data received from server:', reports);
          if (isMounted) {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching existing reports:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExistingReports();
    
  }, []);

  const fetchColonyData = async (colonyId: any) => {
    try {
      const colonyData = await getColoniesByIdFromServer(colonyId);

      if (colonyData && colonyData.cats) {
        colonyData.id = colonyId;
        return colonyData;
      }
    } catch (error) {
      console.error("Error fetching colony data:", error);
      return null;
    }
  };

  const fetchUserData = async (userId: any) => {
    try {
      const userData = await getUserById(userId) as User;
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // Handle the error accordingly in your application
    }
  };

  const openReport = () => {
    // history.push({`/user-report/${report.id}`});
  }

  const getDateValue = (reportId: number) => {
    const reportDate = new Date(existingReports[reportId].datetime.seconds * 1000);

    const date = reportDate.getDate() + '/' + reportDate.getMonth() + 1 + '/' + reportDate.getFullYear()
    return date
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="app-title">PawTracker (Colonies)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="home-container">
        {loading ? (
          <div className="loading-container">
            <h5>Loading <span className="loading-dots"></span></h5>
            <img src="src/assets/loading/catloading.gif" alt="Loading" />
          </div>
        ) : (
          <div>
            <div className="header">
              <img src={pawLogo} alt="Cat Logo" className="logo" />
              <h1>Reports</h1>
            </div>
            <div>
              {existingReports.length > 0 ? (
                existingReports.map((report, index) => (
                  <IonRouterLink
                    key={index}
                    routerLink={`/user-report/${report.id}`}
                    routerDirection="forward"
                  >
                    <IonCard key={index} className="report-card" onClick={openReport}>
                      <IonCardHeader>
                        <div className="report-details">
                          <IonCardTitle>{colony[index].name}</IonCardTitle>
                          <IonLabel className="date-label">{getDateValue(index)}</IonLabel>
                        </div>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonLabel>Feeder: {report.user.name} {report.user.lastname}</IonLabel>
                        <div className="label-container">
                          <IonLabel className="status-label">Cats fed: {report.catsFed.length}</IonLabel>
                          <IonLabel className="status-label">Cats missing: {report.catsMissing.length}</IonLabel>
                        </div>
                        {/* <IonRouterLink
                    routerLink={`/user-report/${report.id}`}
                    routerDirection="forward"
                  >
                    View Details
                  </IonRouterLink> */}
                      </IonCardContent>
                    </IonCard>
                  </IonRouterLink>
                ))
              ) : (
                <p>No reports available.</p>
              )}
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Reports;
