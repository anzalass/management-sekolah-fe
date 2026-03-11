import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isLoginPage =
    path.startsWith('/login') || path.startsWith('/login-siswa');

  const isProtectedRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/mengajar') ||
    path.startsWith('/siswa');

  const isUnauthorizedPage = path.startsWith('/unauthorized');

  // ========= BELUM LOGIN =========
  if (!req.auth && isProtectedRoute) {
    const url = nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // ========= SUDAH LOGIN =========
  if (req.auth) {
    const jabatan = req.auth.user?.jabatan;

    // ===== CEK SESSION EXPIRED =====
    const sessionExpires = Math.floor(
      new Date(req.auth?.expires).getTime() / 1000
    );

    const userExpiresIn = req.auth?.user?.expires;

    if (userExpiresIn && sessionExpires > userExpiresIn) {
      const url = nextUrl.clone();
      url.pathname = '/logout';
      return NextResponse.redirect(url);
    }

    // ===== LOGIN PAGE REDIRECT =====
    if (isLoginPage) {
      let redirectTo = '/dashboard';

      if (jabatan === 'Siswa') redirectTo = '/siswa';
      else if (
        jabatan === 'Guru BK' ||
        jabatan === 'Guru TU' ||
        jabatan === 'Guru Perpus' ||
        jabatan?.startsWith('Guru')
      ) {
        redirectTo = '/mengajar';
      }

      const url = nextUrl.clone();
      url.pathname = redirectTo;
      return NextResponse.redirect(url);
    }

    // ===== ROLE ACCESS RULE =====

    // Siswa hanya boleh /siswa
    if (jabatan === 'Siswa' && !path.startsWith('/siswa')) {
      const url = nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // selain siswa tidak boleh akses /siswa
    if (jabatan !== 'Siswa' && path.startsWith('/siswa')) {
      const url = nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // dashboard hanya kepala sekolah
    if (jabatan !== 'Kepala Sekolah' && path.startsWith('/dashboard')) {
      const url = nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // pembayaran hanya Guru TU
    if (
      jabatan !== 'Guru TU' &&
      (path.startsWith('/mengajar/pembayaran/riwayat-pembayaran') ||
        path.startsWith('/mengajar/pembayaran/daftar-tagihan'))
    ) {
      const url = nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // e-konseling hanya Guru BK
    if (
      jabatan !== 'Guru BK' &&
      (path.startsWith('/mengajar/e-konseling/konseling-siswa') ||
        path.startsWith('/mengajar/e-konseling/pelanggaran-prestasi'))
    ) {
      const url = nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // e-perpus hanya Guru Perpus
    if (
      jabatan !== 'Guru Perpus' &&
      (path.startsWith('/mengajar/e-perpus/data-buku') ||
        path.startsWith('/mengajar/e-perpus/peminjaman-pengembalian'))
    ) {
      const url = nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/mengajar/:path*',
    '/siswa/:path*',
    '/login',
    '/login-siswa'
  ]
};
