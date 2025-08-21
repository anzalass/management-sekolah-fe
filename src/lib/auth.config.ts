import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
import { API } from './server';
import { JWT, Session, User } from 'next-auth';
import { toast } from 'sonner';

declare module 'next-auth' {
  interface User {
    idGuru: string;
    token: string;
    nip: string;
    nama: string;
    jabatan: string;
  }

  interface JWT {
    idGuru: string;
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
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        nip: { label: 'NIP', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
            {
              nip: credentials.nip,
              password: credentials.password
            }
          );

          const user = response.data.data;

          if (user && user.token) {
            return {
              token: user.token,
              nip: user.nip,
              nama: user.nama,
              jabatan: user.jabatan || 'Guru'
            };
          } else {
            toast.error('Gagal login');
            return null;
          }
        } catch (error: any) {
          toast.error('Login error:', error.message || error);
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
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'none', // ⬅️ WAJIB agar cookie cross-domain bisa disimpan
        secure: true, // ⬅️ WAJIB kalau domain pakai HTTPS
        path: '/'
      }
    }
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | undefined }) {
      if (user) {
        token.token = user.token;
        token.idGuru = user.idGuru;
        token.nip = user.nip;
        token.nama = user.nama;
        token.jabatan = user.jabatan;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.token = token.token;
      session.user.idGuru = token.idGuru;

      session.user.nip = token.nip;
      session.user.nama = token.nama;
      session.user.jabatan = token.jabatan;
      return session;
    }
  }
};

export default authConfig;
