# Email Configuration Guide - SMTP Setup for Netlify

## Overview
Your portfolio contact form now sends emails via SMTP using Netlify Functions. Messages will be delivered to `omsiva.karthik.2002@gmail.com`.

## Setup Instructions

### Step 1: Install Dependencies
Run this command in your project directory:
```bash
npm install
```

This installs the `nodemailer` package required for sending emails.

### Step 2: Configure Gmail (or Your Email Service)

#### For Gmail:
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Create an **App Password**:
   - Go back to Security settings
   - Find "App passwords" section
   - Select Mail and Windows Computer
   - Generate a 16-character password
   - **Copy this password** - you'll need it next

#### For Other Email Services:
- **Outlook/Hotmail**: Use your email and password directly
- **Custom SMTP**: Use your provider's SMTP settings

### Step 3: Set Environment Variables on Netlify

1. Go to your **Netlify Dashboard**
2. Select your portfolio site
3. Go to **Site Settings** → **Build & Deploy** → **Environment**
4. Add these environment variables:

```
EMAIL_SERVICE = gmail
EMAIL_USER = omsiva.karthik.2002@gmail.com
EMAIL_PASSWORD = [Your 16-char App Password or email password]
```

**Important**: 
- For Gmail, use the **16-character App Password** (not your actual Gmail password)
- Never commit these credentials to GitHub

### Step 4: Deploy to Netlify

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add email functionality with SMTP"
git push
```

2. Your Netlify site will automatically rebuild with the new Netlify Function

### Step 5: Test the Contact Form

1. Visit your deployed portfolio
2. Fill out the contact form with:
   - Your name
   - Your email
   - Subject
   - Message
3. Click "Send Message"
4. You should receive an email at `omsiva.karthik.2002@gmail.com`
5. The visitor will also receive a confirmation email

## How It Works

1. **Frontend**: React form collects user data
2. **API Call**: Form data sent to `/.netlify/functions/sendEmail`
3. **Backend**: Netlify Function uses Nodemailer + SMTP to send emails
4. **Email Delivery**: 
   - Email sent to your inbox (with reply-to as user's email)
   - Confirmation email sent to visitor

## Troubleshooting

### "Failed to send email" Error
- Check that environment variables are set correctly on Netlify
- Verify your Gmail App Password (not regular password)
- Ensure 2-Step Verification is enabled on Gmail

### Emails not arriving
- Check spam/junk folder
- Verify EMAIL_USER matches the SMTP credentials
- Check Netlify Function logs: Site Settings → Functions → Check logs

### Local Testing
To test locally, create a `.env.local` file:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

Then use a local Netlify Dev:
```bash
npm install -g netlify-cli
netlify dev
```

## File Structure
```
netlify/
  functions/
    sendEmail.js          ← Your email handler
src/
  App.jsx                ← Updated form with email integration
package.json            ← Contains nodemailer dependency
```

## Security Notes
- Never commit `.env` files with credentials to GitHub
- Use Netlify's environment variable system for production
- The EMAIL_USER and EMAIL_PASSWORD are only accessible on the Netlify server
- User emails are used for reply-to only, not stored

## Support
If you need help:
1. Check Netlify Function logs
2. Verify all environment variables are set
3. Test with the browser console (F12) for any fetch errors
