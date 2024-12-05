import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonIcon, IonButton, IonRouterLink, IonToast, IonLoading, useIonRouter } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import './RecoverPass.css';
import pawLogo from '../../assets/pawlogo.png';
import { useState } from 'react';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

const RecoverPass: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const auth = getAuth();
    const navigation = useIonRouter();

    const redirectToLogin = () => {
        history.push('/login');
    };

    const handleRecoverPassword = async () => {
        try {
            setLoading(true);
            // Validate email address
            if (!email) {
                throw new Error('Email address is required');
            }
            console.log("email ", email)
            // Generate a unique password reset token (you can use libraries like uuid or generate your own token)
            await sendPasswordResetEmail(auth, email);



            setLoading(false);
            setSuccessMessage('Password reset email sent successfully!');
        } catch (error) {
            setLoading(false);
            setErrorMessage('Error sending password reset email. Please try again.');
            console.error('Password recovery error:', error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle className="app-title">Your App Name</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="recoverpass-container">
                <div className="recoverpass-form">
                    <img src={pawLogo} alt="Cat Logo" className="logo" />
                    <h1>Recover your password</h1>
                    <IonInput
                        placeholder="Email"
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                        className="input-field"
                    />

                    <IonButton expand="full" className="login-button" onClick={handleRecoverPassword}>
                        Recover Password
                    </IonButton>
                    <div className="login-links">
                        <p>Go back to{' '}
                            <IonRouterLink onClick={redirectToLogin}>login.</IonRouterLink>
                        </p>
                    </div>
                    <IonToast
                        isOpen={!!errorMessage}
                        onDidDismiss={() => setErrorMessage(null)}
                        message={errorMessage || ''}
                        duration={3000} // Adjust duration as needed
                    />
                    <IonToast
                        isOpen={!!successMessage}
                        onDidDismiss={() => setSuccessMessage(null)}
                        message={successMessage || ''}
                        duration={3000} // Adjust duration as needed
                    />
                    <IonLoading isOpen={loading} message={'Sending email...'} />

                </div>
            </IonContent>
        </IonPage >
    );
}

export default RecoverPass;
