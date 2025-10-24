import React from 'react';

/**
 * Renders the Spark Sync logo as an image.
 * This component now uses an <img> tag to display the official logo file,
 * ensuring brand accuracy as requested.
 * It accepts standard image attributes like className for flexible styling.
 */
export const LogoIcon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img
    src="https://i.ibb.co.com/Pvw8P2zm/Spark-Sync.png"
    alt="Spark Sync Logo"
    {...props}
  />
);
