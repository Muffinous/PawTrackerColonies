import React, { useState, useEffect } from 'react';
import './Home.css';
import { IonContent, IonPage, IonButton, IonToolbar, IonHeader, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import ColoniesPopup from '../../components/ColoniesPopUp/ColoniesPopup';
// @ts-ignore
import { saveColoniesToServer } from '@services/coloniesService';
import Colony from '../../types/Colony';
import { useHistory } from 'react-router-dom';
import User from '../../types/User';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ColonyReport from '../../types/ColonyReport';
import { getColoniesByIdFromServer } from '../../services/coloniesService';
import { getUserById } from '../../services/userService';
import { getReportByIdFromServer } from '../../services/reportsService';

// Assuming getColoniesFromServer returns an array of numbers
const Home: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userColonies, setUserColonies] = useState<Colony[]>([]);
  const [userReports, setUserReports] = useState<ColonyReport[]>([]);
  const history = useHistory();
  const [userData, setUserData] = useState<{ id: string; data: User } | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [cats, setCatsInfo] = useState<Cat[]>(/* Initial value */);

  useEffect(() => {
    let isMounted = true;

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

                  if (isMounted) {
                    setUserColonies(coloniesData);
                    setUserReports(reportsData);
                    console.log("userRE", reportsData)
                    setLoading(false);
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            if (isMounted) {
              setLoading(false);
            }
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
      console.log("Final Colonies Data:", userColonies);
    }
  }, [userData, userColonies, userReports]);

  const fetchReportData = async (reports: any[]) => {
    const reportsData = [];

    for (const reportId of reports) {
      console.log("reportId ", reportId)
      try {
        const reportData = await getReportByIdFromServer(reportId);
        if (reportData) {
          reportData.id = reportId;
        }

        console.log("report ", reportData)
        if (reportData) {
          reportsData.push(reportData);
        }

      } catch (error) {
        console.error("Error fetching colony data:", error);
      }
    }
    return reportsData;
  };

  const fetchColonyData = async (colonies: any[]) => {
    const coloniesData = [];

    for (const colonyId of colonies) {
      try {
        const colonyData = await getColoniesByIdFromServer(colonyId);
        colonyData.id = colonyId;

        if (colonyData && colonyData.cats) {
          // console.log("CATS colonyData.cats ", colonyData.cats)
          // const cats = await getColoniesCats(colonyId);
          // setCatsInfo(cats)
          coloniesData.push(colonyData);
        }

      } catch (error) {
        console.error("Error fetching colony data:", error);
      }
    }
    return coloniesData;
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const handleSaveColonies = async (selectedColonies: Colony[]) => {
    // Extract only the IDs from selectedColonies
    const selectedColonyIds = selectedColonies.map(colony => colony.id);

    // Save the selected colonies to the server
    await saveColoniesToServer(selectedColonyIds, userData?.id);

    // Update the state to reflect the changes
    setUserColonies(selectedColonies);
  };

  const handleColonySelection = (colony: Colony) => {
    console.log(`Selected Colonies: ${JSON.stringify(colony)}`, colony);
    // Navigate to the ReportFeeding page with the colony ID as a parameter
    history.push(`/report-feeding/${colony.id}`);
  };

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
                          <IonLabel className="status-label">
                            Number of cats: {colony.cats.filter(catId => catId.trim() !== '').length}
                          </IonLabel>
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
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
