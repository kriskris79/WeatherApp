import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Captcha = () => {
    const [captchaValue, setCaptchaValue] = useState(null);

    const onCaptchaChange = (value) => {
        console.log("Captcha value:", value);
        setCaptchaValue(value);
    };

    return (
        <div className="captcha-container">
            <ReCAPTCHA
                sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
                onChange={onCaptchaChange}
            />
        </div>
    );
};

export default Captcha;