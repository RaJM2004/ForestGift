import express from 'express';
import { sendSupportNotificationEmail } from '../services/emailService';

const router = express.Router();

// Newsletter/Community Initiative subscribe submission
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const subject = '🌿 New Green Initiative Newsletter Subscription';
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1a202c; background-color: #fcfdfa;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #059669; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 0.1em;">ForestGift</h1>
          <p style="color: #718096; font-size: 12px; font-weight: bold; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.2em;">New Newsletter Lead</p>
        </div>
        
        <h2 style="font-size: 20px; color: #247114; margin-bottom: 16px; border-bottom: 1px solid #edf2f7; padding-bottom: 12px;">Subscription Details</h2>
        <p style="line-height: 1.6; color: #4a5568; font-size: 14px;">A visitor has entered their email address to join the <strong>Green Initiative</strong> and receive forest updates.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 16px; margin: 24px 0; border: 1px solid #edf2f7;">
          <p style="margin: 8px 0; font-size: 14px;"><strong>Subscriber Email:</strong> <a href="mailto:${email}" style="color: #059669; font-weight: bold; text-decoration: none;">${email}</a></p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p style="font-size: 11px; color: #a0aec0; text-align: center; margin-top: 32px;">
          This notification was automatically dispatched to Support@forestgift.in from the ForestGift Landing Portal.
        </p>
      </div>
    `;

    const result = await sendSupportNotificationEmail(subject, htmlContent);
    return res.status(200).json({ success: true, data: result.data });
  } catch (error: any) {
    console.error('Subscribe submission error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error occurred.' });
  }
});

// Contact page message submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject: userSubject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const subject = `📬 Contact Form: ${userSubject || 'General Inquiry'} (from ${name})`;
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1a202c; background-color: #fcfdfa;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #059669; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 0.1em;">ForestGift</h1>
          <p style="color: #718096; font-size: 12px; font-weight: bold; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.2em;">New Contact Form Message</p>
        </div>
        
        <h2 style="font-size: 20px; color: #247114; margin-bottom: 16px; border-bottom: 1px solid #edf2f7; padding-bottom: 12px;">Sender Information</h2>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 16px; margin: 24px 0; border: 1px solid #edf2f7; font-size: 14px;">
          <p style="margin: 6px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #059669; font-weight: bold; text-decoration: none;">${email}</a></p>
          <p style="margin: 6px 0;"><strong>Subject:</strong> ${userSubject || 'N/A'}</p>
          <p style="margin: 6px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <h2 style="font-size: 20px; color: #247114; margin-bottom: 16px; border-bottom: 1px solid #edf2f7; padding-bottom: 12px;">Message Body</h2>
        <div style="background-color: white; padding: 20px; border-radius: 16px; border: 1px solid #edf2f7; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">
${message}
        </div>
        
        <p style="font-size: 11px; color: #a0aec0; text-align: center; margin-top: 42px;">
          This notification was automatically dispatched to Support@forestgift.in from the ForestGift Landing Portal.
        </p>
      </div>
    `;

    const result = await sendSupportNotificationEmail(subject, htmlContent);
    return res.status(200).json({ success: true, data: result.data });
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error occurred.' });
  }
});

export default router;
