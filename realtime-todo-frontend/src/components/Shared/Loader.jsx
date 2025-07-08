import React from 'react';
import '../../styles/loader.css';

const Loader = ({ size = 48 }) => {
  return (
    <div className="loader-wrapper">
      <div
        className="spinner"
        style={{ width: `${size}px`, height: `${size}px` }}
      ></div>
    </div>
  );
};

export default Loader;
