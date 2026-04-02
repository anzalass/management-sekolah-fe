import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const jabatan = req.auth?.user?.jabatan;

  // helper biar gak redirect ke halaman yang sama (anti loop)
  const redirect = (to) => {
    if (path === to) return NextResponse.next();
    return NextResponse.redirect(new URL(to, req.url));
  };

  let res = NextResponse.next();

  // ==============================
  // 1️⃣ HANDLE SESSION EXPIRED
  // ==============================
  if (req.auth?.user?.expires) {
    const now = Math.floor(Date.now() / 1000);
    const userExpiresIn = req.auth.user.expires;

    if (now > userExpiresIn) {
      const redirectTo =
        jabatan === 'Siswa' ? '/login-siswa' : '/login';

      const response = redirect(redirectTo);
      response.cookies.delete('role'); // clear stale cookie
      return response;
    }
  }

  // ==============================
  // 2️⃣ JIKA BELUM LOGIN
  // ==============================
  if (!req.auth) {
    // allow akses halaman login
    if (path === '/login' || path === '/login-siswa') {
      return res;
    }

    const response = redirect('/login');
    response.cookies.delete('role'); // penting!
    return response;
  }

  // ==============================
  // 3️⃣ SET COOKIE ROLE (VALID SESSION)
  // ==============================
  if (jabatan) {
    res.cookies.set('role', jabatan, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
  }

  // ==============================
  // 4️⃣ REDIRECT KALAU SUDAH LOGIN
  // ==============================
  if (path === '/login' || path === '/login-siswa') {
    let redirectTo = '/dashboard';

    if (jabatan === 'Siswa') redirectTo = '/siswa';
    else if (jabatan?.startsWith('Guru')) redirectTo = '/mengajar';
    else if (jabatan === 'Kepala Sekolah') redirectTo = '/dashboard';

    return redirect(redirectTo);
  }

  // ==============================
  // 5️⃣ RBAC (ROLE BASED ACCESS)
  // ==============================

  // ✅ Siswa hanya boleh /siswa
  if (jabatan === 'Siswa' && !path.startsWith('/siswa')) {
    return redirect('/unauthorized');
  }

  // ✅ Non siswa tidak boleh /siswa
  if (jabatan !== 'Siswa' && path.startsWith('/siswa')) {
    return redirect('/unauthorized');
  }

  // ✅ Kepala Sekolah only /dashboard
  if (jabatan !== 'Kepala Sekolah' && path.startsWith('/dashboard')) {
    return redirect('/unauthorized');
  }

  // ✅ Pembayaran hanya Guru TU
  if (
    jabatan !== 'Guru TU' &&
    path.startsWith('/mengajar/pembayaran')
  ) {
    return redirect('/unauthorized');
  }

  // ✅ E-Konseling hanya Guru BK
  if (
    jabatan !== 'Guru BK' &&
    path.startsWith('/mengajar/e-konseling')
  ) {
    return redirect('/unauthorized');
  }

  // ✅ E-Perpus hanya Guru Perpus
  if (
    jabatan !== 'Guru Perpus' &&
    path.startsWith('/mengajar/e-perpus')
  ) {
    return redirect('/unauthorized');
  }

  // ==============================
  // 6️⃣ LOLOS SEMUA
  // ==============================
  return res;
});

// ==============================
// MATCHER (LOGIN DIKELUARIN ❗)
// ==============================
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/mengajar/:path*',
    '/siswa/:path*',
  ],
};
