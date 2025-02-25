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

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Master Data',
    url: '/dashboard/tahun-ajaran',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Guru & Staff',
        url: '/dashboard/master-data/guru-staff',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Siswa',
        url: '/dashboard/master-data/siswa',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Ruangan',
        url: '/dashboard/master-data/ruangan',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Anggaran',
        url: '/dashboard/master-data/anggaran',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Kelas',
        url: '/dashboard/master-data/kelas',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Pengumuman',
        url: '/dashboard/master-data/pengumuman',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      // {
      //   title: 'Mata Pelajaran',
      //   url: '/dashboard/master-data/mata-pelajaran',
      //   icon: 'userPen',
      //   shortcut: ['m', 'm']
      // },
      {
        title: 'Kegiatan Sekolah',
        url: '/dashboard/master-data/kegiatan-sekolah',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ] // No child items
  },
  {
    title: 'Presensi Guru & Staff',
    url: '#',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Kehadiran ',
        url: '/dashboard/presensi/kehadiran',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Perizinan',
        url: '/dashboard/presensi/perizinan',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ] // No child items
  },

  {
    title: 'Inventaris',
    url: '#',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Daftar Inventaris',
        url: '/dashboard/inventaris',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Pemeliharaan',
        url: '/dashboard/inventaris/pemeliharaan',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ] // No child items
  },
  {
    title: 'Pembayaran',
    url: '#',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Daftar Inventaris',
        url: '/dashboard/inventaris',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Pemeliharaan',
        url: '/dashboard/inventaris/pemeliharaan',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ] // No child items
  },

  {
    title: 'Bimbingan Konseling',
    url: '#',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Dashboard BK',
        url: '/dashboard/bk',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Pelanggaran dan Prestasi Siswa',
        url: '/dashboard/bk/list',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ] // No child items
  },
  {
    title: 'Perpustakaan',
    url: '#',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Dashboard Perpustakaan',
        url: '/dashboard/perpustakaan',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Buku Perpustakaan',
        url: '/dashboard/perpustakaan/buku',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Peminjaman',
        url: '/dashboard/perpustakaan/peminjaman',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ] // No child items
  },
  {
    title: 'Tabungan Siswa',
    url: '#',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Dashboard Perpustakaan',
        url: '/dashboard/perpustakaan',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Buku Perpustakaan',
        url: '/dashboard/perpustakaan/buku',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Peminjaman',
        url: '/dashboard/perpustakaan/peminjaman',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ] // No child items
  },

  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
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
