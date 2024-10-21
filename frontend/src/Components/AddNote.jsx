import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../assets/add.json"; // Adjust the path to your animation JSON
import "../Styles/AddNote.scss";
const AddNote = () => {
  const animationContainer = useRef(null);
  const animationInstance = useRef(null);

  useEffect(() => {
    // Initialize the Lottie animation
    animationInstance.current = lottie.loadAnimation({
      container: animationContainer.current, // the DOM element to mount the animation on
      renderer: "svg",
      loop: false, // Disable loop for hover interaction
      autoplay: true, // Autoplay when component mounts
      animationData: animationData, // Use the imported animation data
    });

    // Clean up the animation on component unmount
    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy();
      }
    };
  }, []);

  // Function to replay the animation when hovered
  const handleMouseEnter = () => {
    const startFrame = 30; // Specify the frame number you want to start from
    if (animationInstance.current) {
      animationInstance.current.goToAndStop(startFrame, true); // Go to the specified frame and stop there
      animationInstance.current.play(); // Play the animation from the specified frame
    }
  };

  return (
    <div className="addnote">
      <div
        ref={animationContainer}
        onMouseEnter={handleMouseEnter}
        className="lottie1"
      />
      <h3 className="poppins-regular"> Start adding notes!</h3>
    </div>
  );
};

export default AddNote;
