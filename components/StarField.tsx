import React from 'react';
import Starfield from 'react-starfield';

const StarField = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: "absolute", left: 0, top: 0 }}>
      <Starfield
        starCount={17000}
        starColor={[255, 255, 255]}
        speedFactor={0.05}
        // backgroundColor="black"
      />
      
    </div>
  );
};

export default StarField;