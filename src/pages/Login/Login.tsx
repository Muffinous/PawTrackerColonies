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
import { pawOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import pawLogo from '../../assets/pawlogo.png';
import { useHistory } from 'react-router-dom';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import User from '../../types/User';

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';

interface LoginProps {
  setIsAuthenticated: (isAuth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
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

  
  const firestore = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Si ya hay un usuario autenticado, redirige automáticamente
      history.push('/home');
    }
  }, [auth, history]);
  
  const redirectToRegister = () => {
    navigation.push('/register', 'forward', 'replace');
  };

  const redirectToPasswordRecovery = () => {
    history.push('/password-recovery'); // Replace '/password-recovery' with the actual path to your password recovery page
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Validate that the username is not empty or contains invalid characters
      if (!username || /[.#$[\]]/.test(username)) {
        setLoading(false);
        throw new Error('Invalid username.');
      }
      if (!password) {
        setLoading(false);
        throw new Error('You need to enter a password.');
      }
      try {
        const usersCollection = collection(firestore, 'users');
        const queryByUsername = query(
          usersCollection,
          where('username', '==', username)
        );
        const snapshot = await getDocs(queryByUsername);

        if (snapshot.size > 0) {
          // Get the first document in the snapshot
          const firstDocument = snapshot.docs[0];

          // Access the ID of the document and get the user data
          const documentId = firstDocument.id;
          const userDocRef = doc(usersCollection, documentId);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData: User = userDocSnapshot.data() as User;

          if (userData && userData.email) {
            // Use Firebase authentication to sign in with the retrieved email and password
            setUserData({ id: documentId, data: userData });
            sessionStorage.setItem(
              'user',
              JSON.stringify({ id: documentId, userData })
            );

            await signInWithEmailAndPassword(auth, userData.email, password);
            setIsAuthenticated(true);

            // Redirect to the home page or any other page upon successful login
            history.push('/home');
          } else {
            setLoading(false);
            // If username not found or no associated email, display an error message
            setErrorMessage('Invalid username or password');
          }
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage('Error getting users data.');
        console.error('Error fetching users:', error);
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please try again.');
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
          <img src={pawLogo} alt="Cat Logo" className="logo" />
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

          <IonButton expand="full" className="login-button" onClick={handleLogin}>
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
