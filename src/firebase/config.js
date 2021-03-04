import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAnhf8RlhvmMl35Mls4x4nX4Sp1nxOGSGs',
  authDomain: 'reactnativefirebase-98822.firebaseapp.com',
  databaseURL: 'https://reactnativefirebase-98822.firebaseio.com',
  projectId: 'reactnativefirebase-98822',
  storageBucket: 'reactnativefirebase-98822.appspot.com',
  messagingSenderId: '423436539986',
  appId: '1:423436539986:ios:0c20cc20762770aae7a78b',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };