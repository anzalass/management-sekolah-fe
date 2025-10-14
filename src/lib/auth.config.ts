import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT, Session, User } from 'next-auth';

declare module 'next-auth' {
  interface User {
    idGuru: string;
    token: string;
    nip: string;
    nama: string;
    jabatan: string;
    idKelas: string;
    foto: string;
    expires?: number; // ⬅️ tambahkan expiredIn
  }

  interface JWT {
    idGuru: string;
    token: string;
    nip: string;
    nama: string;
    jabatan: string;
    idKelas: string;
    foto: string;
    exp?: number; // ⬅️ ini bawaan NextAuth, kita set dari backend
    expires?: number;
  }

  interface Session {
    user: User & { expires?: number };
  }
}

const authConfig = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        nip: { label: 'NIP', type: 'text' },
        password: { label: 'Password', type: 'password' },
        type: { label: 'type', type: 'text' }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
            {
              nip: credentials.nip,
              password: credentials.password,
              type: credentials.type
            }
          );

          const user = response.data.data;

          // console.log supaya keliatan

          if (!user || !user.token) {
            throw new Error('Token tidak ditemukan di response API');
          }

          return {
            token: user.token,
            nip: user.nip,
            nama: user.nama,
            jabatan: user.jabatan || 'Guru',
            idKelas: user.idKelas,
            idGuru: user?.idGuru,
            foto: user?.foto,
            expires: user?.expiresIn
          };
        } catch (error: any) {
          console.error('Login Error:', error.response?.data || error.message);
          throw new Error(error.response?.data?.message || 'Login gagal');
        }
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 jam = 1 hari
    updateAge: 0 // tidak auto-refresh
  },

  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/'
      }
    }
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.token = user.token;
        token.idGuru = user.idGuru;
        token.nip = user.nip;
        token.nama = user.nama;
        token.jabatan = user.jabatan;
        token.idKelas = user.idKelas;
        token.foto = user.foto;
        token.expires = user.expires;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.token = token.token;
      session.user.idGuru = token.idGuru;
      session.user.idKelas = token.idKelas;
      session.user.nip = token.nip;
      session.user.nama = token.nama;
      session.user.jabatan = token.jabatan;
      session.user.foto = token.foto;
      session.user.expires = token.expires;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token.token || '');
      }

      return session;
    }
  }
};

export default authConfig;
