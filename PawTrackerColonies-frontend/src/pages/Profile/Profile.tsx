import React, { useState, useEffect } from 'react';
import './Profile.css';
import { IonContent, IonPage, IonButton, IonToolbar, IonHeader, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonRouterLink, IonButtons, IonMenuButton } from '@ionic/react';
import ColoniesPopup from '../../components/ColoniesPopup/ColoniesPopup';
import Colony from '../../models/Colony';

import { useHistory } from 'react-router-dom';
import ColonyReport from '../../models/ColonyReport';
import Loading from '../../components/Loading/Loading';
import { useUser } from '../../components/contexts/UserContextType';
import ColonyService from '../../services/colony.service';
import placeholderImage from '../../assets/placeholders/user-placeholder.png';
import ReportsService from '../../services/report.service';
import UserColony from '../../models/UserColony';

// Assuming getColoniesFromServer returns an array of numbers
const Profile: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userColonies, setUserColonies] = useState<UserColony[]>([]);
  const [userReports, setUserReports] = useState<ColonyReport[]>([]);
  const history = useHistory();
  const [loading, setLoading] = useState(false); // Added loading state
  const { user } = useUser();

  useEffect(() => {
    if (!user?.uid) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const coloniesData = await fetchColonyData(user.uid);
        const reportsData = await fetchReportData(user.uid);

        if (isMounted) {
          setUserColonies(coloniesData || []);
          setUserReports(reportsData || []);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);



  const fetchColonyData = async (uuid: string) => {

    try {
      const coloniesData = await ColonyService.getColoniesByUserId(uuid);
      return coloniesData
    } catch (error) {
      console.error("Error fetching colony data 2:", error);
    }

  };

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
    // Save the selected colonies to the server

    const newUserColonies: UserColony[] = newSelectedColonies.map((colony) => ({
      id: colony.id ?? '', // Usa un string vacío si no hay id, o podrías generar uno temporal
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



  const handleColonySelection = (colony: Colony) => {
    // Navigate to the ReportFeeding page with the colony ID as a parameter
    history.push(`/report-feeding/${colony.id}`);
  };

  const getDateValue = (index: number) => {
    const rawDate = userReports[index]?.datetime;

    if (!rawDate || typeof rawDate !== 'string') return null;

    const date = new Date(rawDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    console.log("rawDate ", rawDate, "date ", date, "day ", day, "month ", month, "year ", year)
    return `${day}/${month}/${year}`;
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="app-title">PawTracker (Colonies)</IonTitle>
          <IonButtons slot="end"> {/* Use slot="end" for placing elements on the right side */}
            <IonMenuButton /> {/* Menu button */}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="home-container">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="header">
              <img src={user?.profilePicture || placeholderImage} alt="Cat Logo" className="logo" />
              <h1>{user?.name} {user?.lastname}</h1>
              <h6>@{user?.username}</h6>
            </div>
            {user && (
              <>
                {/* First IonCard */}
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Colonies you feed</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {userColonies.map((colony) => (
                      <IonCard key={colony.id} className='user-colonies-card'>
                        <IonCardHeader>
                          <IonCardTitle>{colony.name}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                          <div key={colony.id}>
                            {/* Display colony information */}
                            <div className="label-container">
                              <IonLabel className="status-label">Number of cats: {colony.cats.length}</IonLabel>
                            </div>
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
                    {userReports.length === 0 ? (
                      <IonLabel>No reports yet.</IonLabel>
                    ) : (
                      userReports.map((report, index) => (
                        <IonRouterLink
                          key={index}
                          routerLink={`/user-report/${report.id}`}
                          routerDirection="forward"
                        >
                          <IonCard key={index} className="report-card reports-colonies-card">
                            <IonCardHeader>
                              <div className="report-details">
                                  <IonCardTitle>{report.colony?.name}</IonCardTitle>
                                <IonLabel className="date-label">{getDateValue(index)}</IonLabel>
                              </div>
                            </IonCardHeader>
                            <IonCardContent>
                              <IonLabel>Feeder: {report?.user?.name} {report.user?.lastname}</IonLabel>
                              <div className="label-container">
                                <IonLabel className="status-label">Cats fed: {report.catsFed.length}</IonLabel>
                                <IonLabel className="status-label">Cats missing: {report.catsMissing.length}</IonLabel>
                              </div>
                            </IonCardContent>
                          </IonCard>
                        </IonRouterLink>

                      ))
                    )}
                  </IonCardContent>
                </IonCard>
              </>
            )
            }
            <div>
            </div>
            {isPopupOpen && user && <ColoniesPopup isOpen={isPopupOpen} userColonies={userColonies} onClose={() => setIsPopupOpen(false)} onSave={handleSaveColonies} />}
          </div>
        )}
      </IonContent >
    </IonPage >
  );
};

export default Profile;
