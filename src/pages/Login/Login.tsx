import React, { useState } from 'react';
import './Login.css';
import { IonInput, IonButton, IonContent, IonPage, IonIcon, IonToolbar, IonHeader, IonTitle, IonRouterLink, IonLoading, useIonRouter, IonToast } from '@ionic/react';
import { pawOutline } from 'ionicons/icons';
import pawLogo from '../../assets/pawlogo.png';
import { useHistory } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import User from '../../types/User';

import { getFirestore, collection, getDocs, query, DocumentData, where, doc, getDoc } from 'firebase/firestore';

const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useIonRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ id: string; data: User } | null>(null);

  const firestore = getFirestore();
  const auth = getAuth();

  const redirectToRegister = () => {
    navigation.push('/register', 'forward', 'replace');
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Validate that the username is not empty or contains invalid characters
      if (!username || /[.#$[\]]/.test(username)) {
        setLoading(false);
        throw new Error('Invalid username');
      }

      try {
        const usersCollection = collection(firestore, 'users');
        console.log("usersCollection ", usersCollection)
        const queryByUsername = query(usersCollection, where('username', '==', username));
        console.log("userquery ", queryByUsername)
        const snapshot = await getDocs(queryByUsername);

        console.log("snapshot ", snapshot.docs)
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
            console.log('Username exists! Document ID:', documentId, userData);
            console.log('Mail: ', userData.email, 'username: ', username, 'pass: ', password);
            setUserData({ id: documentId, data: userData });
            sessionStorage.setItem('user', JSON.stringify({id:documentId, userData}));

            await signInWithEmailAndPassword(auth, userData.email, password);

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
          <IonInput type="text" placeholder="Username" value={username} onIonChange={(e) => setUsername(e.detail.value!)} className="input-field" />
          <IonInput type="password" placeholder="Password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} className="input-field" />
          <IonButton expand="full" className="login-button" onClick={handleLogin}>
            Login
          </IonButton>
          <p className="login-link">
            If you want to create an account,{' '}
            <IonRouterLink onClick={redirectToRegister}>register here</IonRouterLink>.
          </p>
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

