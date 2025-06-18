import React, { useState, useEffect } from 'react';
import './Profile.css';
import { IonContent, IonPage, IonButton, IonToolbar, IonHeader, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonRouterLink, IonButtons, IonMenuButton } from '@ionic/react';
import ColoniesPopup from '../../components/ColoniesPopUp/ColoniesPopup';
// @ts-ignore
import { saveColoniesToServer } from '@services/coloniesService';
import Colony from '../../models/Colony';
import User from '../../models/User';

import { useHistory } from 'react-router-dom';
import ColonyReport from '../../models/ColonyReport';
import { getColoniesByIdFromServer } from '../../services/coloniesService';
import { getReportByIdFromServer } from '../../services/reportsService';
import Loading from '../../components/Loading/Loading';
import { useUser } from '../../components/contexts/UserContextType';
import ColonyService from '../../services/colony.service';
import placeholderImage from '../../assets/placeholders/user-placeholder.png';
import ReportsService from '../../services/report.service';

// Assuming getColoniesFromServer returns an array of numbers
const Profile: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userColonies, setUserColonies] = useState<Colony[]>([]);
  const [userReports, setUserReports] = useState<ColonyReport[]>([]);
  const history = useHistory();
  const [loading, setLoading] = useState(false); // Added loading state
  const [reportColonies, setReportColoniesData] = useState<Colony[]>(); // State to store cat image URLs
  const { user } = useUser();

  useEffect(() => {
    console.log("User changed", user?.uid)
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
      console.log("coloniesData ", JSON.stringify(coloniesData))
      return coloniesData
    } catch (error) {
      console.error("Error fetching colony data:", error);
    }

  };

  const fetchReportData = async (uuid: string) => {
    const reportsData = [];
    try {
      const reportsData = await ReportsService.getReportsByUserId(uuid);
      console.log("reportsData ", JSON.stringify(reportsData))
      return reportsData
    } catch (error) {
      console.error("Error fetching reports data:", error);
    }
  };


  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const handleSaveColonies = async (selectedColonies: Colony[]) => {
    // Save the selected colonies to the server
    console.log("userData ", user)
    await saveColoniesToServer(selectedColonies, user?.uid);

    // Update the state to reflect the changes
    setUserColonies(selectedColonies);
  };

  const handleColonySelection = (colony: Colony) => {
    console.log(`Selected Colonies: ${JSON.stringify(colony)}`);
    // Navigate to the ReportFeeding page with the colony ID as a parameter
    history.push(`/report-feeding/${colony.id}`);
  };

  const getDateValue = (reportId: number) => {
    const reportDate = new Date(userReports[reportId].datetime.seconds * 1000);

    const date = reportDate.getDate() + '/' + reportDate.getMonth() + 1 + '/' + reportDate.getFullYear()
    return date
  }

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
                    {userReports.map((report, index) => (
                      <IonRouterLink
                        key={index}
                        routerLink={`/user-report/${report.id}`}
                        routerDirection="forward"
                      >
                        <IonCard key={index} className="report-card reports-colonies-card">
                          <IonCardHeader>
                            <div className="report-details">
                              {reportColonies && reportColonies[index] && (
                                <IonCardTitle>{reportColonies[index].name}</IonCardTitle>
                              )}
                              <IonLabel className="date-label">{getDateValue(index)}</IonLabel>
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
                      </IonRouterLink>

                    ))}
                  </IonCardContent>
                </IonCard>
              </>
            )
            }
            <div>
            </div>
            {isPopupOpen && user && <ColoniesPopup isOpen={isPopupOpen} userId={user?.uid} onClose={() => setIsPopupOpen(false)} onSave={handleSaveColonies} />}
          </div>
        )}
      </IonContent >
    </IonPage >
  );
};

export default Profile;
