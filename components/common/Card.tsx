
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface dark:bg-surface-dark rounded-xl shadow-md overflow-hidden p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
