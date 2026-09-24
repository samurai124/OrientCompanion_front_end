import React from "react";

export default function BrandLogo({ size = 20, className = "", style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M14 2L2 8L14 14L26 8L14 2Z" fill="currentColor" />
      <path
        d="M4 11.5V17.5C4 21 8.5 24 14 24C19.5 24 24 21 24 17.5V11.5L14 16.5L4 11.5Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
      <path d="M26 10V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export { BrandLogo as SchoolLogoIcon, BrandLogo as BrandLogoIcon };
