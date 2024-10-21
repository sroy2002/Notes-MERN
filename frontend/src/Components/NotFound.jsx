import React, { useEffect, useRef } from "react";
// import { Player } from '@lottiefiles/react-lottie-player';
import lottie from "lottie-web";
import NoNoteFound from "../assets/not found.json";
import "../Styles/NotFound.scss";

const NotFound = () => {
  const animationContainer = useRef(null);
  const animationInstance = useRef(null);
  useEffect(() => {
    // Initialize the Lottie animation
    animationInstance.current = lottie.loadAnimation({
      container: animationContainer.current, // the DOM element to mount the animation on
      renderer: "svg",
      loop: true, // Disable loop for hover interaction
      autoplay: true, // Autoplay when component mounts
      animationData: NoNoteFound, // Use the imported animation data
    });

    // Clean up the animation on component unmount
    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy();
      }
    };
  }, []);

  const handleMouseEnter = () => {
    const startFrame = 30; // Specify the frame number you want to start from
    if (animationInstance.current) {
      animationInstance.current.goToAndStop(startFrame, true); // Go to the specified frame and stop there
      animationInstance.current.play(); // Play the animation from the specified frame
    }
  };

  return (
    <div className="searchError">
      <div
        ref={animationContainer}
        onMouseEnter={handleMouseEnter}
        className="lottie2"
      />
      <h3 className="poppins-regular">Oops! No notes found.</h3>
    </div>
  );
};

export default NotFound;
