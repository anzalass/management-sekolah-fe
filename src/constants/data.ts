import { NavItem } from 'types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Data Sekolah',
    url: '/dashboard/data-sekolah',
    icon: 'university',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Pendaftaran Siswa',
    url: '/dashboard/pendaftaran',
    icon: 'userPLus',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Presensi Guru',
    url: '',
    icon: 'clipboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [
      {
        title: 'Kehadiran Guru',
        url: '/dashboard/presensi/kehadiran',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Perizinan Guru',
        url: '/dashboard/presensi/perizinan',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Rekap Bulanan Guru',
        url: '/dashboard/presensi/rekap-bulanan',
        icon: 'userPen',
        shortcut: ['n', 'n']
      }
    ]
  },
  {
    title: 'Inventaris',
    url: '/dashboard/Inventaris',
    icon: 'boxes',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Daftar Inventaris',
        url: '/dashboard/inventaris/daftar-inventaris',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Jenis Inventaris',
        url: '/dashboard/inventaris/jenis-inventaris',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      // {
      //   title: 'Management Inventaris',
      //   url: '/dashboard/inventaris/management-inventaris',
      //   icon: 'userPen',
      //   shortcut: ['n', 'n']
      // },
      {
        title: 'Inventaris Masuk',
        url: '/dashboard/inventaris/inventaris-masuk',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Inventaris Keluar',
        url: '/dashboard/inventaris/management-inventaris',
        icon: 'userPen',
        shortcut: ['n', 'n']
      }
    ]
  },
  {
    title: 'Konten Management',
    url: '',
    icon: 'filetext',
    shortcut: ['p', 'p'],
    isActive: false,
    allowedRoles: ['Kepala Sekolah'],
    items: [
      {
        title: 'News',
        url: '/dashboard/content-management/news',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Testimonials',
        url: '/dashboard/content-management/testimoni',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Gallery',
        url: '/dashboard/content-management/gallery',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Guru Template',
        url: '/dashboard/content-management/guru-template',
        icon: 'userPen',
        shortcut: ['n', 'n']
      }
    ]
  },
  {
    title: 'Master Data',
    url: '',
    icon: 'db',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Anggaran',
        url: '/dashboard/master-data/anggaran',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Guru dan Staff',
        url: '/dashboard/master-data/guru-staff',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Siswa',
        url: '/dashboard/master-data/siswa',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'List Kelas',
        url: '/dashboard/master-data/list-kelas',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Kegiatan Sekolah',
        url: '/dashboard/master-data/kegiatan-sekolah',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Mata Pelajaran',
        url: '/dashboard/master-data/mata-pelajaran',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Pengumuman',
        url: '/dashboard/master-data/pengumuman',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Ruangan',
        url: '/dashboard/master-data/ruangan',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Arsip dan Dokumen',
        url: '/dashboard/master-data/arsip',
        icon: 'userPen',
        shortcut: ['n', 'n']
      }
    ]
  },
  {
    title: 'E - Konseling',
    url: '',
    icon: 'messagecircleheart',
    shortcut: ['p', 'p'],
    isActive: false,
    allowedRoles: ['Guru'],
    items: [
      {
        title: 'Data Konseling Siswa',
        url: '/dashboard/e-konseling/konseling-siswa',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Pelanggaran Prestasi Siswa',
        url: '/dashboard/e-konseling/pelanggaran-prestasi',
        icon: 'userPen',
        shortcut: ['n', 'n']
      }
    ]
  },
  // {
  //   title: 'E - Perpus',
  //   url: '',
  //   icon: 'book',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: [
  //     {
  //       title: 'Data Buku',
  //       url: '/dashboard/e-perpus/data-buku',
  //       icon: 'userPen',
  //       shortcut: ['n', 'n']
  //     },
  //     {
  //       title: 'Peminjaman dan Pengembalian Buku',
  //       url: '/dashboard/e-perpus/peminjaman-pengembalian',
  //       icon: 'userPen',
  //       shortcut: ['n', 'n']
  //     }
  //   ]
  // },
  {
    title: 'E - Pembayaran',
    url: '',
    icon: 'billing',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Daftar Tagihan Siswa',
        url: '/dashboard/pembayaran/daftar-tagihan',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Riwayat Pembayaran Siswa',
        url: '/dashboard/pembayaran/riwayat-pembayaran',
        icon: 'userPen',
        shortcut: ['n', 'n']
      }
    ]
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
