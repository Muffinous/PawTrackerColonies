import React, { useState, useEffect } from 'react';
import './Home.css';
import { IonContent, IonPage, IonButton, IonToolbar, IonHeader, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonButtons, IonMenuButton } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import pawLogoWhite from '../../assets/pawlogo-white.png';


import ColoniesPopup from '../../components/ColoniesPopup/ColoniesPopup';
// @ts-ignore
import Colony from '../../models/Colony';
import { useHistory } from 'react-router-dom';
import ColonyReport from '../../models/ColonyReport';
import { Cat } from '../../models/Cat';
import { useUser } from '../../components/contexts/UserContextType';
import ColonyService from '../../services/colony.service';
import UserColony from '../../models/UserColony';
import ReportsService from '../../services/report.service';

// Assuming getColoniesFromServer returns an array of numbers
const Home: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userColonies, setUserColonies] = useState<UserColony[]>([]);
  const [userReports, setUserReports] = useState<ColonyReport[]>([]);
  const history = useHistory();
  const [loading, setLoading] = useState(false); // Added loading state
  const [cats, setCatsInfo] = useState<Cat[]>(/* Initial value */);
  const { user } = useUser();
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;


  useEffect(() => {
    const fetchUserColonies = async () => {
      console.log("Fetching user colonies for user:", user);
      if (!user?.uid) {
        console.log('User no está definido aún');
        return;
      }

      setLoading(true);
      try {
        const colonies = await ColonyService.getColoniesByUserId(user.uid);
        const reportsData = await fetchReportData(user.uid);
        setUserColonies(colonies || []);
        setUserReports(reportsData || []);
      } catch (error) {
        console.error("Error fetching user colonies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserColonies();
  }, [user]);


  const fetchReportData = async (uuid: string) => {
    try {
      const reportsData = await ReportsService.getReportsByUserId(uuid);
      return reportsData
    } catch (error) {
      console.error("Error fetching reports data:", error);
    }
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const handleSaveColonies = async (newSelectedColonies: Colony[]) => {

    const newUserColonies: UserColony[] = newSelectedColonies.map((colony) => ({
      id: colony.id ?? '',
      colonyId: colony.id ?? '',
      name: colony.name,
      cats: colony.cats,
      location: colony.location,
      userId: user?.uid ?? '',
      activeFeeding: true,
    }));

    // Update the state to reflect the changes
    setUserColonies(newUserColonies)
  };

  const handleColonySelection = (colony: UserColony) => {
    console.log(`Selected Colonies:`, colony);
    // Navigate to the ReportFeeding page with the colony ID as a parameter
    history.push(`/report-feeding/${colony.colonyId}`);
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
              <h1>Home</h1>
            </div>
            <div>
              <h2 className="custom-title">Colonies you currently feed</h2>
              {Array.isArray(userColonies) && userColonies.length > 0 ? (
                <>
                  {/* Render the list of colonies as cards */}
                  {userColonies.map((userColony) => (
                    <IonCard key={userColony.id}>
                      <IonCardHeader>
                        <IonCardTitle>{userColony.name}</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent className="report-feeding-content text-center">
                        <p>Description or additional information about the colony.</p>
                        <div className="label-container">
                          <IonLabel className="status-label">
                            Number of cats: {userColony.cats.length}
                          </IonLabel>
                        </div>
                        <IonButton
                          className='report-feeding-button'
                          expand="full"
                          shape="round"
                          onClick={() => handleColonySelection(userColony)}
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
            {isPopupOpen && user && <ColoniesPopup isOpen={isPopupOpen} userColonies={userColonies} onClose={() => setIsPopupOpen(false)} onSave={handleSaveColonies} />}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
