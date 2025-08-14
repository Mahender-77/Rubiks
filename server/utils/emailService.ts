import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });



import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
} as SMTPTransport.Options);

interface SendEmailParams {
  email: string;
  token: string;
  name: string;
}

interface MailOptions {
  from: string | undefined;
  to: string;
  subject: string;
  html: string;
}

export const sendVerificationEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Rubiks',
    html: `<p>Hello ${name}, please verify: <a href="${verificationUrl}">Verify</a></p>`
  };

  await transporter.sendMail(mailOptions);
};


interface SendPasswordResetEmailParams {
  email: string;
  token: string;
  name: string;
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  name: string
): Promise<boolean> => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password - Rubiks',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Rubiks</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Password Reset</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            You requested to reset your password. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block; 
                      font-weight: bold;
                      font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="color: #667eea; word-break: break-all; font-size: 14px;">
            ${resetUrl}
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-top: 25px; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0; font-size: 14px;">© 2024 Rubiks. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};


