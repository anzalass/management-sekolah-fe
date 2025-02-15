import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';

const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post(
            `${process.env.API_URL}/auth/login`,
            {
              nip: credentials.email,
              password: credentials.password
            }
          );

          const user = response.data.data;

          if (user) {
            const res = {
              id: user.nip,
              email: `${user.nip}@example.com`,
              ...user
            };

            console.log('User:', res);
            return res;
          } else {
            console.log('Invalid credentials');
            return null;
          }
        } catch (error) {
          throw new Error('Invalid credentials or server error');
        }
      }
    })
  ],
  pages: {
    signIn: '/' // Halaman sign-in
  }
};

export default authConfig;
