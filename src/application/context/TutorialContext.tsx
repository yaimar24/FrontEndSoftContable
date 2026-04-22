import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Joyride, STATUS, EVENTS } from 'react-joyride';
import type { Step, EventData } from 'react-joyride';

interface TutorialContextType {
  runTutorial: boolean;
  startTutorial: () => void;
  stopTutorial: () => void;
  setSteps: (steps: Step[]) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial debe ser usado dentro de un TutorialProvider');
  }
  return context;
};

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [runTutorial, setRunTutorial] = useState(false);
  const [steps, setStepsState] = useState<Step[]>([]);
  const [key, setKey] = useState(0);

  const setSteps = useCallback((newSteps: Step[]) => {
    setRunTutorial(false);
    setStepsState(newSteps);
    setKey(k => k + 1);
  }, []);

  const startTutorial = useCallback(() => {
    if (steps.length > 0) {
      setKey(k => k + 1);
      setRunTutorial(true);
    }
  }, [steps]);

  const stopTutorial = useCallback(() => {
    setRunTutorial(false);
  }, []);

  const handleJoyrideEvent = useCallback((data: EventData) => {
    const { status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as typeof STATUS.FINISHED)) {
      setRunTutorial(false);
    }

    if (type === EVENTS.TARGET_NOT_FOUND || type === EVENTS.ERROR) {
      setRunTutorial(false);
    }
  }, []);

  return (
    <TutorialContext.Provider value={{ runTutorial, startTutorial, stopTutorial, setSteps }}>
      {children}
      <Joyride
        key={key}
        onEvent={handleJoyrideEvent}
        continuous
        run={runTutorial}
        scrollToFirstStep
        steps={steps}
        options={{
          primaryColor: '#3b82f6',
          overlayColor: 'rgba(15, 23, 42, 0.45)',
          showProgress: true,
          skipBeacon: true,
          buttons: ['back', 'primary', 'skip'],
          targetWaitTimeout: 500,
        }}
        locale={{
          back: 'Atrás',
          close: 'Cerrar',
          last: 'Finalizar',
          next: 'Siguiente',
          skip: 'Saltar tutorial',
        }}
      />
    </TutorialContext.Provider>
  );
};
