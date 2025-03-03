'use client';
import { createContext, useContext, useState } from 'react';

interface RenderTriggerContextType {
  trigger: boolean;
  toggleTrigger: () => void;
}

const RenderTriggerContext = createContext<
  RenderTriggerContextType | undefined
>(undefined);

export const RenderTriggerProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [trigger, setTrigger] = useState(false);

  const toggleTrigger = () => setTrigger((prev) => !prev); // Toggle true/false

  return (
    <RenderTriggerContext.Provider value={{ trigger, toggleTrigger }}>
      {children}
    </RenderTriggerContext.Provider>
  );
};

// Hook untuk menggunakan context di mana saja
export const useRenderTrigger = () => {
  const context = useContext(RenderTriggerContext);
  if (!context) {
    throw new Error(
      'useRenderTrigger must be used within a RenderTriggerProvider'
    );
  }
  return context;
};
