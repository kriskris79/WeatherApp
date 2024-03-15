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
                sitekey="Your_reCAPTCHA_site_key_here"
                onChange={onCaptchaChange}
            />
        </div>
    );
};

export default Captcha;