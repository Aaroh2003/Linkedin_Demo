# Demo LinkedIn

A simple LinkedIn-like social media demo application built with React and Firebase.

## Features

- User authentication (Sign up/Sign in)
- Like and comment on posts
- Real-time updates with Firestore
- Responsive design
- Demo posts for testing

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Firebase (Authentication & Firestore)
- **Styling**: Inline CSS
- **Real-time Database**: Firebase Firestore

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd demo-linkedin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Copy your Firebase configuration

4. **Configure environment variables**
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```


## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another available port).

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
demo-linkedin/
├── public/
├── src/
│   ├── components/
│   ├── firebase/
│   │   ├── firebase.js          # Firebase configuration
│   │   └── AuthContext.js       # Authentication context
│   ├── pages/
│   │   ├── HomePage.js          # Main feed page
│   │   └── LoginPage.js         # Authentication page
│   ├── App.js
│   └── main.js
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Firebase Setup Details

### Authentication
- Go to Firebase Console > Authentication > Sign-in method
- Enable Email/Password authentication

### Firestore Database
- Go to Firebase Console > Firestore Database
- Create database in test mode initially
- Set up security rules as shown above

### Collection Structure

The app uses the following Firestore collection:

**posts** collection:
```javascript
{
  text: "Post content",
  authorId: "user_uid",
  authorName: "User Display Name",
  likes: ["user_uid1", "user_uid2"],
  comments: [
    {
      text: "Comment text",
      authorId: "user_uid",
      authorName: "User Name",
      createdAt: timestamp
    }
  ],
  createdAt: serverTimestamp()
}
```

## Features Explained

### Authentication
- Users can sign up with email/password
- Persistent login sessions
- Secure sign out

### Posts
- Create text posts
- View all posts in chronological order
- Real-time updates when posts are added

### Interactions
- Like/unlike posts
- Add comments to posts
- See like counts and all comments

### Demo Data
- Automatic demo posts for new users
- Fallback to demo data if Firestore connection fails

## Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Check your Firebase configuration in `.env`
   - Ensure Firestore rules allow authenticated users
   - Verify Firebase project is active and not suspended

2. **Slow Loading**
   - The app includes fallback demo data for offline use
   - Check browser console for specific Firebase errors

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that Node.js version is 16 or higher

### Environment Variables Not Loading
- Ensure `.env` file is in the root directory (same level as `package.json`)
- Restart the development server after adding environment variables
- Variable names must start with `VITE_` for Vite to expose them

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Look through existing GitHub issues
3. Create a new issue with detailed information about the problem

---

**Happy coding!** 🚀
