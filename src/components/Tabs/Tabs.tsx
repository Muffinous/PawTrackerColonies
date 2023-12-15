// Tabs.tsx
import React, { ReactNode } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { home } from 'ionicons/icons';

interface TabsProps {
  children: ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet placeholder={undefined}>{children}</IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="settings" href="/home">
            <IonIcon icon={home} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default Tabs;
