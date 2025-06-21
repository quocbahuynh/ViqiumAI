import "next-auth"
import { TokenType, UserProfile } from "./userType"

declare module "next-auth" {
  interface Session {
    token: TokenType
    profile: UserProfile
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: TokenType
    profile: UserProfile
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    token: TokenType | null;
    profile: UserProfile | null;
  }
}

declare module "@auth/core/types" {
  interface Session {
    user: {
      token: TokenType | null;
      profile: UserProfile | null;
    } & DefaultSession["user"];
  }

  interface User {
    token: TokenType | null;
    profile: UserProfile | null;
  }
}
export interface User {
  id:string;
  token: TokenType | null;
  profile: UserProfile | null;
}