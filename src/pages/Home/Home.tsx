import React, { useState } from 'react';
import './Home.css';
import { IonInput, IonButton, IonContent, IonPage, IonIcon, IonToolbar, IonHeader, IonTitle, IonRouterLink, IonLoading } from '@ionic/react';
import pawLogo from '../../assets/pawlogo.png';
// import firebase from 'firebase/app';
// import 'firebase/auth';

const Home: React.FC = () => {
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
          <h1>Home</h1>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
