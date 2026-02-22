# Google Authentication Setup Guide

This guide explains how to set up Google Cloud Console for Google Sign-In in both the mobile app and backend.

## 1. Create a Google Cloud Project

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click on the project dropdown at the top left and select **New Project**.
3.  Name your project (e.g., "AAGC Mobile App") and click **Create**.

## 2. Configure OAuth Consent Screen

1.  In the left sidebar, navigate to **APIs & Services > OAuth consent screen**.
2.  Select **External** (unless you are a G Suite organization) and click **Create**.
3.  Fill in the **App Information**:
    *   **App name**: AAGC App
    *   **User support email**: Your email
    *   **Developer contact information**: Your email
4.  Click **Save and Continue**.
5.  **Scopes**: Click **Add or Remove Scopes** and select:
    *   `.../auth/userinfo.email`
    *   `.../auth/userinfo.profile`
    *   `openid`
6.  Click **Update**, then **Save and Continue**.
7.  **Test Users**: Add your own email to test users while the app is in "Testing" mode.

## 3. Create OAuth Credentials

You need minimal TWO Client IDs: one for the **Web** (Backend/Expo Proxy) and one for **Android/iOS**.

### A. Web Client ID (For Backend & Expo Go)
1.  Go to **Credentials**.
2.  Click **Create Credentials > OAuth client ID**.
3.  Application type: **Web application**.
4.  Name: `Web Client`.
5.  **Authorized JavaScript origins**:
    *   `http://localhost:3000` (Frontend)
    *   `http://localhost:3001` (Backend)
6.  **Authorized redirect URIs**:
    *   `http://localhost:3000/auth/callback`
    *   `http://localhost:3001/api/auth/google/callback`
    *   `https://auth.expo.io/@herkintormiwer/aagc-mobile` (If using Expo AuthSession proxy)
7.  Click **Create**.
8.  **Copy the Client ID** and **Client Secret**.

### B. Android Client ID (For Mobile App)
1.  Click **Create Credentials > OAuth client ID**.
2.  Application type: **Android**.
3.  Name: `Android Client`.
4.  **Package name**: Find this in your `app.json` or `android/app/build.gradle` (e.g., `com.aagc.mobile`).
5.  **SHA-1 Certificate fingerprint**:
    *   For development (Expo Go / local build), run: `cd android && ./gradlew signingReport`
    *   Copy the SHA1 from `debug` keystore.
6.  Click **Create**.
7.  **Copy the Client ID**.

### C. iOS Client ID (Optional / For Mobile App)
1.  Click **Create Credentials > OAuth client ID**.
2.  Application type: **iOS**.
3.  Name: `iOS Client`.
4.  **Bundle ID**: Find this in `app.json` (e.g., `com.aagc.mobile`).
5.  Click **Create**.
6.  **Copy the Client ID**.

## 4. Configuration

### Backend (`.env`)
Update your backend `.env` file with the **Web Client** credentials:

```env
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-web-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
JWT_SECRET=your-secure-jwt-secret
```

### Frontend / Mobile (`auth.ts` or `app.json`)
Update your Expo config or constants with the **Android/iOS Client IDs**.
The backend verifies the token, so the mobile app must send the `idToken`.

## 5. Verification
Once set up, when a user signs in via Google on mobile, the app receives an `idToken`. This token is sent to the backend endpoint `/api/auth/oauth/mobile`. The backend verifies it with Google servers.
