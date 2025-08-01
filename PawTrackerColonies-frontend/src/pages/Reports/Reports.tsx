import React, { useState, useEffect } from 'react';
import './Reports.css';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonRouterLink, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import ColonyReport from '../../models/ColonyReport';
import Colony from '../../models/Colony';
import pawLogoWhite from '../../assets/pawlogo-white.png';
import { useUser } from '../../components/contexts/UserContextType';
import ReportsService from '../../services/report.service';

const Reports: React.FC = () => {
  const [existingReports, setExistingReports] = useState<ColonyReport[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [colony, setColonyData] = useState<Colony[]>([]);
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const { user } = useUser();

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);

    const fetchExistingReports = async () => {

      try {
        const reportsData = await fetchReportData(user.uid);

        console.log("existing reports ", reportsData)
        setExistingReports(reportsData || [])
        setLoading(false);
      } catch (error) {
        console.error('Error fetching existing reports:', error);
      }
    }
    fetchExistingReports();

  }, []);


  const openReport = () => {
    // history.push({`/user-report/${report.id}`});
  }

  const getDateValue = (index: number) => {
    const rawDate = existingReports[index]?.datetime;

    if (!rawDate || typeof rawDate !== 'string') return null;

    const date = new Date(rawDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };


  const fetchReportData = async (uuid: string) => {
    try {
      const reportsData = await ReportsService.getReportsByUserId(uuid);
      return reportsData
    } catch (error) {
      console.error("Error fetching reports data:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="app-title">PawTracker (Colonies)</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
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
              <img src={isDarkMode ? pawLogoWhite : pawLogo} alt="Cat Logo" className="logo" />
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
                          <IonCardTitle>{report?.colony.name}</IonCardTitle>
                          <IonLabel className="date-label">{getDateValue(index)}</IonLabel>
                        </div>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonLabel>Feeder: {report.user?.name} {report.user?.lastname}</IonLabel>
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

                <>
                  <IonCard className="report-card" onClick={openReport}>
                    <IonCardHeader>
                      <div className="report-details" style={{ alignSelf: 'center' }}>
                        <IonCardTitle >No reports available.</IonCardTitle>
                      </div>
                    </IonCardHeader>
                  </IonCard></>
              )}
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Reports;
