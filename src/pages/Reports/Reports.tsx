import React, { useState, useEffect } from 'react';
import './Reports.css';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonRouterLink } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import { getColoniesReports } from '../../services/coloniesService';
import ColonyReport from '../../types/ColonyReport';
import { DocumentReference, collection, getDoc, getFirestore } from 'firebase/firestore';
import Colony from '../../types/Colony';
import User from '../../types/User';
import { getReportsFromServer } from '../../services/reportsService';

const Reports: React.FC = () => {
  const [existingReports, setExistingReports] = useState<ColonyReport[]>([]);

  useEffect(() => {
    const fetchExistingReports = async () => {
      try {
        const reports = await getReportsFromServer();
        if (Array.isArray(reports)) {
          for (const report of reports) {
            const colonyData = await fetchColonyData(report.colony);
            const userData = await fetchUserData(report.user);

            if (colonyData != null) {
              report.colony = colonyData;
            }
            if (userData != null) {
              report.user = userData;
            }
          }
          setExistingReports(reports);
        } else {
          console.error('Invalid data received from server:', reports);
        }
      } catch (error) {
        console.error('Error fetching existing reports:', error);
      }
    };

    fetchExistingReports();
  }, []);

  const fetchColonyData = async (colonyRef: any) => {
    try {
      const colonyDocSnapshot = await getDoc(colonyRef);
      const colonyData = colonyDocSnapshot.data() as Colony;

      if (colonyData && colonyData.cats) {
        colonyData.id = colonyDocSnapshot.id;
        colonyData.cats = await fetchCatData(colonyData.cats);
        return colonyData;
      }
    } catch (error) {
      console.error("Error fetching colony data:", error);
      return null;
    }
  };

  const fetchReportData = async (reportReferences: any[]) => {


    const reportsData = [];

    for (const reportRef of reportReferences) {
      try {
        const reportDocSnapshot = await getDoc(reportRef);
        const reportData = reportDocSnapshot.data() as ColonyReport;

        if (reportData && reportData.colony instanceof DocumentReference) {
          // Fetch the referenced colony document
          const colonyDocSnapshot = await getDoc(reportData.colony);

          // Extract the necessary data from the colony document
          const colonyData = colonyDocSnapshot.data() as Colony;
          colonyData.id = colonyDocSnapshot.id;

          reportData.id = reportDocSnapshot.id;
          reportData.colony = colonyData;
          // console.log("report data", reportData);

          // Fetch cat data for fed cats
          const fedCatsData = await fetchCatData(reportData.catsFed);
          reportData.catsFed = fedCatsData;

          const catsMissingData = await fetchCatData(reportData.catsMissing);
          reportData.catsMissing = catsMissingData;

          const userData = await fetchUserData(reportData.user);
          if (userData !== null) {
            reportData.user = userData;
          }
          console.log("report data", reportData)
          reportsData.push(reportData);
        }

      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }

    return reportsData;
  };

  const fetchCatData = async (catReferences: any[]) => {
    const catsData = [];

    for (const catRef of catReferences) {
      try {
        if (catRef instanceof DocumentReference) {
          const catDocSnapshot = await getDoc(catRef);
          const catData = catDocSnapshot.data() as Cat;
          catData.id = catDocSnapshot.id;

          if (catData) {
            catsData.push(catData);
          }
        } else if (typeof catRef === 'string' && catRef.trim() !== '') {
          console.log("Invalid catRef:", catRef);
        }
      } catch (error) {
        console.error("Error fetching cat data:", error);
      }
    }

    return catsData;
  };

  const fetchUserData = async (userReference: any) => {
    try {
      const userDocSnapshot = await getDoc(userReference);
      const userData = userDocSnapshot.data() as User;
      userData.uid = userDocSnapshot.id;

      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // Handle the error accordingly in your application
    }
  };

  const openReport = () => {
    // history.push({`/user-report/${report.id}`});
    
  }

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
            existingReports.map((report, index) => (
              <IonRouterLink
              key={index}
              routerLink={`/user-report/${report.id}`}
              routerDirection="forward"
            >
              <IonCard key={index} className="report-card" onClick={openReport}>
                <IonCardHeader>
                  <div className="report-details">
                    <IonCardTitle>{report.colony.name}</IonCardTitle>
                    <IonLabel className="date-label">29/3/2023</IonLabel>
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
      </IonContent>
    </IonPage>
  );
};

export default Reports;
