// CatSwiper.tsx
import React, { useEffect, useState } from 'react';
import './CatSwiper.css'; // You can customize styles in this file

interface Cat {
  id: number;
  image: string;
  name: string;
}

interface CatSwiperProps {
  cats: Cat[];
}

const CatSwiper: React.FC<CatSwiperProps> = ({ cats }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [missingAnimals, setMissingAnimals] = useState<Cat[]>([]);
  const [fedAnimals, setFedAnimals] = useState<Cat[]>([]);
  const [showSummary, setShowSummary] = useState(false);

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

  useEffect(() => {
    // Check if the user has interacted with all animals
    console.log("fedAnimals.length + missingAnimals.length ", fedAnimals.length + missingAnimals.length, "cats.length", cats.length)
    if (fedAnimals.length + missingAnimals.length === cats.length) {
      setShowSummary(true);
    }
  }, [fedAnimals, missingAnimals, cats]);

  return (
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
              <li key={fedCat.id}>{fedCat.name}</li>
            ))}
          </div>
          <div className="summary-title">
            <h3>- Missing Buddies - </h3>
          </div>
          <div>
            {missingAnimals.map((missingCat) => (
              <h5 key={missingCat.id}>{missingCat.name}</h5>
            ))}
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
              <h2>{cats[currentIndex].name}</h2>
            </div>
            <div className="swipe-actions">
              <button onClick={() => handleFeed()}>Feed</button>
              <button onClick={() => handleMissing()}>Missing</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CatSwiper;
