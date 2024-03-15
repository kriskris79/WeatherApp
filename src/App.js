import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Weather from './components/Weather';
import 'bootstrap/dist/css/bootstrap.css';
import "./scss/styles/_main.scss";

const App = () => {
    const [isVerified, setIsVerified] = useState(false);

    const onCaptchaChange = (value) => {
        console.log("Captcha value:", value);
        if (value) {
            setIsVerified(true);
        }
    };

    return (
        <div className="App">
            {!isVerified ? (
                <div className="captcha-container">
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
                        onChange={onCaptchaChange}
                    />
                </div>
            ) : (
                <div>
                    <Weather />
                </div>
            )}
        </div>
    );
};

export default App;