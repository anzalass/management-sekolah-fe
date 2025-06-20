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
    title: 'Pendaftaran Siswa',
    url: '/dashboard/pendaftaran',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Inventaris',
    url: '/dashboard/Inventaris',
    icon: 'product',
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
      }
    ]
  },
  {
    title: 'Master Data',
    url: '/dashboard/tahun-ajaran',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Guru Staff',
        url: '/dashboard/master-data/guru-staff',
        icon: 'userPen',
        shortcut: ['n', 'n'],
        allowedRoles: ['Kepala Sekolah']
      },
      {
        title: 'Siswa',
        url: '/dashboard/master-data/siswa',
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
        title: 'Mata Pelajaran',
        url: '/dashboard/master-data/mata-pelajaran',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Anggaran',
        url: '/dashboard/master-data/anggaran',
        icon: 'userPen',
        shortcut: ['n', 'n']
      }
    ]
  },
  {
    title: 'Konten Management',
    url: '/dashboard/tahun-ajaran',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    allowedRoles: ['Kepala Sekolah'],
    items: [
      {
        title: 'News',
        url: '/dashboard/master-data/news',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Testimonials',
        url: '/dashboard/master-data/testimoni',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Gallery',
        url: '/dashboard/master-data/gallery',
        icon: 'userPen',
        shortcut: ['n', 'n']
      },
      {
        title: 'Guru Template',
        url: '/dashboard/master-data/guru-template',
        icon: 'userPen',
        shortcut: ['n', 'n']
      }
    ]
  }

  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // }
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
