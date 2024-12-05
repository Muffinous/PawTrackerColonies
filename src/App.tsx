import React, { useState } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Page from "./pages/Page";

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
import Home from "./pages/Home/Home";
import ReportFeeding from "./components/ReportFeeding/ReportFeeding";
import Tabs from "./components/Tabs/Tabs";

setupIonicReact();
// index.tsx or App.tsx
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "./firebaseConfig";
import { getAuth } from "firebase/auth";
import UserReport from "./pages/Reports/UserReport/UserReport";
import RecoverPass from "./pages/RecoverPass/RecoverPass";
import MenuContent from "./components/MenuContent/MenuContent";
import EditProfile from "./pages/Settings/EditProfile/EditProfile";
import NewColony from "./components/NewColony/NewColony";
import RegisterCats from "./components/NewColony/RegisterCats/RegisterCats";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("APP Inicializada ", app)
setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <MenuContent /> {/* Your menu content component */}
          <IonRouterOutlet id="main" placeholder={undefined}>
            {/* {isAuthenticated ? ( */}
              {/* <> */}
                <Route path="/home" component={Tabs} />
                <Route path="/profile" component={Tabs} />
                <Route path="/reports" component={Tabs} />
                <Route path="/edit-profile" component={EditProfile} />
                <Route path="/new-colony" component={NewColony} />
                <Route path="/register-cats" component={RegisterCats} />
                <Redirect exact from="/" to="/home" />
              {/* </> */}
            {/* // ) : ( */}
              <>
                <Route path="/login" render={() => <Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" component={Register} />
                <Route path="/password-recovery" component={RecoverPass} />
                {/* <Redirect exact from="/" to="/login" /> */}
              </>
            {/* // )} */}
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
