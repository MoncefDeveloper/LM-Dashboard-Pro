import React from "react";
import './loader.css';

const Loader = () => {
  return (
    // <div className='triangles'>
    //   <div className='tri invert'></div>
    //   <div className='tri invert'></div>
    //   <div className='tri'></div>
    //   <div className='tri invert'></div>
    //   <div className='tri invert'></div>
    //   <div className='tri'></div>
    //   <div className='tri invert'></div>
    //   <div className='tri'></div>
    //   <div className='tri invert'></div>
    // </div>
    
      <svg className="loader" viewBox="0 0 100 100">
        <g className="points">
          <circle cx="50" cy="50" r="50" fill="#fff" className="ciw"></circle>
          <circle cx="5" cy="50" r="4" className="ci2"></circle>
          <circle cx="95" cy="50" r="4" className="ci1"></circle>
        </g>
      </svg>
  );
}

export default Loader;
