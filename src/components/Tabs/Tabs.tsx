// Tabs.tsx
import React, { ReactNode } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { bookOutline, home, person, } from 'ionicons/icons';
import Home from '../../pages/Home/Home';
import { Route } from 'react-router';
import Reports from '../../pages/Reports/Reports';
import Profile from '../../pages/Profile/Profile';

interface TabsProps {
  children: ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  return (
    <IonTabs>
      <IonRouterOutlet placeholder={undefined}>
        <Route path="/home" component={Home} />
        <Route path="/reports" component={Reports} />
        <Route path="/profile" component={Profile} />
      </IonRouterOutlet>

      <IonTabBar slot='bottom'>
        <IonTabButton tab="Home" href="/home">
          <IonIcon icon={home}></IonIcon>
        </IonTabButton>
        <IonTabButton tab="Reports" href="/reports">
          <IonIcon icon={bookOutline}></IonIcon>
        </IonTabButton>
        <IonTabButton tab="Profile" href="/profile">
          <IonIcon icon={person}></IonIcon>
        </IonTabButton>
      </IonTabBar>

    </IonTabs>
  );
};

export default Tabs;
