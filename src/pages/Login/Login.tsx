import React, { useState } from 'react';
import './Login.css';
import { IonInput, IonButton, IonContent, IonPage, IonIcon, IonToolbar, IonHeader, IonTitle, IonRouterLink, IonLoading } from '@ionic/react';
import { pawOutline } from 'ionicons/icons';
import pawLogo from '../../assets/pawlogo.png';
import { useHistory } from 'react-router-dom';
// import firebase from 'firebase/app';
// import 'firebase/auth';

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectToRegister = () => {
    history.push('/register');
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
    //   await firebase.auth().signInWithEmailAndPassword(email, password);
      // Redirect to the home page or any other page upon successful login
      history.push('/home');
    } catch (error) {
    //   console.error('Login error:', error.message);
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
          <IonInput type="text" placeholder="Email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} className="input-field" />
          <IonInput type="password" placeholder="Password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} className="input-field" />
          <IonButton expand="full" className="login-button" onClick={handleLogin}>
            Login
          </IonButton>
          <p className="login-link">
            If you want to create an account,{' '}
            <IonRouterLink onClick={redirectToRegister}>register here</IonRouterLink>.
          </p>
          <IonLoading isOpen={loading} message={'Logging in...'} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
