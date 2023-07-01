// import { TokenSet } from "next-auth/core/types";

// export default async function refreshGoogleOAuthToken(refreshToken: string) {
//   //accounts.google.com/.well-known/openid-configuration
//   // We need the `token_endpoint`.

//   try {
//     const response = await fetch("https://oauth2.googleapis.com/token", {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         client_id: process.env.GOOGLE_CLIENT_ID as string,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
//         grant_type: "refresh_token",
//         refresh_token: refreshToken as string,
//       }),
//       method: "POST",
//     });

//     const tokens: TokenSet = await response.json();

//     if (!response.ok) throw tokens;
//     console.log("GoogleOAuth Tokens Refreshed");
//     if (tokens.id_token && tokens.access_token) {
//       return {
//         //...tokens, // Keep the previous token properties
//         id_token: tokens.id_token,
//         access_token: tokens.access_token,
//         expires_at: Math.floor(
//           Date.now() / 1000 + (tokens.expires_in as number)
//         ),
//         // Fall back to old refresh token, but note that
//         // many providers may only allow using a refresh token once.
//         refresh_token: tokens.refresh_token ?? refreshToken,
//       };
//     } else {
//       throw Error("Tokens returned invalid.");
//     }
//   } catch (error) {
//     console.error("Error refreshing access token", error);
//     //       // The error property will be used client-side to handle the refresh token error
//     return { refreshToken, error: "RefreshAccessTokenError" as const };
//   }
// }
