import React, { useState, useEffect } from 'react';
import './Profile.css';
import { IonContent, IonPage, IonButton, IonToolbar, IonHeader, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import ColoniesPopup from '../../components/ColoniesPopUp/ColoniesPopup';
// @ts-ignore
import { getColoniesFromServer, saveColoniesToServer } from '@services/coloniesService';
import Colony from '../../types/Colony';
import User from '../../types/User';

import { useHistory } from 'react-router-dom';
import { DocumentReference, collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { getUserById } from '@services/userService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ColonyReport from '../../types/ColonyReport';

// Assuming getColoniesFromServer returns an array of numbers
const Profile: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userColonies, setUserColonies] = useState<Colony[]>([]);
  const [userReports, setUserReports] = useState<ColonyReport[]>([]);
  const [userData, setUserData] = useState<{ id: string; data: User } | null>(null);
  const history = useHistory();

  useEffect(() => {
    setIsPopupOpen(false);

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      console.log("user ", user)
      // If the user is logged in, fetch and set user data
      if (user) {
        const fetchData = async () => {
          try {
            const storedUser = sessionStorage.getItem('user');

            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);

              if (parsedUser && parsedUser.userData && parsedUser.id) {
                const userData = await getUserById(parsedUser.id);

                setUserData({ id: parsedUser.id, data: userData });
                const coloniesData = await fetchColonyData(userData.colonies);
                const reportsData = await fetchReportData(userData.reports);
                setUserColonies(coloniesData);
                setUserReports(reportsData);
              }
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };

        fetchData();
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userData !== null) {
      console.log("Final User Data:", userData);
    }
    if (userColonies !== null) {
      console.log("Final Colonies Data:", userColonies);
    }
    if (userReports !== null) {
      console.log("Final Reports Data:", userReports);
    }
  }, [userData, userColonies, userReports]);

  const fetchColonyData = async (colonyReferences: any[]) => {
    const coloniesData = [];
  
    for (const colonyRef of colonyReferences) {
      try {
        const colonyDocSnapshot = await getDoc(colonyRef);
        const colonyData = colonyDocSnapshot.data() as Colony;
  
        if (colonyData && colonyData.cats) {
          colonyData.id = colonyDocSnapshot.id;
          colonyData.cats = await fetchCatData(colonyData.cats);
          coloniesData.push(colonyData);
        }
      } catch (error) {
        console.error("Error fetching colony data:", error);
      }
    }
  
    return coloniesData;
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

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const handleSaveColonies = async (selectedColonies: Colony[]) => {
    // Save the selected colonies to the server
    console.log("userData ", userData)
    await saveColoniesToServer(selectedColonies, userData?.id);

    // Update the state to reflect the changes
    setUserColonies(selectedColonies);
  };

  const handleColonySelection = (colony: Colony) => {
    console.log(`Selected Colonies: ${JSON.stringify(colony)}`);
    // Navigate to the ReportFeeding page with the colony ID as a parameter
    history.push(`/report-feeding/${colony.id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="app-title">PawTracker (Colonies version)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="home-container">
        <div className="header">
          <img src={pawLogo} alt="Cat Logo" className="logo" />
          <h1>{userData?.data.name} {userData?.data.lastname}</h1>
          <h6>@{userData?.data.username}</h6>
        </div>
        {userData && (
          <>
            {/* First IonCard */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Colonies you feed</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {userColonies.map((colony) => (
                  <IonCard key={colony.id}>
                    <IonCardHeader>
                      <IonCardTitle>{colony.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div key={colony.id}>
                        {/* Display colony information */}
                        <p>{colony?.cats.length} cats</p>
                        {/* Add other colony information as needed */}
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonCardContent>
              <div className="button-container">
                <IonButton className="select-colonies-btn" expand="full" shape="round" onClick={openPopup}>
                  Select your colonies
                </IonButton>
              </div>
            </IonCard>
            {/* Second IonCard - Additional Information */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Reports</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {userReports.map((report) => (
                  <IonCard key={report.id} className="report-card">
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
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonCardContent>
            </IonCard>
          </>
        )
        }
        <div>
        </div>
        {isPopupOpen && userData && <ColoniesPopup isOpen={isPopupOpen} userId={userData?.id} onClose={() => setIsPopupOpen(false)} onSave={handleSaveColonies} />}
      </IonContent >
    </IonPage >
  );
};

export default Profile;
