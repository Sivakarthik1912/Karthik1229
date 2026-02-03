import nodemailer from 'nodemailer';

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Create a transporter using your email service
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email to your inbox
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Your email address
      replyTo: email, // User's email for reply
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h2>New Message from Your Portfolio</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Optional: Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me',
      html: `
        <h2>Thank You!</h2>
        <p>Hi ${name},</p>
        <p>I received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Karthik</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Email sent successfully',
      }),
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send email',
        details: error.message,
      }),
    };
  }
};
