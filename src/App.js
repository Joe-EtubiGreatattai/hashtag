// src/App.js
import React from 'react';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Telegram Mini App
        </h1>
        <UserProfile />
      </div>
    </div>
  );
}

export default App;