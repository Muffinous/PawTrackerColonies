import React, { useState, useEffect } from 'react';
import './Home.css';
import { IonContent, IonPage, IonButton, IonToolbar, IonHeader, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import ColoniesPopup from '../../components/ColoniesPopUp/ColoniesPopup';
// @ts-ignore
import { getColoniesFromServer, saveColoniesToServer } from '@services/coloniesService';
import Colony from '../../types/Colony';
import { useHistory } from 'react-router-dom';
import Tabs from '../../components/Tabs/Tabs';
import User from '../../types/User';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUserById } from '@services/userService';
import { DocumentReference, getDoc } from 'firebase/firestore';
import ColonyReport from '../../types/ColonyReport';

// Assuming getColoniesFromServer returns an array of numbers
const Home: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userColonies, setUserColonies] = useState<Colony[]>([]);
  const [userReports, setUserReports] = useState<ColonyReport[]>([]);
  const history = useHistory();
  const [userData, setUserData] = useState<{ id: string; data: User } | null>(null);


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
                if (userData.colonies != null) {
                  const coloniesData = await fetchColonyData(userData.colonies);
                  const reportsData = await fetchReportData(userData.reports);
                  setUserColonies(coloniesData);
                  setUserReports(reportsData);
                  console.log("userRE", reportsData)
                }
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
      // console.log("Final User Data:", userData);
    }
    if (userColonies !== null) {
      // console.log("Final Colonies Data:", userColonies);
    }
  }, [userData, userColonies, userReports]);

  const fetchReportData = async (reportReferences: any[]) => {
    const reportsData = [];

    for (const reportRef of reportReferences) {
      console.log("reportRef ", reportRef)
      try {
        const colonyDocSnapshot = await getDoc(reportRef);
        console.log("colonyDocSnapshot ", colonyDocSnapshot)
        const reportData = colonyDocSnapshot.data() as ColonyReport;
        reportData.id = colonyDocSnapshot.id;

        if (reportData) {
          reportsData.push(reportData);
        }

      } catch (error) {
        console.error("Error fetching colony data:", error);
      }
    }
    return reportsData;
  };

  const fetchColonyData = async (colonyReferences: any[]) => {
    const coloniesData = [];

    for (const colonyRef of colonyReferences) {
      console.log("colonyRef ", colonyRef)
      try {
        const colonyDocSnapshot = await getDoc(colonyRef);
        console.log("colonyDocSnapshot ", colonyDocSnapshot)
        const colonyData = colonyDocSnapshot.data() as Colony;
        colonyData.id = colonyDocSnapshot.id;

        if (colonyData && colonyData.cats) {
          colonyData.cats = await fetchCatData(colonyData.cats);
          coloniesData.push(colonyData);
        }

      } catch (error) {
        console.error("Error fetching colony data:", error);
      }
    }
    return coloniesData;
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
          <h1>Home</h1>
        </div>
        <div>
          <h2 className="custom-title">Colonies you currently feed</h2>
          {Array.isArray(userColonies) && userColonies.length > 0 ? (
            <>
              {/* Render the list of colonies as cards */}
              {userColonies.map((colony) => (
                <IonCard key={colony.id}>
                  <IonCardHeader>
                    <IonCardTitle>{colony.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="report-feeding-content text-center">
                  <p>Description or additional information about the colony.</p>
                    <div className="label-container">
                      <IonLabel className="status-label">Number of cats: {colony.cats.length}</IonLabel>
                    </div>
                    <IonButton
                      className='report-feeding-button'
                      expand="full"
                      shape="round"
                      onClick={() => handleColonySelection(colony)}
                    >
                      Report Feeding
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </>
          ) : (
            <p className="text-center">No colonies currently selected.</p>
          )}
          <div className="button-container">
            <IonButton className="select-colonies-btn" expand="full" shape="round" onClick={openPopup}>
              Select your colonies
            </IonButton>
          </div>
        </div>
        {isPopupOpen && userData && <ColoniesPopup isOpen={isPopupOpen} userId={userData?.id} onClose={() => setIsPopupOpen(false)} onSave={handleSaveColonies} />}
      </IonContent>
    </IonPage>
  );
};

export default Home;
