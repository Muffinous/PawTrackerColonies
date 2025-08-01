import React, { useEffect, useState } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, useHistory } from "react-router-dom";

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
import RecoverPass from "./pages/RecoverPass/RecoverPass";
import MenuContent from "./components/MenuContent/MenuContent";
import EditProfile from "./pages/Settings/EditProfile/EditProfile";
import NewColony from "./components/NewColony/NewColony";
import RegisterCats from "./components/NewColony/RegisterCats/RegisterCats";
import { UserProvider, useUser } from "./components/contexts/UserContextType";
import UserReport from "./pages/Reports/UserReport/UserReport";
import ReportFeeding from "./components/ReportFeeding/ReportFeeding";
import AuthService from "./services/auth.service";
import AssignCatsToColony from "./components/NewColony/AssignCatsToColony/AssignCatsToColony";
import ColonyReviewPage from "./pages/ColonyReviewPage/ColonyReviewPage";
import FeedingCalendar from "./pages/FeedingCalendar/FeedingCalendar";

// Initialize Firebase

setupIonicReact();

const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const history = useHistory();
  const { user } = useUser();
  const { setUser } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      AuthService.validateToken(token).then((res) => {
        const isValid = res?.status === 200;
        if (isValid) {
          setIsAuthenticated(true);
          console.log("Token is valid, user is authenticated");

          AuthService.getCurrentUser(token).then((user) => {
            setUser(user); // setea el usuario en el contexto
            setIsAuthenticated(true);
          });

          if (window.location.pathname === "/login") {
            console.log("Redirecting to home from login");
            history.replace("/home");
          }
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      });
    } else {
      setIsAuthenticated(false);
    }
  }, []);


  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (window.location.pathname === "/login") {
    console.log("Redirecting to home from login");
    window.location.replace("/home"); // ✅ esto funciona siempre
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
                  <Route path="/new-cat" component={RegisterCats} />
                  <Route path="/register-cats" component={RegisterCats} />
                  <Route path="/report-feeding/:colonyId" component={ReportFeeding} exact />
                  <Route path="/user-report/:id" component={UserReport} exact />
                  <Route path="/user-report/:id" component={UserReport} exact />
                  <Route path="/assign-cats-to-colony" component={AssignCatsToColony} />
                  <Route path="/review-colony" component={ColonyReviewPage} />
                  <Route path="/calendar" component={FeedingCalendar} />
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
