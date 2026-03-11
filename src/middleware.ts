import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const jabatan = req.auth?.user?.jabatan;

  const res = NextResponse.next();

  // ==============================
  // 1️⃣ SET COOKIE ROLE SAAT LOGIN
  // ==============================
  if (jabatan) {
    res.cookies.set('role', jabatan, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });
  }

  // ==========================================
  // 2️⃣ CEK SESSION EXPIRED (CUSTOM expiresIn)
  // ==========================================
  if (req.auth?.expires && req.auth?.user?.expires) {
    const sessionExpires = Math.floor(
      new Date(req.auth.expires).getTime() / 1000
    );

    const userExpiresIn = req.auth.user.expires;

    if (sessionExpires > userExpiresIn) {
      const redirectTo = jabatan === 'Siswa' ? '/login-siswa' : '/login';

      const response = NextResponse.redirect(new URL(redirectTo, req.url));

      // hapus cookie role supaya tidak stale
      response.cookies.delete('role');

      return response;
    }
  }

  // ==============================
  // 3️⃣ JIKA BELUM LOGIN
  // ==============================
  if (!req.auth) {
    const role = req.cookies.get('role')?.value;

    // kalau sudah di halaman login, biarkan
    if (path.startsWith('/login') || path.startsWith('/login-siswa')) {
      return res;
    }

    const redirectTo = role === 'Siswa' ? '/login-siswa' : '/login';

    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  if (path === '/login-siswa' || path === '/login') {
    // tentukan redirect default berdasarkan jabatan
    let redirectTo = '/dashboard';

    if (jabatan === 'Siswa') redirectTo = '/siswa';
    else if (jabatan?.startsWith('Guru')) redirectTo = '/mengajar';
    else if (jabatan === 'Kepala Sekolah') redirectTo = '/dashboard';

    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // ==============================
  // 5️⃣ RULE AKSES (RBAC)
  // ==============================

  // ✅ Siswa hanya boleh akses /siswa
  if (jabatan === 'Siswa' && !path.startsWith('/siswa')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // ✅ Non siswa tidak boleh /siswa
  if (jabatan !== 'Siswa' && path.startsWith('/siswa')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // ✅ Hanya Kepala Sekolah boleh /dashboard
  if (jabatan !== 'Kepala Sekolah' && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // ✅ Pembayaran hanya Guru TU
  if (jabatan !== 'Guru TU' && path.startsWith('/mengajar/pembayaran')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // ✅ E-Konseling hanya Guru BK
  if (jabatan !== 'Guru BK' && path.startsWith('/mengajar/e-konseling')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // ✅ E-Perpus hanya Guru Perpus
  if (jabatan !== 'Guru Perpus' && path.startsWith('/mengajar/e-perpus')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // ==============================
  // 6️⃣ LOLOS SEMUA RULE
  // ==============================
  return res;
});

// ==============================
// MATCHER
// ==============================
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/mengajar/:path*',
    '/siswa/:path*',
    '/login',
    '/login-siswa'
  ]
};
