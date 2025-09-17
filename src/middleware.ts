import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // kalau belum login redirect ke /login
  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, '/login');
    return Response.redirect(url);
  }

  const jabatan = req.auth.user?.jabatan; // role/jabatan user
  const pathname = req.nextUrl.pathname;

  // 1️⃣ Role siswa tidak boleh akses dashboard & mengajar
  if (jabatan === 'Siswa') {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/mengajar')) {
      const url = req.url.replace(req.nextUrl.pathname, '/unauthorized');
      return Response.redirect(url);
    }
  }

  // 2️⃣ Mapping akses dashboard khusus untuk guru tertentu
  const dashboardAccess: any = {
    'Guru BK': ['/dashboard/e-konseling', '/dashboard/pelanggaran-prestasi'],
    'Guru Perpus': [
      '/dashboard/e-perpus',
      '/dashboard/peminjaman-pengembalian'
    ],
    'Guru Tata Usaha': ['/dashboard/pembayaran']
  };

  // kalau dia guru BK, perpus, TU cek path dashboard nya
  if (dashboardAccess[jabatan]) {
    // kalau dia akses dashboard tapi path nya bukan yang diizinkan
    if (
      pathname.startsWith('/dashboard') &&
      !dashboardAccess[jabatan].some((allowed: any) =>
        pathname.startsWith(allowed)
      )
    ) {
      // redirect unauthorized
      const url = req.url.replace(req.nextUrl.pathname, '/unauthorized');
      return Response.redirect(url);
    }
  }

  // 3️⃣ Untuk jabatan selain Guru BK, Guru Perpus, Guru Tata Usaha
  // misalnya guru biasa (Guru Mapel), boleh mengajar tapi dashboard selain default juga dilarang
  if (
    !dashboardAccess[jabatan] && // bukan Guru BK/Perpus/TU
    !['Siswa'].includes(jabatan) // bukan siswa
  ) {
    // guru biasa → boleh mengajar
    if (pathname.startsWith('/dashboard')) {
      // larang semua dashboard selain default (karena guru biasa ga punya akses dashboard)
      const url = req.url.replace(req.nextUrl.pathname, '/unauthorized');
      return Response.redirect(url);
    }
  }

  // kalau lolos semua, akses diizinkan
  return;
});

export const config = {
  matcher: ['/dashboard/:path*', '/mengajar/:path*'] // proteksi semua route dashboard & mengajar
};
