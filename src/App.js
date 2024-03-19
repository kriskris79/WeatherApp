

import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Weather from './components/Weather';
import 'bootstrap/dist/css/bootstrap.css';
import "./scss/styles/_main.scss";

const App = () => {
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (isVerified) {
            const googleTranslateElementInit = () => {
                if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement({
                        pageLanguage: 'en',
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                    }, 'google_translate');
                }
            };

            const googleTranslateScript = document.createElement('script');
            googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            googleTranslateScript.async = true;
            document.body.appendChild(googleTranslateScript);
            window.googleTranslateElementInit = googleTranslateElementInit;

            return () => {
                document.body.removeChild(googleTranslateScript);
            };
        }
    }, [isVerified]);

    const onCaptchaChange = (value) => {
        console.log("Captcha value:", value);
        setIsVerified(!!value);
    };

    return (
        <div className="app-container">

            <div className="captcha-container" style={{visibility: isVerified ? 'hidden' : 'visible'}}>
                <ReCAPTCHA
                    sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
                    onChange={onCaptchaChange}
                />
            </div>
            {isVerified && <div id="google_translate"></div>}
            {isVerified && <Weather />}
        </div>
    );
};

export default App;

