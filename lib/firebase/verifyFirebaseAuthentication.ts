// import {
//   Auth,
//   GoogleAuthProvider,
//   signInWithCredential,
//   reauthenticateWithCredential,
// } from "firebase/auth";
// import { Session } from "next-auth/core/types";
// import refreshGoogleOAuthToken from "./refreshGoogleOAuthToken";
// import { FirebaseError } from "firebase/app";
// import { adminAuth } from "./serverApp";

// export default async function verifyFirebaseAuthentication(
//   auth: Auth,
//   session: Session
// ) {
//   try {
//     const firestoreUser = await getFirestoreUser(auth, session);
//     return firestoreUser;
//   } catch (error) {
//     if (error instanceof FirebaseError) {
//       const credential = GoogleAuthProvider.credentialFromError(error);
//       console.log(`Err with credential: ${credential}`);
//     }
//     throw error;
//   }
// }

// export async function getFirestoreUser(auth: Auth, session: Session) {
//   if (auth.currentUser) {
//     const res = await auth.currentUser.getIdToken();
//     console.log("has current user");
//     return auth.currentUser;
//   } else {
//     if (
//       session &&
//       session.user &&
//       session.user.expires_at &&
//       session.user.id_token &&
//       session.user.access_token
//     ) {
//       console.log("Dont have current user");

//       const tokens =
//         Math.floor(Date.now() / 1000) > session.user.expires_at
//           ? await refreshGoogleOAuthToken(session.user.refresh_token)
//           : {
//               id_token: session.user.id_token,
//               access_token: session.user.access_token,
//               expires_at: session.user.expires_at,
//               refresh_token: session.user.refresh_token,
//             };

//       const credential = GoogleAuthProvider.credential(
//         tokens.id_token,
//         tokens.access_token
//       );

//       try {
//         const firebaseSignInResponse = await signInWithCredential(
//           auth,
//           credential
//         );
//         console.log("new sign in response");

//         await auth.updateCurrentUser(firebaseSignInResponse.user);

//         return firebaseSignInResponse.user;
//       } catch (error) {
//         console.log("Sign in error");
//         console.log(error);
//         console.log(Date.now() / 1000);
//         console.log(tokens.expires_at);
//         console.log(session.user.expires_at);
//         throw error;
//       }
//     }
//   }
// }
