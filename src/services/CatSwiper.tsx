import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import "./CatSwiper.css";

interface Cat {
  id: number;
  image: string;
  name: string;
}

interface CatSwiperProps {
  cats: Cat[];
  onSwipe: (currentIndex: number, isRight: boolean) => void;
  onEnd: () => void; // Callback for reaching the end
}

const CatSwiper: React.FC<CatSwiperProps> = ({ cats, onSwipe, onEnd }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  const [style, set] = useSpring(() => ({
    x: 0,
    opacity: 1,
  }));

  const handleSwipe = (currentIndex: number, isRight: boolean) => {
    onSwipe(currentIndex, isRight);
    const nextIndex = isRight ? currentIndex + 1 : currentIndex - 1;

    set({
      x: isRight ? window.innerWidth : -window.innerWidth,
      opacity: 0,
      onRest: () => {
        if (nextIndex < cats.length && nextIndex >= 0) {
          setCurrentIndex(nextIndex);
          set({ x: 0, opacity: 1 });
        } else {
          // Reached the end of the cat list
          onEnd();
        }
      },
    });
  };

  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], distance, cancel }) => {
      if (isEnd) {
        // End of the list, show summary
        onEnd();
        return;
      }

      if (down && distance > window.innerWidth / 4) {
        const isRight = xDir > 0;
        const nextIndex = isRight ? currentIndex + 1 : currentIndex - 1;

        set({
          x: isRight ? window.innerWidth : -window.innerWidth,
          opacity: 0,
          onRest: () => {
            setCurrentIndex(nextIndex);
            set({ x: 0, opacity: 1 });
            onSwipe(currentIndex, isRight);

            // Check if it's the end of the list
            if (nextIndex === cats.length - 1) {
              setIsEnd(true);
            }
          },
        });

        cancel();
      } else {
        set({ x: down ? mx : 0, opacity: down ? 0.8 : 1 });
      }
    }
  );

  return (
    <animated.div
      className="cat-swiper"
      {...bind()}
      style={{
        ...style,
        backgroundImage: `url(${cats[currentIndex].image})`,
        backgroundSize: "cover",
      }}
    >
      <div className="cat-info">
        <h2>{cats[currentIndex].name}</h2>
      </div>
      <div className="swipe-actions">
        <button onClick={() => handleSwipe(currentIndex, true)}>Feed</button>
        <button onClick={() => handleSwipe(currentIndex, false)}>Missing</button>
      </div>
    </animated.div>
  );
};

export default CatSwiper;
