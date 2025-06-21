import NextAuth from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import { apiLinks } from "@/lib/api-link";
import { CredentialsSignin } from "@auth/core/errors";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// auth

async function refreshAccessToken(token) {
  console.log("Refreshing access token", token);
  try {
    const refreshResponse = await axios.post(apiLinks.auth.refresh, {
      refreshToken: token.token.refreshToken,
    });

    token.token.accessToken = refreshResponse.data.token;
    token.token.refreshToken = refreshResponse.data.refreshToken;
    token.token.tokenExpiresAt = refreshResponse.data.tokenExpiresAt;
    token.accessTokenExpires = new Date(refreshResponse.data.tokenExpiresAt).getTime();
    return token;
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CredentialsSignin("Vui lòng nhập email và mật khẩu");
        }

        try {
          const loginResponse = await axios.post(apiLinks.auth.login, {
            email: credentials.email,
            password: credentials.password,
          });

          if (!loginResponse.data.token) {
            throw new CredentialsSignin("Thông tin đăng nhập không đúng");
          }

          const token = {
            accessToken: loginResponse.data.token,
            refreshToken: loginResponse.data.refreshToken,
            tokenExpiresAt: new Date(loginResponse.data.tokenExpiresAt).getTime(),
          };

          const profileResponse = await axios.get(apiLinks.profile.baseProfile, {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          });

          if (profileResponse.status !== 200) {
            throw new CredentialsSignin("Không thể lấy thông tin người dùng");
          }

          const profile = {
            id: profileResponse.data.data._id,
            fullName: profileResponse.data.data.fullName,
            email: profileResponse.data.data.email,
          };

          return {
            id: profile.id,
            token: token,
            profile: profile,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new CredentialsSignin("Lỗi đăng nhập");
        }
      },
    }),
  ],
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account }) {


      if (user && account) {
        token = user;
        return token;
      }

      if (token.token.accessToken) {
        const decodedToken = jwtDecode(token.token.accessToken);
        token.accessTokenExpires = decodedToken?.exp * 1000;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);

    },
    async session({ session, token }) {
      session.user = token;

      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});