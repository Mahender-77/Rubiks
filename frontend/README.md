# Rubiks Application

A modern job search and career management app built with Expo React Native and a Node.js/Express backend.

---

## Features
- Beautiful onboarding, login, and registration screens
- Email verification for new users
- Secure authentication with JWT
- Password reset via email
- MongoDB for user data
- Modern, mobile-first UI

---

## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB running locally (`mongodb://localhost:27017/rubiks`)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

---

## Backend Setup (Node.js/Express)

1. **Navigate to the backend folder:**
   ```bash
   cd server
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `config.env` and update with your email credentials for verification (use Gmail or any SMTP provider):
     ```env
     MONGODB_URI=mongodb://localhost:27017/rubiks
     JWT_SECRET=your-super-secret-jwt-key
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     EMAIL_SERVICE=gmail
     PORT=5000
     ```
   - For Gmail, you may need to create an App Password: https://support.google.com/accounts/answer/185833
4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

---

## Frontend Setup (Expo React Native)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the Expo app:**
   ```bash
   npm run dev
   ```
3. **Connect your device:**
   - Use the Expo Go app (iOS/Android) to scan the QR code
   - Or run on an emulator/simulator

**Note:**
- The frontend expects the backend to be running at `http://localhost:5000`. If testing on a real device, use your computer's local IP address in `contexts/AuthContext.tsx` for `API_BASE_URL`.

---

## Folder Structure

```
project/
├── app/                # Expo app source (screens, navigation)
├── components/         # Shared React Native components
├── contexts/           # React Contexts (Auth, etc.)
├── server/             # Node.js/Express backend
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── utils/          # Utility functions (email, etc.)
│   └── config.env      # Backend environment variables
├── package.json        # Expo app dependencies
└── README.md           # This file
```

---

## Email Verification
- New users must verify their email before logging in.
- Check your inbox (and spam folder) for the verification link.
- The link expires in 24 hours.

---

## License
MIT
