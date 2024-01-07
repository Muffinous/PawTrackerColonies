import React, { useState, useEffect } from 'react';
import './UserReport.css';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonModal, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import pawLogo from '../../../assets/pawlogo.png';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

import { DocumentReference, collection, getDoc, getFirestore } from 'firebase/firestore';
import ColonyReport from '../../../types/ColonyReport';
import { useHistory, useParams } from 'react-router-dom';
import { getReportByIdFromServer } from '../../../services/reportsService';
import Colony from '../../../types/Colony';
import User from '../../../types/User';
import { close } from 'ionicons/icons';
import { Auth, getAuth } from 'firebase/auth';


const UserReport: React.FC = () => {
    const [dataReport, setReportData] = useState<ColonyReport>();
    const { reportId } = useParams<{ reportId: string }>(); // Get the reportId from the URL parameters
    const history = useHistory();
    let dateReport = { day: 1, month: 1, year: 2024, hour: 13, minutes: 0 }
    const [loading, setLoading] = useState(true); // Added loading state
    const [catImages, setCatImages] = useState<string[]>([]); // State to store cat image URLs
    const auth = getAuth();


    useEffect(() => {
        let isMounted = true;

        const fetchExistingReports = async () => {
            try {
                console.log("REPORT ID ", reportId)
                // Fetch the report details using the reportId
                const reportData = await getReportByIdFromServer(reportId) as ColonyReport;

                console.log("reportData ", reportData)
                // Fetch additional data (colony, user, cats) if needed
                const colonyData = await fetchColonyData(reportData.colony);
                const userData = await fetchUserData(reportData.user);
                const fedCatsData = await fetchCatData(reportData.catsFed);
                const missingCatsData = await fetchCatData(reportData.catsMissing);

                // Update the reportData with the fetched details
                if (colonyData != null) {
                    reportData.colony = colonyData;
                }
                if (userData) {
                    reportData.user = userData;
                }
                reportData.catsFed = fedCatsData;
                reportData.catsMissing = missingCatsData;
                if (reportData && reportData.datetime) {
                    // Attempt to convert to Date
                    const reportDate = new Date(reportData.datetime.seconds * 1000);

                    // Check if the conversion was successful
                    if (reportDate) {
                        dateReport.day = reportDate.getDate();
                        dateReport.month = reportDate.getMonth() + 1; // Month is zero-based
                        dateReport.year = reportDate.getFullYear();
                        dateReport.hour = reportDate.getHours();
                        dateReport.minutes = reportDate.getMinutes();

                        // Log the values after updating the state
                        console.log("dateReport", dateReport, reportDate.toLocaleDateString());
                        console.log("hours ", dateReport.hour);

                        // Update the state only if the component is still mounted
                        if (isMounted) {
                            setReportData(reportData);
                            setLoading(false);
                        }
                    } else {
                        console.error("Invalid datetime format:", reportData.datetime);

                        // Update the state only if the component is still mounted
                        if (isMounted) {
                            setLoading(false);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching existing reports:', error);

                // Update the state only if the component is still mounted
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchExistingReports();
    }, [reportId]);

    // Function to convert Firebase Timestamp to JavaScript Date
    const convertTimestampToDate = (timestamp: { seconds: number, nanoseconds: number }) => {
        const { seconds, nanoseconds } = timestamp;
        const milliseconds = seconds * 1000 + nanoseconds / 1e6;
        return new Date(milliseconds);
    };

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

                    if (catData && catData.img) {
                        // Fetch download URL for the cat image
                        const storage = getStorage();
                        const imageRef = ref(storage, catData.img);

                        const user = auth.currentUser;
                        if (user) {
                            try {
                                // If authenticated, get the download URL with the user's token
                                const imageURL = await getDownloadURL(imageRef);
                                catData.img = imageURL; // Replace the path with the actual URL
                            } catch (error) {
                                console.error('Error fetching download URL:', error);
                                // Handle the error, e.g., display a placeholder image
                                catData.img = 'path/to/placeholder-image.jpg';
                            }
                        } else {
                            // If the user is not authenticated, display a placeholder image
                            catData.img = 'path/to/placeholder-image.jpg';
                        }
                    }

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
        const catImageURLs = catsData.map(cat => cat.img);
        setCatImages(catImageURLs);

        return catsData;
    };

    const fetchUserData = async (userReference: any) => {
        try {
            const userDocSnapshot = await getDoc(userReference);
            const userData = userDocSnapshot.data() as User;
            userData.uid = userDocSnapshot.id;

            const storage = getStorage();
            const imageRef = ref(storage, userData.profilePicture);

            const user = auth.currentUser;
            if (user) {
                try {
                    // If authenticated, get the download URL with the user's token
                    const imageURL = await getDownloadURL(imageRef);
                    userData.profilePicture = imageURL; // Replace the path with the actual URL
                } catch (error) {
                    console.error('Error fetching download URL:', error);
                    // Handle the error, e.g., display a placeholder image
                    userData.profilePicture = 'path/to/placeholder-image.jpg';
                }
            } else {
                // If the user is not authenticated, display a placeholder image
                userData.profilePicture  = 'src/assets/placeholders/user-placeholder.png';
            }

            return userData;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null; // Handle the error accordingly in your application
        }
    };

    const handlePopupClose = () => {
        // Close the modal
        history.goBack(); // This assumes you want to go back to the previous page

        // Print a message to the console
        console.log('Popup closed');
    };

    const getDateValue = () => {
        const date = dateReport.day + '/' + dateReport.month + '/' + dateReport.year
        return date
    }

    const getDateHoursValue = () => {
        let date = '0:0'
        if (dataReport !== null && dataReport !== undefined) {
            const reportDate = new Date(dataReport.datetime.seconds * 1000);
            console.log("hours ", reportDate.getHours().toString())
            date = reportDate.getHours().toString() + ':' + reportDate.getMinutes().toString()
        }
        return date
    }

    return (
        <IonModal isOpen={true} onDidDismiss={handlePopupClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Report for {dataReport?.colony.name} Colony - {getDateValue()}
                    </IonTitle>
                    <IonButton slot="end" onClick={handlePopupClose}>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent className="report-container">
                {loading ? (
                    // Display a loading spinner or message while data is being fetched
                    <p>Loading...</p>
                ) : (
                    <div>
                        {dataReport ? ( // Change the condition
                            <div>
                                <IonCard>
                                    <IonCardContent>
                                        <div className="report-details">
                                            <IonCardTitle>{dataReport.colony.name}</IonCardTitle>
                                            <IonLabel className="date-label">{getDateValue()}</IonLabel>
                                        </div>
                                        <div className="hour-details">
                                            <IonLabel className="hours-label">{getDateHoursValue()}</IonLabel>
                                        </div>
                                    </IonCardContent>
                                </IonCard>

                                <IonCard key={1} className="report-card">
                                    <IonCardHeader>
                                        <div className="summary-title">
                                            <h6> - Feeder - </h6>
                                        </div>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="feeder-info">
                                            <h6>Feeder</h6>
                                            <p>{dataReport.user.name} {dataReport.user.lastname}</p>
                                        </div>
                                        <div className="feeder-profile">
                                            {/* Add profile picture here */}
                                            <img className="profile-picture" src={dataReport.user.profilePicture} alt="Profile" />
                                        </div>
                                    </IonCardContent>
                                </IonCard>

                                <IonCard key={2} className="report-card-buddies">
                                    <IonCardHeader>
                                        <div className="summary-title">
                                            <h6> - Buddies seen - </h6>
                                        </div>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="circle-box-container">
                                            <div>
                                                <p>{dataReport.user.name} saw</p>
                                            </div>
                                            <div className="circle-box">
                                                <p>{dataReport.catsFed.length}</p>
                                            </div>
                                            <div>
                                                <p>{dataReport.catsFed.length === 1 ? 'cat' : 'cats'} while feeding.</p>
                                            </div>
                                        </div>
                                        <div className='cats-fed'>
                                            <IonGrid>
                                                <IonRow>
                                                    {dataReport.catsFed.map((cat, index) => (
                                                        <IonCol size="6" key={index}>
                                                            <IonImg className="cat-img" src={cat.img} alt={`Cat ${index + 1}`} />
                                                        </IonCol>
                                                    ))}
                                                </IonRow>
                                            </IonGrid>
                                        </div>
                                    </IonCardContent>
                                </IonCard>

                                <IonCard key={3} className="report-card-buddies">
                                    <IonCardHeader>
                                        <div className="summary-title">
                                            <h6> - Buddies Missing - </h6>
                                        </div>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="circle-box-container">
                                            <div>
                                                <p>{dataReport.user.name} missed </p>
                                            </div>
                                            <div className="circle-box">
                                                <p>{dataReport.catsMissing.length}</p>
                                            </div>
                                            <div>
                                                <p>{dataReport.catsMissing.length === 1 ? 'cat' : 'cats'} while feeding.</p>
                                            </div>
                                        </div>
                                        <div className='cats-missing'>
                                            <IonGrid>
                                                <IonRow>
                                                    {dataReport.catsMissing.map((cat, index) => (
                                                        <IonCol size="6" key={index}>
                                                            <IonImg className="cat-img" src={cat.img} alt={`Cat ${index + 1}`} />
                                                        </IonCol>
                                                    ))}
                                                </IonRow>
                                            </IonGrid>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </div>
                        ) : (
                            <p>No report available.</p>
                        )}
                    </div>
                )}
            </IonContent>
        </IonModal>
    );
};

export default UserReport;