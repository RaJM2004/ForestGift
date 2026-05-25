import path from 'path';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_NAME = process.env.SMTP_FROM_NAME || 'ForestGift';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export const sendWelcomeEmail = async (userEmail: string, userName: string, token: string, password = 'forestgift123') => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1a202c;">
            <div style="text-align: center; margin-bottom: 32px;">
                <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop/AE0r4EWz6LuN9z6g/title-IA5qPxoWCRTW532I.jpg" alt="ForestGift Logo" style="height: 55px; display: block; margin: 0 auto 16px auto; border-radius: 8px;" />
                <h1 style="color: #059669; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 0.1em;">ForestGift</h1>
                <p style="color: #718096; font-size: 12px; font-weight: bold; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.2em;">Official Citizen Onboarding</p>
            </div>
            
            <h2 style="font-size: 22px; margin-bottom: 16px;">Welcome to the ecosystem, ${userName}!</h2>
            <p style="line-height: 1.6; color: #4a5568;">Your contribution to the planet has been officially registered. You are now part of a global movement towards transparency and ecological restoration.</p>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin: 32px 0;">
                <h3 style="margin-top: 0; font-size: 14px; color: #718096; text-transform: uppercase;">Your Registry Credentials</h3>
                <p style="margin: 8px 0;"><strong>Primary Email:</strong> ${userEmail}</p>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
                <a href="http://localhost:5173/login" style="background-color: #059669; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Access Your Dashboard</a>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 40px 0;" />
            
            <p style="font-size: 12px; color: #a0aec0; text-align: center;">
                This is an automated message from the ForestGift Registry Node. <br/>
                &copy; 2024 ForestGift Network. All Rights Reserved.
            </p>
        </div>
    `;

    if (!resend) {
        console.warn('RESEND_API_KEY is not set; welcome email was logged in console instead.');
        console.log(`\n========================================\n[WELCOME EMAIL DISPATCH]\nTo: ${userEmail}\nSubject: Welcome to the ForestGift Network! 🌿\nContent:\n${html}\n========================================\n`);
        return { success: true, data: { mock: true } };
    }
    try {
        const { data, error } = await resend.emails.send({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: [userEmail],
            subject: 'Welcome to the ForestGift Network! 🌿',
            html
        });

        if (error) {
            console.error('Resend Error (Welcome):', error);
            return { success: false, error };
        }
        return { success: true, data };
    } catch (err) {
        console.error('Internal Email Error (Welcome):', err);
        return { success: false, error: err };
    }
};

export const sendCertificateEmail = async (userEmail: string, userName: string, verificationCode: string) => {
    const verifyUrl = `http://localhost:5173/verify/${verificationCode}`;
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1a202c; background-color: #f0fdf4;">
            <div style="text-align: center; margin-bottom: 32px;">
                <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop/AE0r4EWz6LuN9z6g/title-IA5qPxoWCRTW532I.jpg" alt="ForestGift Logo" style="height: 55px; display: block; margin: 0 auto 16px auto; border-radius: 8px;" />
                <h1 style="color: #059669; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 0.1em;">ForestGift</h1>
                <p style="color: #059669; font-size: 10px; font-weight: bold; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.3em; opacity: 0.7;">Verified Impact Identity</p>
            </div>
            
            <div style="background: white; padding: 32px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 22px; margin-bottom: 16px; text-align: center;">Congratulations, ${userName}!</h2>
                <p style="line-height: 1.6; color: #4a5568; text-align: center;">Your plantation has been successfully verified by our regional NGO partner. Your immutable digital certificate is now live on the global registry.</p>
                
                <div style="border: 2px dashed #def7ec; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
                    <p style="margin: 0; font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 0.1em;">Verification Code</p>
                    <p style="margin: 8px 0; font-size: 20px; font-weight: 800; color: #059669; font-family: monospace;">${verificationCode}</p>
                </div>
                
                <div style="text-align: center; margin-top: 32px;">
                    <a href="${verifyUrl}" style="background-color: #1a202c; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Your Certificate</a>
                </div>
            </div>
            
            <p style="font-size: 11px; color: #059669; text-align: center; margin-top: 32px; opacity: 0.6; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">
                Scan your certificate QR code in your dashboard for mobile verification.
            </p>
        </div>
    `;

    if (!resend) {
        console.warn('RESEND_API_KEY is not set; certificate email was logged in console instead.');
        console.log(`\n========================================\n[CERTIFICATE EMAIL DISPATCH]\nTo: ${userEmail}\nSubject: Your Plantation Certificate is Ready! 🌳\nContent:\n${html}\n========================================\n`);
        return { success: true, data: { mock: true } };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: [userEmail],
            subject: 'Your Plantation Certificate is Ready! 🌳',
            html
        });

        if (error) {
            console.error('Resend Error (Cert):', error);
            return { success: false, error };
        }
        return { success: true, data };
    } catch (err) {
        console.error('Internal Email Error (Cert):', err);
        return { success: false, error: err };
    }
};

export const sendSupportNotificationEmail = async (subject: string, htmlContent: string) => {
    if (!resend) {
        console.warn('RESEND_API_KEY is not set; support email was logged in console instead.');
        console.log(`\n========================================\n[SUPPORT EMAIL DISPATCH]\nTo: Support@forestgift.in\nSubject: ${subject}\nContent:\n${htmlContent}\n========================================\n`);
        return { success: true, data: { mock: true } };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: ['Support@forestgift.in'],
            subject: subject,
            html: htmlContent
        });

        if (error) {
            console.error('Resend Error (Support):', error);
            return { success: false, error };
        }
        return { success: true, data };
    } catch (err) {
        console.error('Internal Email Error (Support):', err);
        return { success: false, error: err };
    }
};

/** OTP only — invoice is not attached (invoice lives in vendor Invoice dashboard). */
export const sendCakeDeliveryOtpEmail = async (
    userEmail: string,
    userName: string,
    otp: string,
    orderId: string,
) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #fbcfe8; border-radius: 20px; color: #1f2937;">
            <h1 style="color: #ec4899; margin: 0 0 8px 0; font-size: 22px;">ForestGift Cake Delivery</h1>
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 24px 0;">Order ${orderId}</p>
            <p style="line-height: 1.6;">Hi ${userName},</p>
            <p style="line-height: 1.6;">Your celebration cake is <strong>out for delivery</strong>. Share this one-time code with our delivery partner when you receive your order:</p>
            <div style="background: #fdf2f8; border: 2px solid #ec4899; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.15em;">Delivery OTP</p>
                <p style="margin: 8px 0 0 0; font-size: 36px; font-weight: bold; letter-spacing: 0.3em; color: #ec4899;">${otp}</p>
            </div>
            <p style="font-size: 13px; color: #6b7280;">This code expires in 24 hours. Do not share it publicly.</p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">— ForestGift · Planting trees, celebrating birthdays</p>
        </div>
    `;

    if (!resend) {
        console.warn('RESEND_API_KEY not set; OTP email logged to console.');
        console.log(`\n[CAKE OTP] To: ${userEmail}\nOTP: ${otp}\nOrder: ${orderId}\n`);
        return { success: true, data: { mock: true } };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: [userEmail],
            subject: `Your ForestGift delivery code — ${orderId}`,
            html,
        });
        if (error) {
            console.error('Resend Error (Cake OTP):', error);
            return { success: false, error };
        }
        return { success: true, data };
    } catch (err) {
        console.error('Internal Email Error (Cake OTP):', err);
        return { success: false, error: err };
    }
};
