import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
import { API } from './server';
import { JWT, Session, User } from 'next-auth';

declare module 'next-auth' {
  interface User {
    token: string;
    nip: string;
    nama: string;
    jabatan: string;
  }

  interface JWT {
    token: string;
    nip: string;
    nama: string;
    jabatan: string;
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
        nip: { label: 'NIP', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${API}auth/login`, {
            nip: credentials.nip,
            password: credentials.password
          });

          const user = response.data.data;

          if (user && user.token) {
            return {
              token: user.token,
              nip: user.nip,
              nama: user.nama,
              jabatan: user.jabatan || 'Guru'
            };
          } else {
            console.log('Login gagal: data tidak lengkap');
            return null;
          }
        } catch (error: any) {
          console.error('Login error:', error.message || error);
          throw new Error('NIP atau Password salah');
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
        token.nip = user.nip;
        token.nama = user.nama;
        token.jabatan = user.jabatan;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.token = token.token;
      session.user.nip = token.nip;
      session.user.nama = token.nama;
      session.user.jabatan = token.jabatan;
      return session;
    }
  }
};

export default authConfig;
