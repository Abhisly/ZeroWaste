import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000, // 5 seconds timeout
});

console.log('Attempting to connect to PostgreSQL at:', process.env.DATABASE_URL?.split('@')[1]); // Log host part only for safety

pool.connect((err, client, release) => {
  if (err) {
    console.error('PostgreSQL Connection Error:', err.message);
    console.error('Check if your DATABASE_URL is correct and if requests are allowed by your firewall.');
    return;
  }
  console.log('Successfully connected to Supabase PostgreSQL');
  release();
});

// OTP Store (Email -> { otp, expiresAt })
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: result.rows[0].now });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Basic Login Endpoint (Placeholder for real auth)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // This is a placeholder for real authentication logic
  // For now, it just returns a success message if data is provided
  if (email && password) {
    res.json({ success: true, message: 'Login successful (Backend Mock)' });
  } else {
    res.status(400).json({ success: false, message: 'Missing credentials' });
  }
});

// Send OTP Endpoint
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // StoreOTP
  otpStore.set(email, { otp, expiresAt });

  try {
    const info = await transporter.sendMail({
      from: `"ZeroWaste" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your ZeroWaste Account',
      text: `Your OTP for ZeroWaste registration is: ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #4CAF50;">ZeroWaste Registration</h2>
          <p>Your One-Time Password (OTP) for registration is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #333;">${otp}</h1>
          <p>This OTP is valid for 5 minutes. Please do not share this code.</p>
        </div>
      `,
    });
    console.log(`OTP sent successfully to ${email}. OTP: ${otp}. MessageId: ${info.messageId}`);
    console.log('SMTP Response:', info.response);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Critical Error sending email:', error.message);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Check your EMAIL_USER and EMAIL_PASS.');
    }
    res.status(500).json({ success: false, message: 'Failed to send OTP email: ' + error.message });
  }
});

// Verify OTP Endpoint
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'No OTP found for this email. Please request a new one.' });
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email); // Clean up expired
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  // Success
  otpStore.delete(email); // Clean up after success
  res.json({ success: true, message: 'OTP verified successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
