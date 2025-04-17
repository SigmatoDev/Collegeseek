// button.tsx
import React from 'react';

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ className, onClick, children }) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
);
