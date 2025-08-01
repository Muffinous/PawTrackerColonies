import React, { useEffect, useState } from 'react';
import './Login.css';
import {
  IonInput,
  IonButton,
  IonContent,
  IonPage,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonRouterLink,
  IonLoading,
  IonToast,
  useIonRouter,
} from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import pawLogo from '../../assets/pawlogo.png';
import { useHistory } from 'react-router-dom';
import User from '../../models/User';
import pawLogoWhite from '../../assets/pawlogo-white.png';

import AuthService from '../../services/auth.service';
import { useUser } from '../../components/contexts/UserContextType';
import UserService from '../../services/user.service';

interface LoginProps {
  setIsAuthenticated: (isAuth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const { setUser } = useUser();
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useIonRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ id: string; data: User } | null>(
    null
  );
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  useEffect(() => {

  }, []);


  const redirectToRegister = () => {
    navigation.push('/register', 'forward', 'replace');
  };

  const redirectToPasswordRecovery = () => {
    history.push('/password-recovery'); // Replace '/password-recovery' with the actual path to your password recovery page
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      if (!username || !password) {
        setErrorMessage('Please enter username and password')
        throw new Error('Please enter username and password');
      }

      const loginData = { username, password };
      const { token, user } = await AuthService.login(loginData);

      // Guardar token (ejemplo: localStorage)
      localStorage.setItem('token', token);
      console.log("puto token ", localStorage.getItem('token'));

      console.log("token before username ", token, user)
      const fullUser = await UserService.getUserByUsername(username);

      setUser(fullUser);

      console.log("login user ", user, token)
      console.log("fulluser ", fullUser)

      // Guardar info usuario si quieres
      sessionStorage.setItem('user', JSON.stringify(fullUser));



      setIsAuthenticated(true);
      history.push('/home');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="app-title">Your App Name</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="login-container">
        <div className="login-form">
          <img src={isDarkMode ? pawLogoWhite : pawLogo} alt="Cat Logo" className="logo" />
          <h1>Login</h1>
          <IonInput
            placeholder="Username"
            value={username}
            onIonChange={(e) => setUsername(e.detail.value!)}
            className="input-field"
          />
          <div className="password-input-container">
            <IonInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              className="input-field password-input"
            >
              <div>
                <IonIcon
                  slot="end"
                  icon={showPassword ? eyeOffOutline : eyeOutline}
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

            </IonInput>

          </div>

          <IonButton expand="full" shape="round" className="login-button" onClick={handleLogin}>
            Login
          </IonButton>
          <div className="login-links">
            <p>If you want to create an account,{' '}
              <IonRouterLink onClick={redirectToRegister}>register here.</IonRouterLink></p>
            <p> Forgot Password? {' '}<IonRouterLink onClick={redirectToPasswordRecovery}>Recover your password.</IonRouterLink></p>
          </div>
          <IonToast
            isOpen={!!errorMessage}
            onDidDismiss={() => setErrorMessage(null)}
            message={errorMessage || ''}
            duration={3000} // Adjust duration as needed
          />
          <IonLoading isOpen={loading} message={'Logging in...'} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
