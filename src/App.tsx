import React, { useEffect, useState } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Tabs from "./components/Tabs/Tabs";

setupIonicReact();
// index.tsx or App.tsx
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "./firebaseConfig";
import RecoverPass from "./pages/RecoverPass/RecoverPass";
import MenuContent from "./components/MenuContent/MenuContent";
import EditProfile from "./pages/Settings/EditProfile/EditProfile";
import NewColony from "./components/NewColony/NewColony";
import RegisterCats from "./components/NewColony/RegisterCats/RegisterCats";
import { UserProvider } from "./components/contexts/UserContextType";

// Initialize Firebase

setupIonicReact();

const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    // Opcional: puedes mostrar un spinner mientras carga el estado de auth
    return <div>Loading...</div>;
  }
  return (
    <IonApp>
      <UserProvider>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            {isAuthenticated && <MenuContent />}
            <IonRouterOutlet id="main" placeholder={undefined}>
              {isAuthenticated ? (
                <>
                  <Route path="/home" component={Tabs} />
                  <Route path="/profile" component={Tabs} />
                  <Route path="/reports" component={Tabs} />
                  <Route path="/edit-profile" component={EditProfile} />
                  <Route path="/new-colony" component={NewColony} />
                  <Route path="/register-cats" component={RegisterCats} />
                  <Redirect exact from="/" to="/home" />
                  <Redirect exact from="/login" to="/home" />
                </>
              ) : (
                <>
                  <Route
                    path="/login"
                    render={() => <Login setIsAuthenticated={setIsAuthenticated} />}
                  />
                  <Route path="/register" component={Register} />
                  <Route path="/password-recovery" component={RecoverPass} />
                  <Redirect to="/login" />
                </>
              )}
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </UserProvider>
    </IonApp>
  );
};

export default App;
