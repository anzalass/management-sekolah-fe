import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const path = req.nextUrl.pathname; // ambil url sekarang

  // Kalau belum login redirect ke /login kecuali ke /login /login-siswa
  if (!req.auth) {
    // biarin kalau dia akses /login atau /login-siswa
    if (path.startsWith('/login-siswa') || path.startsWith('/login')) {
      return; // boleh akses login
    }

    const url = req.url.replace(req.nextUrl.pathname, '/login');
    return Response.redirect(url);
  }

  // === Sudah login tapi ke /login atau /login-siswa ===
  const jabatan = req.auth.user?.jabatan;

  // ========== CEK EXPIRED SESSION BERDASARKAN expiresIn ==========
  const sessionExpires = Math.floor(
    new Date(req?.auth?.expires).getTime() / 1000
  );
  const userExpiresIn = req.auth?.user?.expires;

  if (userExpiresIn && sessionExpires > userExpiresIn) {
    return Response.redirect(new URL('/logout', req.url));
  }

  if (path === '/login-siswa' || path === '/login') {
    // tentukan redirect default berdasarkan jabatan
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

    return Response.redirect(new URL(redirectTo, req.url));
  }

  // ========== RULE AKSES ==========

  // Siswa: hanya boleh /siswa
  if (jabatan === 'Siswa') {
    if (path.startsWith('/mengajar') || path.startsWith('/dashboard')) {
      return Response.redirect(new URL('/unauthorized', req.url));
    }
  }

  // Selain Siswa dilarang akses /siswa
  if (jabatan !== 'Siswa' && path.startsWith('/siswa')) {
    return Response.redirect(new URL('/unauthorized', req.url));
  }

  // Selain Kepala Sekolah dilarang akses /dashboard
  if (jabatan !== 'Kepala Sekolah' && path.startsWith('/dashboard')) {
    return Response.redirect(new URL('/unauthorized', req.url));
  }

  // Selain Guru TU dilarang akses pembayaran
  if (
    jabatan !== 'Guru TU' &&
    (path.startsWith('/mengajar/pembayaran/riwayat-pembayaran') ||
      path.startsWith('/mengajar/pembayaran/daftar-tagihan'))
  ) {
    return Response.redirect(new URL('/unauthorized', req.url));
  }

  // Selain Guru BK dilarang akses e-konseling
  if (
    jabatan !== 'Guru BK' &&
    (path.startsWith('/mengajar/e-konseling/konseling-siswa') ||
      path.startsWith('/mengajar/e-konseling/pelanggaran-prestasi'))
  ) {
    return Response.redirect(new URL('/unauthorized', req.url));
  }

  // Selain Guru Perpus dilarang akses e-perpus
  if (
    jabatan !== 'Guru Perpus' &&
    (path.startsWith('/mengajar/e-perpus/data-buku') ||
      path.startsWith('/mengajar/e-perpus/peminjaman-pengembalian'))
  ) {
    return Response.redirect(new URL('/unauthorized', req.url));
  }

  // Kalau lolos semua rule, lanjut
  return;
});

// matcher supaya middleware jalan di semua route yang butuh proteksi
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/mengajar/:path*',
    '/siswa/:path*',
    '/login',
    '/login-siswa'
  ]
};
