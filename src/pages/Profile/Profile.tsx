import React, { useState, useEffect } from 'react';
import './Profile.css';
import { IonContent, IonPage, IonButton, IonToolbar, IonHeader, IonTitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonRouterLink, IonButtons, IonMenuButton } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
import ColoniesPopup from '../../components/ColoniesPopUp/ColoniesPopup';
// @ts-ignore
import { getColoniesFromServer, saveColoniesToServer } from '@services/coloniesService';
import Colony from '../../types/Colony';
import User from '../../types/User';

import { useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ColonyReport from '../../types/ColonyReport';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { getUserById } from '../../services/userService';
import { getColoniesByIdFromServer, getColoniesCats } from '../../services/coloniesService';
import { getReportByIdFromServer } from '../../services/reportsService';

// Assuming getColoniesFromServer returns an array of numbers
const Profile: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userColonies, setUserColonies] = useState<Colony[]>([]);
  const [userReports, setUserReports] = useState<ColonyReport[]>([]);
  const [userData, setUserData] = useState<{ id: string; data: User } | null>(null);
  const history = useHistory();
  const [loading, setLoading] = useState(true); // Added loading state
  const [reportColonies, setReportColoniesData] = useState<Colony[]>(); // State to store cat image URLs

  useEffect(() => {
    let isMounted = true;
    setIsPopupOpen(false);

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      // If the user is logged in, fetch and set user data
      if (user) {
        const fetchData = async () => {
          try {
            const storedUser = sessionStorage.getItem('user');

            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);

              if (parsedUser && parsedUser.userData && parsedUser.id) {
                const userData = await getUserById(parsedUser.id);

                const storage = getStorage();

                if (userData.profilePicture !== '') {
                  try {
                    const imageRef = ref(storage, userData.profilePicture);
                    const imageURL = await getDownloadURL(imageRef);

                    // If authenticated, get the download URL with the user's token
                    userData.profilePicture = imageURL; // Replace the path with the actual URL
                  } catch (error) {
                    console.error('Error fetching download URL:', error);
                    // Handle the error, e.g., display a placeholder image
                    userData.profilePicture = 'src/assets/placeholders/user-placeholder.png';
                  }
                } else {
                  // If the user is not authenticated, display a placeholder image
                  userData.profilePicture = 'src/assets/placeholders/user-placeholder.png';


                  setUserData({ id: parsedUser.id, data: userData });
                  const coloniesData = await fetchColonyData(userData.colonies);
                  const reportsData = await fetchReportData(userData.reports);

                  if (isMounted) {
                    setUserColonies(coloniesData);
                    setUserReports(reportsData);
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
      console.log("Final User Colonies Data:", userColonies);
    }
    if (userReports !== null) {
      console.log("Final Reports Data:", userReports);
    }
  }, [userData, userColonies, userReports]);

  const fetchColonyData = async (colonies: any[]) => {
    const coloniesData = [];

    for (const colonyId of colonies) {
      try {
        const colonyData = await getColoniesByIdFromServer(colonyId);

        colonyData.id = colonyId;

        if (colonyData) {
          coloniesData.push(colonyData);
        }

      } catch (error) {
        console.error("Error fetching colony data:", error);
      }
    }
    return coloniesData;
  };

  const fetchReportData = async (reports: any[]) => {
    const reportsData = [];
    const coloniesData = [];

    for (const report of reports) {

      try {
        const reportData = await getReportByIdFromServer(report) as ColonyReport;

        if (reportData && reportData.colony) {
          // reportData.id = report.id;

          // Extract the necessary data from the colony document
          const colonyData = await getColoniesByIdFromServer(reportData.colony)

          // Fetch cat data for fed cats
          // const fedCatsData = await fetchCatData(reportData.catsFed);
          // reportData.catsFed = fedCatsData;

          // const catsMissingData = await fetchCatData(reportData.catsMissing);
          // reportData.catsMissing = catsMissingData;

          const userData = await fetchUserData(reportData.user);
          if (userData !== null) {
            reportData.user = userData;
          }
          reportsData.push(reportData);
          coloniesData.push(colonyData)
        }
        setReportColoniesData(coloniesData)

      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }

    return reportsData;
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
          <div className="loading-container">
            <h5>Loading <span className="loading-dots"></span></h5>
            <img src="src/assets/loading/catloading.gif" alt="Loading" />
          </div>
        ) : (
          <div>
            <div className="header">
              <img src={userData?.data.profilePicture} alt="Cat Logo" className="logo" />
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
            {isPopupOpen && userData && <ColoniesPopup isOpen={isPopupOpen} userId={userData?.id} onClose={() => setIsPopupOpen(false)} onSave={handleSaveColonies} />}
          </div>
        )}
      </IonContent >
    </IonPage >
  );
};

export default Profile;
