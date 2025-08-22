const admin = require('firebase-admin');
const path = require('path');
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tradeconnect-3c728-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const email = 'admintradeconnecta@gmail.com';
const password = 'TradeConnect@2023!'; // You should change this to a strong password

async function setupAdminUser() {
  try {
    // Check if user already exists
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
      console.log('User already exists:', user.uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        user = await admin.auth().createUser({
          email: email,
          password: password,
          emailVerified: true
        });
        console.log('Created new user:', user.uid);
      } else {
        throw error;
      }
    }

    // Set admin custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log('Admin claim set successfully');

    // Create/update user document in Firestore
    const userRef = admin.firestore().collection('users').doc(user.uid);
    await userRef.set({
      email: email,
      role: 'admin',
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      username: 'admin',
      displayName: 'Administrator',
      status: 'active'
    }, { merge: true });

    console.log('Firestore user document updated');
    console.log('\n✅ Admin setup completed successfully!');
    console.log(`Email: ${email}`);
    console.log('Password: [the password you set]');
    console.log('\n⚠️  Make sure to change this password after first login!');

  } catch (error) {
    console.error('Error setting up admin user:', error);
  } finally {
    process.exit();
  }
}

setupAdminUser();
