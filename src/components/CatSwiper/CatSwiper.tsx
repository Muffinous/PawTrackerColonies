// CatSwiper.tsx
import React, { useEffect, useState } from 'react';
import './CatSwiper.css'; // You can customize styles in this file
import { IonButton, IonContent, IonIcon } from '@ionic/react';
import { checkmarkDone, createOutline } from 'ionicons/icons';
import { getColoniesCats, saveColonyReport } from '../../services/coloniesService';
import { getStorage } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ColonyReport from '../../models/ColonyReport';
import { Timestamp } from 'firebase/firestore';
import { Cat } from '../../models/Cat';

interface CatSwiperProps {
  colonyId: string;
  onClose: () => void;
}

const CatSwiper: React.FC<CatSwiperProps> = ({ colonyId, onClose }) => {
  const [fedAnimals, setFedAnimals] = useState<Cat[]>([]);
  const [missingAnimals, setMissingAnimals] = useState<Cat[]>([]);
  const [cats, setCatsInfo] = useState<Cat[]>(/* Initial value */);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [catDescriptions, setCatDescriptions] = useState<{ [key: string]: string }>({});
  const [editingCatId, setEditingCatId] = useState<string>();
  const [loading, setLoading] = useState(true); // Added loading state
  const auth = getAuth();

  const handleNext = () => {
    if (cats && cats.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cats.length);
    }
  };

  const handlePrevious = () => {
    if (cats && cats.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + cats.length) % cats.length);
    }
  };

  const handleFeed = () => {
    if (cats && cats.length > 0) {
      setFedAnimals((prevFedAnimals) => [...prevFedAnimals, cats[currentIndex]]);
      console.log(`Fed cat: ${cats[currentIndex].name}`);
      handleNext();
    }
  };

  const handleMissing = () => {
    if (cats && cats.length > 0) {
      setMissingAnimals((prevMissingAnimals) => [...prevMissingAnimals, cats[currentIndex]]);
      console.log(`Reported missing cat: ${cats[currentIndex].name}`);
      handleNext();
    }
  };

  const handleDescriptionChange = (description: string, catId: string) => {
    setCatDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [catId]: description,
    }));
  };

  const handleSaveDescription = (catId: string) => {
    setEditingCatId(catId);
  };

  const handleEditDescription = (catId: string) => {
    setEditingCatId(catId);
  };

  const handleSaveReport = async () => {
    const user = auth.currentUser;
    if (user) {
      const storedUser = sessionStorage.getItem('user');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const currentDateTime = new Date();
        // Create a Firestore timestamp
        const firestoreTimestamp = Timestamp.fromDate(currentDateTime);

        if (parsedUser && parsedUser.userData && parsedUser.id) {
          const fedAnimalIds = fedAnimals.map((cat) => cat.id).filter((id) => id !== undefined) as string[];
          const missingAnimalIds = missingAnimals.map((cat) => cat.id).filter((id) => id !== undefined) as string[];

          // logic to save the report
          const report: ColonyReport = {
            colony: colonyId,
            catsFed: fedAnimalIds,
            catsMissing: missingAnimalIds,
            catDescriptions: catDescriptions,
            user: parsedUser.id,
            datetime: firestoreTimestamp,
          };

          console.log('Saving report...', report);
          const response = await saveColonyReport(report);

          if (response) {
            onClose();
          }
        }
      }
    }
  };

  useEffect(() => {
    // Check if the user has interacted with all animals
    console.log("catsss ", cats)
    if (cats && cats.length > 0) {
      console.log("fedAnimals.length + missingAnimals.length ", fedAnimals.length + missingAnimals.length, "cats.length", cats.length)
      if ((fedAnimals.length + missingAnimals.length) === cats.length) {
        setShowSummary(true);
        console.log("Descriptions ", catDescriptions)
        console.log("Cats missing ", missingAnimals)
        console.log("Cats fed ", fedAnimals)
      }
    }
  }, [fedAnimals, missingAnimals, cats]);

  useEffect(() => {
    let isMounted = true;

    const fetchCatsData = async () => {
      try {
        const catsColony = await getColoniesCats(colonyId) as Cat[];
        console.log("Colonies cats retrieved", catsColony);

        if (isMounted) {
          setLoading(false);
          // Ensure that catsColony is not undefined before updating state
          if (catsColony) {
            setCatsInfo(catsColony);
          }
        }
      } catch (error) {
        console.error('Error fetching existing reports:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCatsData();

    // Cleanup function to prevent state updates on unmounted components
    return () => {
      isMounted = false;
    };
  }, [colonyId]);


  return (

    <div>
      {loading ? (
        <div className="loading-container">
          <h5>Loading <span className="loading-dots"></span></h5>
          <img src="src/assets/loading/catloading.gif" alt="Loading" />
        </div>
      ) : (
        <div>
          <div className="cat-swiper-container">
            {showSummary ? (
              <div className="summary">
                <div className="summary-header">
                  <h2>Summary</h2>
                </div>
                <div className="summary-title">
                  <h3>- Buddies seen - </h3>
                </div>
                <div>
                  {fedAnimals.map((fedCat) => (
                    <div key={fedCat.id} className="cat-summary-item">
                      <h4>{`${fedCat.name.charAt(0).toUpperCase()}${fedCat.name.slice(1).toLowerCase()}`}</h4>
                      {editingCatId === fedCat.id ? (
                        <div className="save-container">
                          <textarea
                            className="cat-description"
                            placeholder="Describe any unusual behavior, health concerns, or additional notes..."
                            value={catDescriptions[fedCat.id || ''] || ''}
                            onChange={(e) => {
                              if (fedCat.id) {
                                handleDescriptionChange(e.target.value, fedCat.id);
                              }
                            }}
                          />
                          <span onClick={() => {
                            if (fedCat.id) {
                              handleSaveDescription(fedCat.id);
                            }
                          }} className="edit-icon">
                            <IonIcon icon={checkmarkDone} />
                          </span>

                        </div>
                      ) : (
                        <div className="edit-container">
                          <p>{fedCat.id ? catDescriptions[fedCat.id] || 'No description provided' : 'No description provided'}</p>
                          <span onClick={() => {
                            if (fedCat.id) {
                              handleEditDescription(fedCat.id)
                            }
                          }}
                            className="edit-icon">
                            <IonIcon icon={createOutline} />
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="summary-title">
                  <h3>- Missing Buddies - </h3>
                </div>
                <div>
                  {missingAnimals.map((missingCat) => (
                    <div key={missingCat.id} className='cat-summary-item'>
                      <h4>{`${missingCat.name.charAt(0).toUpperCase()}${missingCat.name.slice(1).toLowerCase()}`}</h4>
                      {editingCatId === missingCat.id ? (
                        <div className="save-container">
                          <textarea
                            className="cat-description"
                            placeholder="Describe any unusual behavior, health concerns, or additional notes..."
                            value={catDescriptions[missingCat.id || ''] || ''}
                            onChange={(e) => handleDescriptionChange(e.target.value, missingCat.id || '')}
                          />
                          <span onClick={() => {
                            if (missingCat.id) {
                              handleSaveDescription(missingCat.id)
                            }
                          }}
                            className="edit-icon">
                            <IonIcon icon={checkmarkDone} />
                          </span>
                        </div>
                      ) : (
                        <div className="edit-container">
                          <p>{missingCat.id ? catDescriptions[missingCat.id] || 'No description provided' : 'No description provided'}</p>
                          <span onClick={() => {
                            if (missingCat.id) {
                              handleEditDescription(missingCat.id)
                            }
                          }}
                            className="edit-icon">
                            <IonIcon icon={createOutline} />
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="save-report-button" id="saveReportButton">
                  <IonButton shape="round" onClick={handleSaveReport}>Save Report</IonButton>
                </div>
              </div>
            ) : (
              <div>
                {cats && (
                  <div className="top-buttons">
                    <div className="top-left">
                      <button onClick={handlePrevious} disabled={currentIndex === 0}>
                        Previous
                      </button>
                    </div>
                    <div className="top-right">
                      <button onClick={handleNext} disabled={currentIndex === cats.length - 1}>
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {cats && currentIndex >= 0 && currentIndex < cats.length && (
                  <div className="cat-swiper">
                    <img src={cats[currentIndex]?.img} alt={cats[currentIndex]?.name} />

                    <div className="cat-info">
                      <h2>{cats[currentIndex]?.name.toUpperCase()}</h2>

                    </div>
                    <div className="swipe-actions">
                      <button onClick={() => handleFeed()}>Feed</button>
                      <button onClick={() => handleMissing()}>Missing</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {!showSummary && cats && (
            <div className="cat-swiper-container">
              <textarea
                className="cat-description"
                placeholder="Describe any unusual behavior, health concerns, or additional notes..."
                // value={catDescriptions[cats[currentIndex].id] || ''}
                onChange={(e) => handleDescriptionChange(e.target.value, cats[currentIndex].id || '')}
              />
            </div>
          )}
        </div>
      )}
    </div>

  );
};

export default CatSwiper;
