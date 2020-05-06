const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(
    require('D:/security/kipper/serviceAccountKey.json'),
  ),
  databaseURL: 'https://kipper-77b85.firebaseio.com',
  storageBucket: 'kipper-77b85.appspot.com',
});

module.exports = admin;
