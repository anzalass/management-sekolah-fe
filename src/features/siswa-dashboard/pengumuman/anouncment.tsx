// import { useState } from 'react';
// import {
//   Megaphone,
//   Search,
//   Calendar,
//   X,
//   Clock,
//   User,
//   Eye,
//   ChevronRight,
//   TrendingUp,
//   Info
// } from 'lucide-react';

// export default function AnnouncementPage() {
//   const [search, setSearch] = useState('');
//   const [filterTanggal, setFilterTanggal] = useState('');
//   const [selectedPengumuman, setSelectedPengumuman] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [showFilter, setShowFilter] = useState(false);
//   const [isLoading] = useState(false);

//   // Dummy data
//   const pengumumanData = [
//     {
//       id: '1',
//       title: 'Libur Nasional: Hari Sumpah Pemuda',
//       content:
//         '<p>Kepada seluruh siswa dan orang tua,</p><p>Diberitahukan bahwa pada tanggal 28 Oktober 2025 (Senin) sekolah diliburkan dalam rangka memperingati Hari Sumpah Pemuda. Kegiatan belajar mengajar akan kembali normal pada tanggal 29 Oktober 2025.</p><p>Terima kasih atas perhatiannya.</p>',
//       time: '2025-10-01T08:00:00',
//       kategori: 'Libur',
//       penulis: 'Admin Sekolah',
//       views: 245,
//       isPenting: true
//     },
//     {
//       id: '2',
//       title: 'Pengumuman Jadwal Ujian Tengah Semester',
//       content:
//         '<p>Kepada siswa kelas X, XI, dan XII,</p><p>Ujian Tengah Semester (UTS) akan dilaksanakan pada:</p><ul><li>Tanggal: 15-20 Oktober 2025</li><li>Waktu: 07:30 - 10:00 WIB</li><li>Tempat: Ruang kelas masing-masing</li></ul><p>Harap mempersiapkan diri dengan baik. Bawa kartu ujian dan alat tulis.</p>',
//       time: '2025-09-28T10:30:00',
//       kategori: 'Akademik',
//       penulis: 'Wakil Kepala Sekolah',
//       views: 512,
//       isPenting: true
//     },
//     {
//       id: '3',
//       title: 'Pembukaan Pendaftaran Ekstrakurikuler Semester Ganjil',
//       content:
//         '<p>Pendaftaran ekstrakurikuler semester ganjil 2025/2026 sudah dibuka!</p><p>Pilihan ekstrakurikuler:</p><ul><li>Pramuka</li><li>Basket</li><li>Futsal</li><li>Robotika</li><li>English Club</li><li>Paduan Suara</li></ul><p>Pendaftaran dibuka hingga 10 Oktober 2025 melalui portal siswa.</p>',
//       time: '2025-09-25T14:00:00',
//       kategori: 'Ekstrakurikuler',
//       penulis: 'Pembina Ekskul',
//       views: 328,
//       isPenting: false
//     },
//     {
//       id: '4',
//       title: 'Perubahan Jadwal Pelajaran Kelas X',
//       content:
//         '<p>Informasi perubahan jadwal untuk kelas X:</p><p>Mulai Senin, 7 Oktober 2025, mata pelajaran Matematika akan dipindah dari jam ke-3 menjadi jam ke-5. Silakan cek jadwal terbaru di portal siswa.</p>',
//       time: '2025-09-23T09:15:00',
//       kategori: 'Jadwal',
//       penulis: 'Kurikulum',
//       views: 189,
//       isPenting: false
//     },
//     {
//       id: '5',
//       title: 'Lomba Karya Tulis Ilmiah Tingkat Sekolah',
//       content:
//         '<p>Sekolah mengadakan Lomba Karya Tulis Ilmiah dengan tema "Inovasi Teknologi untuk Pendidikan Masa Depan".</p><p>Ketentuan:</p><ul><li>Terbuka untuk semua tingkat</li><li>Individu atau kelompok (max 3 orang)</li><li>Deadline: 30 Oktober 2025</li><li>Hadiah total: Rp 5.000.000</li></ul><p>Info lengkap hubungi Bu Siti di ruang OSIS.</p>',
//       time: '2025-09-20T11:00:00',
//       kategori: 'Kompetisi',
//       penulis: 'OSIS',
//       views: 421,
//       isPenting: true
//     },
//     {
//       id: '6',
//       title: 'Reminder: Pembayaran SPP Bulan Oktober',
//       content:
//         '<p>Pengingat untuk pembayaran SPP bulan Oktober 2025.</p><p>Batas akhir pembayaran: 10 Oktober 2025. Pembayaran dapat dilakukan melalui:</p><ul><li>Virtual Account</li><li>QRIS</li><li>Indomaret/Alfamart</li></ul><p>Cek tagihan di menu Pembayaran.</p>',
//       time: '2025-09-18T08:30:00',
//       kategori: 'Keuangan',
//       penulis: 'Bagian Keuangan',
//       views: 678,
//       isPenting: true
//     }
//   ];

