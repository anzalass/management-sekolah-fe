import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
import { API } from './server';
import { JWT, Session, User } from 'next-auth';

declare module 'next-auth' {
  interface User {
    token: string;
    role: string;
  }

  interface JWT {
    id: string;
    email: string;
    token: string;
    role: string;
  }

  interface Session {
    user: User;
  }
}

const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${API}auth/admin`, {
            email: credentials.email,
            password: credentials.password
          });

          if (response.data && response.data.data) {
            const user = response.data.data;

            if (user) {
              const token = user.token;

              if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
              }
              return {
                id: user.nip,
                email: user.email,
                token: token,
                role: user.role,
                ...user
              };
            } else {
              console.log('Invalid credentials');
              return null;
            }
          } else {
            console.log('Invalid response format', response.data);
            return null;
          }
        } catch (error: any) {
          console.error('Login error:', error.message || error);
          throw new Error('Invalid credentials or server error');
        }
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | undefined }) {
      if (user) {
        token.token = user.token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.token = token.token;
      session.user.role = token.role;
      return session;
    }
  }
};

export default authConfig;
