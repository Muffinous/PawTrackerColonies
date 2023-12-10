import React, { useState } from 'react';
import './Register.css'; // Import the CSS file for styling
import { IonInput, IonButton, IonContent, IonPage, IonIcon, IonToolbar, IonHeader, IonTitle, IonRouterLink, IonLoading } from '@ionic/react';
import { pawOutline } from 'ionicons/icons';
import pawLogo from '../../assets/pawlogo.png'; // Import the cat image
import { useHistory } from 'react-router-dom';
//import firebase from 'firebase/app';
//import 'firebase/auth';
import ColonySelectionPopup from '../../components/ColoniesPopUp/ColoniesPopup'; // Import the new ColonySelectionPopup component
import ColoniesPopup from '../../components/ColoniesPopUp/ColoniesPopup';

const Register: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const redirectToLogin = () => {
    history.push('/login');
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      // Validate that the password and confirm password match
      if (password !== confirmPassword) {
        console.error("Passwords don't match");
        return;
      }

      // Create a new user in Firebase Authentication
      // await firebase.auth().createUserWithEmailAndPassword(email, password);

      // Show the popup after successful registration
      setShowPopup(true);
    } catch (error) {
      // console.error('Registration error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    // Redirect to the home page or any other page after the popup is closed
    console.log('navigated to home page');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="app-title">Your App Name</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="register-container">
        <div className="register-form">
          <img src={pawLogo} alt="Cat Logo" className="logo" />
          <h1>Register</h1>
          <IonInput type="text" placeholder="Email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} className="input-field" />
          <IonInput type="password" placeholder="Password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} className="input-field" />
          <IonInput
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onIonChange={(e) => setConfirmPassword(e.detail.value!)}
            className="input-field"
          />
          <IonButton expand="full" className="register-button" onClick={handleRegister}>
            Register
          </IonButton>
          <p className="register-link">
            Already have an account?{' '}
            <IonRouterLink onClick={redirectToLogin}>Login here</IonRouterLink>.
          </p>
          <IonLoading isOpen={loading} message={'Registering...'} />
          <ColoniesPopup isOpen={showPopup} onClose={handlePopupClose} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