//   const kategoriBadges = {
//     Libur: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🏖️' },
//     Akademik: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '📚' },
//     Ekstrakurikuler: { bg: 'bg-green-100', text: 'text-green-700', icon: '⚽' },
//     Jadwal: { bg: 'bg-orange-100', text: 'text-orange-700', icon: '📅' },
//     Kompetisi: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🏆' },
//     Keuangan: { bg: 'bg-red-100', text: 'text-red-700', icon: '💰' }
//   };

//   const filteredPengumuman = pengumumanData.filter((p) => {
//     const matchSearch =
//       p.title.toLowerCase().includes(search.toLowerCase()) ||
//       p.content.toLowerCase().includes(search.toLowerCase());
//     const matchDate = !filterTanggal || p.time.startsWith(filterTanggal);
//     return matchSearch && matchDate;
//   });

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('id-ID', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   const formatTime = (dateString) => {
//     return new Date(dateString).toLocaleTimeString('id-ID', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const stripHtml = (html) => {
//     const tmp = document.createElement('div');
//     tmp.innerHTML = html;
//     return tmp.textContent || tmp.innerText || '';
//   };

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20'>
//       {/* Header */}
//       <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-4 pb-8 pt-6'>
//         <div className='mx-auto max-w-6xl'>
//           <div className='mb-4 flex items-center gap-3'>
//             <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'>
//               <Megaphone className='h-7 w-7 text-white' />
//             </div>
//             <div>
//               <h1 className='text-2xl font-bold text-white'>Pengumuman</h1>
//               <p className='text-sm text-blue-100'>Info terbaru sekolah</p>
//             </div>
//           </div>

//           {/* Stats */}
//           <div className='grid grid-cols-3 gap-3'>
//             <div className='rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md'>
//               <p className='text-2xl font-bold text-white'>
//                 {pengumumanData.length}
//               </p>
//               <p className='text-xs text-blue-100'>Total</p>
//             </div>
//             <div className='rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md'>
//               <p className='text-2xl font-bold text-white'>
//                 {pengumumanData.filter((p) => p.isPenting).length}
//               </p>
//               <p className='text-xs text-blue-100'>Penting</p>
//             </div>
//             <div className='rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md'>
//               <p className='text-2xl font-bold text-white'>6</p>
//               <p className='text-xs text-blue-100'>Kategori</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search & Filter */}
//       <div className='relative z-10 mx-auto -mt-4 mb-6 max-w-6xl px-4'>
//         <div className='rounded-2xl bg-white p-4 shadow-xl'>
//           <div className='mb-3 flex gap-2'>
//             <div className='relative flex-1'>
//               <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
//               <input
//                 type='text'
//                 placeholder='Cari judul atau isi...'
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
//               />
//             </div>
//             <button
//               onClick={() => setShowFilter(!showFilter)}
//               className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
//                 showFilter
//                   ? 'bg-blue-600 text-white'
//                   : 'border border-gray-200 bg-gray-50 text-gray-600'
//               }`}
//             >
//               <Calendar className='h-5 w-5' />
//             </button>
//           </div>

//           {/* Date Filter */}
//           {showFilter && (
//             <div className='animate-[slideDown_0.2s_ease-out]'>
//               <div className='relative'>
//                 <Calendar className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
//                 <input
//                   type='date'
//                   value={filterTanggal}
//                   onChange={(e) => setFilterTanggal(e.target.value)}
//                   className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none'
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Content */}
//       <div className='mx-auto max-w-6xl px-4'>
//         {isLoading ? (
//           <div className='py-12 text-center'>
//             <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
//             <p className='mt-4 text-gray-600'>Memuat pengumuman...</p>
//           </div>
//         ) : filteredPengumuman.length === 0 ? (
//           <div className='py-12 text-center'>
//             <Megaphone className='mx-auto mb-4 h-16 w-16 text-gray-300' />
//             <h3 className='mb-2 text-lg font-semibold text-gray-900'>
//               Tidak ada pengumuman
//             </h3>
//             <p className='text-gray-500'>Belum ada pengumuman yang tersedia</p>
//           </div>
//         ) : (
//           <div className='space-y-3'>
//             {filteredPengumuman.map((item) => {
//               const kategoriConfig =
//                 kategoriBadges[item.kategori] || kategoriBadges['Akademik'];

//               return (
//                 <div
//                   key={item.id}
//                   onClick={() => {
//                     setSelectedPengumuman(item);
//                     setIsDialogOpen(true);
//                   }}
//                   className={`active:scale-98 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all ${
//                     item.isPenting
//                       ? 'border-l-4 border-red-500'
//                       : 'border border-gray-200'
//                   }`}
//                 >
//                   <div className='p-5'>
//                     {/* Header */}
//                     <div className='mb-3 flex items-start gap-3'>
//                       <div
//                         className={`h-12 w-12 rounded-xl ${kategoriConfig.bg} flex flex-shrink-0 items-center justify-center`}
//                       >
//                         <span className='text-2xl'>{kategoriConfig.icon}</span>
//                       </div>
//                       <div className='min-w-0 flex-1'>
//                         <div className='mb-1 flex items-start gap-2'>
//                           <h3 className='flex-1 text-base font-bold leading-tight text-gray-900'>
//                             {item.title}
//                           </h3>
//                           {item.isPenting && (
//                             <span className='flex-shrink-0 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white'>
//                               PENTING
//                             </span>
//                           )}
//                         </div>
//                         <span
//                           className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${kategoriConfig.bg} ${kategoriConfig.text}`}
//                         >
//                           {item.kategori}
//                         </span>
//                       </div>
//                       <ChevronRight className='h-5 w-5 flex-shrink-0 text-gray-400' />
//                     </div>

//                     {/* Content Preview */}
//                     <p className='mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600'>
//                       {stripHtml(item.content)}
//                     </p>

//                     {/* Meta Info */}
//                     <div className='flex items-center justify-between text-xs text-gray-500'>
//                       <div className='flex items-center gap-4'>
//                         <div className='flex items-center gap-1'>
//                           <Clock className='h-4 w-4' />
//                           <span>{formatDate(item.time)}</span>
//                         </div>
//                         <div className='flex items-center gap-1'>
//                           <User className='h-4 w-4' />
//                           <span>{item.penulis}</span>
//                         </div>
//                       </div>
//                       <div className='flex items-center gap-1'>
//                         <Eye className='h-4 w-4' />
//                         <span>{item.views}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Hover Effect Bar */}
//                   <div className='h-1 scale-x-0 transform bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-300 group-hover:scale-x-100'></div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Modal Detail */}
//       {isDialogOpen && selectedPengumuman && (
//         <div className='fixed inset-0 z-50 animate-[fadeIn_0.2s_ease-out]'>
//           {/* Backdrop */}
//           <div
//             className='absolute inset-0 bg-black/50 backdrop-blur-sm'
//             onClick={() => setIsDialogOpen(false)}
//           ></div>

//           {/* Modal Content */}
//           <div className='absolute inset-x-0 bottom-0 animate-[slideUp_0.3s_ease-out] p-4 md:inset-0 md:flex md:items-center md:justify-center'>
//             <div className='relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-t-3xl bg-white shadow-2xl md:rounded-3xl'>
//               {/* Header */}
//               <div
//                 className={`${selectedPengumuman.isPenting ? 'bg-gradient-to-r from-red-600 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} px-6 py-5`}
//               >
//                 <div className='flex items-start justify-between gap-3'>
//                   <div className='flex-1'>
//                     <div className='mb-2 flex items-center gap-2'>
//                       {(() => {
//                         const kategoriConfig =
//                           kategoriBadges[selectedPengumuman.kategori];
//                         return (
//                           <span
//                             className={`rounded-full px-3 py-1 text-xs font-semibold ${kategoriConfig.bg} ${kategoriConfig.text}`}
//                           >
//                             {kategoriConfig.icon} {selectedPengumuman.kategori}
//                           </span>
//                         );
//                       })()}
//                       {selectedPengumuman.isPenting && (
//                         <span className='rounded-full bg-white/20 px-2 py-1 text-xs font-bold text-white'>
//                           PENTING
//                         </span>
//                       )}
//                     </div>
//                     <h2 className='text-xl font-bold leading-tight text-white'>
//                       {selectedPengumuman.title}
//                     </h2>
//                   </div>
//                   <button
//                     onClick={() => setIsDialogOpen(false)}
//                     className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors active:bg-white/30'
//                   >
//                     <X className='h-6 w-6 text-white' />
//                   </button>
//                 </div>
//               </div>

//               {/* Content */}
//               <div
//                 className='overflow-y-auto p-6'
//                 style={{ maxHeight: 'calc(90vh - 160px)' }}
//               >
//                 <div
//                   className='prose prose-sm mb-6 max-w-none text-gray-700'
//                   dangerouslySetInnerHTML={{
//                     __html: selectedPengumuman.content
//                   }}
//                 />

//                 {/* Meta Info */}
//                 <div className='space-y-3 border-t border-gray-200 pt-4'>
//                   <div className='flex items-center gap-3 text-sm text-gray-600'>
//                     <Clock className='h-5 w-5' />
//                     <div>
//                       <p className='font-medium text-gray-900'>
//                         Waktu Publikasi
//                       </p>
//                       <p>
//                         {formatDate(selectedPengumuman.time)} •{' '}
//                         {formatTime(selectedPengumuman.time)}
//                       </p>
//                     </div>
//                   </div>
//                   <div className='flex items-center gap-3 text-sm text-gray-600'>
//                     <User className='h-5 w-5' />
//                     <div>
//                       <p className='font-medium text-gray-900'>
//                         Dipublikasi oleh
//                       </p>
//                       <p>{selectedPengumuman.penulis}</p>
//                     </div>
//                   </div>
//                   <div className='flex items-center gap-3 text-sm text-gray-600'>
//                     <Eye className='h-5 w-5' />
//                     <div>
//                       <p className='font-medium text-gray-900'>Dilihat</p>
//                       <p>{selectedPengumuman.views} kali</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes slideUp {
//           from {
//             transform: translateY(100%);
//           }
//           to {
//             transform: translateY(0);
//           }
//         }
//         .active\:scale-98:active {
//           transform: scale(0.98);
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .prose p {
//           margin-bottom: 1em;
//         }
//         .prose ul {
//           margin: 1em 0;
//           padding-left: 1.5em;
//         }
//         .prose li {
//           margin-bottom: 0.5em;
//         }
//       `}</style>
//     </div>
//   );
// }
