importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBTsZhODnVYMBQZ3LHFL6iHs7WG0cwbFN4",
  authDomain: "test-5fd83.firebaseapp.com",
  projectId: "test-5fd83",
  storageBucket: "test-5fd83.firebasestorage.app",
  messagingSenderId: "1023392310465",
  appId: "1:1023392310465:web:d7db1d89f61c507c78e040"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});