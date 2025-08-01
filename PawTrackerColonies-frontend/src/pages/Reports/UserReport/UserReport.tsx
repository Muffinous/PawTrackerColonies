import React, { useState, useEffect } from 'react';
import './UserReport.css';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonModal, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonGrid, IonRow, IonCol } from '@ionic/react';

import ColonyReport from '../../../models/ColonyReport';
import { useHistory, useParams } from 'react-router-dom';
import Colony from '../../../models/Colony';
import { callOutline, close, mailOutline } from 'ionicons/icons';
import { Cat } from '../../../models/Cat';
import { useUser } from '../../../components/contexts/UserContextType';
import ReportsService from '../../../services/report.service';
import catPlaceholderImage from '../../../assets/placeholders/cat-placeholder.png';
import userPlaceholderImage from '../../../assets/placeholders/user-placeholder.png';
import { getDateValue, getHoursValue } from '../../../services/date.service';

const UserReport: React.FC = () => {
    const [dataReport, setReportData] = useState<ColonyReport | null>(null);
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    let dateReport = { day: 1, month: 1, year: 2024, hour: 13, minutes: 0 }
    const [loading, setLoading] = useState(true); // Added loading state
    const [catImages, setCatImages] = useState<{ [catId: string]: string }>({}); // State to store cat image URLs

    const [fedCats, setFedCats] = useState<Cat[]>([]); // State to store cat image URLs
    const [missingCats, setMissingCats] = useState<Cat[]>([]); // State to store cat image URLs
    const [colony, setColonyData] = useState<Colony>(); // State to store cat image URLs
    const { user } = useUser();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isOpen, setIsOpen] = React.useState(false);
    const [catImgUrl, setCatImgUrl] = useState<string>(catPlaceholderImage);
    const [openCats, setOpenCats] = useState<{ [catId: string]: boolean }>({});


    useEffect(() => {
        if (!user?.uid) return;

        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const reportData = await fetchReportData();

                if (reportData) {
                    setReportData(reportData);
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
    }, [id]);


    const fetchReportData = async () => {
        try {
            const reportData = await ReportsService.getReportById(id);

            console.log("REPORT DATA  ", reportData, id)

            return reportData
        } catch (error) {
            console.error("Error fetching colony data:", error);
            return null;
        }
    };

    const handlePopupClose = () => {
        // Close the modal
        history.goBack(); // This assumes you want to go back to the previous page
    };


    const getDateHoursValue = () => {
        let date = null;
        if (dataReport?.datetime) {
            const reportDate = new Date(dataReport?.datetime?.seconds * 1000);

            date = reportDate.getDate() + '/' + reportDate.getMonth() + 1 + '/' + reportDate.getFullYear()
        }
        return date
    }

    useEffect(() => {
        if (!dataReport?.catsFed) return;
        const fetchImages = async () => {
            const token = localStorage.getItem('token');

            const urls: { [catId: string]: string } = {};
            for (const { cat } of dataReport.catsFed) {
                if (cat?.img) {
                    try {
                        const res = await fetch(`${apiUrl}/${cat.img}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                            const blob = await res.blob();
                            if (cat.id != null) {
                                urls[cat.id] = URL.createObjectURL(blob);
                            }
                        } else {
                            if (cat.id != null) {
                                urls[cat.id] = catPlaceholderImage;
                            }
                        }
                    } catch {
                        if (cat.id != null) {
                            urls[cat.id] = catPlaceholderImage;
                        }
                    }
                } else {
                    if (cat.id != null) {
                        urls[cat.id] = catPlaceholderImage;
                    }
                }
            }
            setCatImages(urls);
        };
        fetchImages();
    }, [dataReport, apiUrl, user]);


    return (
        <IonModal isOpen={true} onDidDismiss={handlePopupClose}>
            <IonHeader>

                <IonToolbar>
                    {dataReport && (
                        <>
                            <IonTitle>
                                Report for {colony?.name} Colony - {getDateValue(dataReport!.datetime)}
                            </IonTitle>
                        </>
                    )}
                    <IonButton slot="end" onClick={handlePopupClose}>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent className="report-container">
                {loading ? (
                    <div className="loading-container">
                        <h5>Loading <span className="loading-dots"></span></h5>
                        <img src="src/assets/loading/catloading.gif" alt="Loading" />
                    </div>
                ) : (
                    <div>
                        {dataReport ? ( // Change the condition
                            <div>
                                <IonCard>
                                    <IonCardContent>
                                        <div className="report-details">
                                            <IonCardTitle>{dataReport.colony?.name}</IonCardTitle>
                                            {dataReport && (
                                                <>
                                                    <IonLabel className="date-label">{getDateValue(dataReport!.datetime)}</IonLabel>
                                                </>
                                            )}
                                        </div>
                                        <div className="hour-details">
                                            {dataReport && (<>
                                                <IonLabel className="hours-label">{getHoursValue(dataReport!.datetime)}</IonLabel>
                                            </>)}
                                        </div>
                                    </IonCardContent>
                                </IonCard>

                                <IonCard key={1} className="report-card-user">
                                    <IonCardHeader>
                                        <div className="summary-title">
                                            <h6> - Feeder - </h6>
                                        </div>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="feeder-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ flex: 1 }}>
                                                <div className="feeder-header" style={{ marginBottom: '1rem' }}>
                                                    <div className="feeder-name-section">
                                                        <div className="dot-line">&middot; &middot; &middot; &middot; &middot; &middot; &middot;</div>
                                                        <p className="feeder-name">{dataReport.user.name} {dataReport.user.lastname}</p>
                                                        <div className="dot-line">&middot; &middot; &middot; &middot; &middot; &middot; &middot;</div>
                                                    </div>
                                                </div>
                                                <div className="feeder-info">
                                                    <div className="feeder-contact">
                                                        <IonIcon icon={mailOutline} className="contact-icon" />
                                                        <a href={`mailto:${dataReport.user.email}`}>{dataReport.user.email}</a>
                                                    </div>
                                                    <div className="feeder-contact">
                                                        <IonIcon icon={callOutline} className="contact-icon" />
                                                        <a href={`tel:${dataReport.user.phoneNumber}`}>{dataReport.user.phoneNumber}</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="feeder-profile">
                                                <img
                                                    className="profile-picture"
                                                    alt="Profile image"
                                                    src={dataReport.user?.profilePicture || userPlaceholderImage}
                                                /> 
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>


                                <IonCard key={2} className="report-card-buddies">
                                    <IonCardHeader>
                                        <div className="summary-title">
                                            <h6> - Buddies seen  - </h6>
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
                                                    {fedCats.map((cat, index) => (
                                                        <IonCol size="6" key={index}>
                                                        </IonCol>
                                                    ))}
                                                </IonRow>
                                            </IonGrid>
                                        </div>
                                        {dataReport.catsFed.map(({ cat }, index) => {
                                            return (
                                                <div className="cat-card-layout" key={index}>
                                                    <div className="cat-header" onClick={() => setIsOpen(!isOpen)}>
                                                        <img
                                                            src={cat.id != null ? catImages[cat.id] || catPlaceholderImage : catPlaceholderImage}
                                                            alt={cat.name}
                                                            className="cat-image"
                                                        />
                                                        <h3 className="catName">{cat.name}</h3>
                                                        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>

                                                    </div>
                                                    {isOpen && (
                                                        <div className="cat-info">
                                                            <p><strong>Color:</strong> {cat.furColor}</p>
                                                            <p><strong>Edad aprox.:</strong> {cat.approximateAge ?? 'N/D'}</p>
                                                            <p><strong>Esterilización:</strong> {cat.spayedNeutered ? 'Sí' : 'No'}</p>
                                                            <p><strong>Género:</strong> {cat.gender === 'F' ? 'Hembra' : 'Macho'}</p>
                                                            {cat.observations && <p><strong>Notas:</strong> {cat.observations}</p>}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

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
                                                    {missingCats.map((cat, index) => (
                                                        <IonCol size="6" key={index}>
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