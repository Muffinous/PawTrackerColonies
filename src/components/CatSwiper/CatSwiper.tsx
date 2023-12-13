// CatSwiper.tsx
import React, { useEffect, useState } from 'react';
import './CatSwiper.css'; // You can customize styles in this file
import { IonIcon } from '@ionic/react';
import { checkmarkDone, createOutline } from 'ionicons/icons';
import { saveColonyReport } from '@services/coloniesService';

interface CatSwiperProps {
  cats: Cat[];
  onClose: () => void;
}

const CatSwiper: React.FC<CatSwiperProps> = ({ cats, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [missingAnimals, setMissingAnimals] = useState<Cat[]>([]);
  const [fedAnimals, setFedAnimals] = useState<Cat[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [catDescriptions, setCatDescriptions] = useState<{ [key: number]: string }>({});
  const [editingCatId, setEditingCatId] = useState<number | null>(null);

  const handleNext = () => {

    setCurrentIndex((prevIndex) => (prevIndex + 1) % cats.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cats.length) % cats.length);
  };

  const handleFeed = () => {
    setFedAnimals((prevFedAnimals) => [...prevFedAnimals, cats[currentIndex]]);
    console.log(`Fed cat: ${cats[currentIndex].name}`);
    handleNext();
  };

  const handleMissing = () => {
    setMissingAnimals((prevMissingAnimals) => [...prevMissingAnimals, cats[currentIndex]]);
    console.log(`Reported missing cat: ${cats[currentIndex].name}`);
    handleNext();
  };

  const handleDescriptionChange = (description: string, catId: number) => {
    setCatDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [catId]: description,
    }));
  };

  const handleSaveDescription = () => {
    setEditingCatId(null);
  };

  const handleEditDescription = (catId: number) => {
    setEditingCatId(catId);
  };

  const handleSaveReport = () => {
    // logic to save the report
    const report = {
      fedAnimals,
      missingAnimals,
      catDescriptions,
    };

    console.log('Saving report...');
    const response = saveColonyReport(report);

    if (response) {
      onClose();
    }
  };

  useEffect(() => {
    // Check if the user has interacted with all animals
    console.log("fedAnimals.length + missingAnimals.length ", fedAnimals.length + missingAnimals.length, "cats.length", cats.length)
    if (fedAnimals.length + missingAnimals.length === cats.length) {
      setShowSummary(true);
      console.log("Descriptions ", catDescriptions)
      console.log("Cats missing ", missingAnimals)
      console.log("Cats fed ", fedAnimals)
    }
  }, [fedAnimals, missingAnimals, cats]);

  return (
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
                        value={catDescriptions[fedCat.id] || ''}
                        onChange={(e) => handleDescriptionChange(e.target.value, fedCat.id)}
                      />
                      <span onClick={() => handleSaveDescription()} className="edit-icon">
                        <IonIcon icon={checkmarkDone} />
                      </span>
                    </div>
                  ) : (
                    <div className="edit-container">
                      <p>{catDescriptions[fedCat.id] || 'No description provided'}</p>
                      <span onClick={() => handleEditDescription(fedCat.id)} className="edit-icon">
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
                        value={catDescriptions[missingCat.id] || ''}
                        onChange={(e) => handleDescriptionChange(e.target.value, missingCat.id)}
                      />
                      <span onClick={() => handleSaveDescription()} className="edit-icon">
                        <IonIcon icon={checkmarkDone} />
                      </span>
                    </div>
                  ) : (
                    <div className="edit-container">
                      <p>{catDescriptions[missingCat.id] || 'No description provided'}</p>
                      <span onClick={() => handleEditDescription(missingCat.id)} className="edit-icon">
                        <IonIcon icon={createOutline} />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="save-report-button" id="saveReportButton">
              <button onClick={handleSaveReport}>Save Report</button>
            </div>
          </div>
        ) : (
          <>
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
            <div className="cat-swiper">
              <img src={cats[currentIndex].image} alt={cats[currentIndex].name} />
              <div className="cat-info">
                <h2>{cats[currentIndex].name.toUpperCase()}</h2>
              </div>
              <div className="swipe-actions">
                <button onClick={() => handleFeed()}>Feed</button>
                <button onClick={() => handleMissing()}>Missing</button>
              </div>
            </div>
          </>
        )}
      </div>
      {!showSummary && (
        <div className="cat-swiper-container">
          <textarea
            className="cat-description"
            placeholder="Describe any unusual behavior, health concerns, or additional notes..."
            value={catDescriptions[cats[currentIndex].id] || ''}
            onChange={(e) => handleDescriptionChange(e.target.value, cats[currentIndex].id)}
          />
        </div>
      )}
    </div>

  );
};

export default CatSwiper;
