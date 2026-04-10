import React from 'react';
import './ShinyText.css';

export const ShinyText = ({ text, className = "" }) => {
  return (
    <span className={`shiny-text ${className}`}>
      {text}
    </span>
  );
};
