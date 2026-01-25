if (!self.define) {
  let a,
    e = {};
  const s = (s, i) => (
    (s = new URL(s + '.js', i).href),
    e[s] ||
      new Promise((e) => {
        if ('document' in self) {
          const a = document.createElement('script');
          (a.src = s), (a.onload = e), document.head.appendChild(a);
        } else (a = s), importScripts(s), e();
      }).then(() => {
        let a = e[s];
        if (!a) throw new Error(`Module ${s} didn’t register its module`);
        return a;
      })
  );
  self.define = (i, c) => {
    const n =
      a ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (e[n]) return;
    let t = {};
    const d = (a) => s(a, n),
      r = { module: { uri: n }, exports: t, require: d };
    e[n] = Promise.all(i.map((a) => r[a] || d(a))).then((a) => (c(...a), t));
  };
}
define(['./workbox-e9849328'], function (a) {
  'use strict';
  importScripts('/push-sw.js'),
    self.skipWaiting(),
    a.clientsClaim(),
    a.precacheAndRoute(
      [
        { url: '/Efek.png', revision: '16b66ca2ec1a5fdd60e7aaa507bf3a35' },
        { url: '/Ellipse.png', revision: 'a2f0b5d51c9fca289cdad5cf2e24696d' },
        { url: '/Foto.png', revision: 'b3e3d0ae44b136d8a8a313441f502bb9' },
        { url: '/Garis.png', revision: '060dad5ba9b80511ebd403cc143b29bb' },
        { url: '/Logo.png', revision: '89fe879f441dd4b1e761d4be6cf9bfd6' },
        { url: '/Notif.png', revision: 'f66260f70c62d692de44780bfd402a0d' },
        {
          url: '/_next/app-build-manifest.json',
          revision: '0c7d16abc69053545b45403413296f68'
        },
        {
          url: '/_next/static/7g0-9G1s3r3fJbsktflyq/_buildManifest.js',
          revision: 'ef311546ee9cb98b0f889d3be83045bc'
        },
        {
          url: '/_next/static/7g0-9G1s3r3fJbsktflyq/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933'
        },
        {
          url: '/_next/static/chunks/1167-f4bb83f7ca80c5e0.js',
          revision: 'f4bb83f7ca80c5e0'
        },
        {
          url: '/_next/static/chunks/13b76428-4f2bd69ab02d0a0c.js',
          revision: '4f2bd69ab02d0a0c'
        },
        {
          url: '/_next/static/chunks/1733-bbb4cdb9e7168548.js',
          revision: 'bbb4cdb9e7168548'
        },
        {
          url: '/_next/static/chunks/180-ecd661651606c47f.js',
          revision: 'ecd661651606c47f'
        },
        {
          url: '/_next/static/chunks/1802-235c63daed50c12c.js',
          revision: '235c63daed50c12c'
        },
        {
          url: '/_next/static/chunks/1935-5ca05394d107aff6.js',
          revision: '5ca05394d107aff6'
        },
        {
          url: '/_next/static/chunks/1976-5f265962c7cc39b0.js',
          revision: '5f265962c7cc39b0'
        },
        {
          url: '/_next/static/chunks/215-3fd05e4c88d55db5.js',
          revision: '3fd05e4c88d55db5'
        },
        {
          url: '/_next/static/chunks/223-1737491dd8f38629.js',
          revision: '1737491dd8f38629'
        },
        {
          url: '/_next/static/chunks/2302-e979611d8cd935f7.js',
          revision: 'e979611d8cd935f7'
        },
        {
          url: '/_next/static/chunks/23a0b913-759d4faa1af3b42e.js',
          revision: '759d4faa1af3b42e'
        },
        {
          url: '/_next/static/chunks/2430-54714a5c11f63c55.js',
          revision: '54714a5c11f63c55'
        },
        {
          url: '/_next/static/chunks/2444-719c887eff4b6ec1.js',
          revision: '719c887eff4b6ec1'
        },
        {
          url: '/_next/static/chunks/2625-eddaaa16ca5797b0.js',
          revision: 'eddaaa16ca5797b0'
        },
        {
          url: '/_next/static/chunks/2658-4c6bc23e292ba324.js',
          revision: '4c6bc23e292ba324'
        },
        {
          url: '/_next/static/chunks/3002-78f98c42ae66bf0b.js',
          revision: '78f98c42ae66bf0b'
        },
        {
          url: '/_next/static/chunks/3140-4568b252dc45db27.js',
          revision: '4568b252dc45db27'
        },
        {
          url: '/_next/static/chunks/3203-c2db436fa6266797.js',
          revision: 'c2db436fa6266797'
        },
        {
          url: '/_next/static/chunks/3255-a673e4e2db2bbf4a.js',
          revision: 'a673e4e2db2bbf4a'
        },
        {
          url: '/_next/static/chunks/3302-24eb3ac8c7944d04.js',
          revision: '24eb3ac8c7944d04'
        },
        {
          url: '/_next/static/chunks/3332-d7ee37dbf4928334.js',
          revision: 'd7ee37dbf4928334'
        },
        {
          url: '/_next/static/chunks/336a1f6c-665b55ff2f39b05b.js',
          revision: '665b55ff2f39b05b'
        },
        {
          url: '/_next/static/chunks/3528-cea13eb397aeb26f.js',
          revision: 'cea13eb397aeb26f'
        },
        {
          url: '/_next/static/chunks/3585736c-eaa60b06e9b7dc70.js',
          revision: 'eaa60b06e9b7dc70'
        },
        {
          url: '/_next/static/chunks/3794-c7452d295ffc6f70.js',
          revision: 'c7452d295ffc6f70'
        },
        {
          url: '/_next/static/chunks/3862-59433de3dc0e2c36.js',
          revision: '59433de3dc0e2c36'
        },
        {
          url: '/_next/static/chunks/3940-a225cad7c46ee645.js',
          revision: 'a225cad7c46ee645'
        },
        {
          url: '/_next/static/chunks/3c4078ff-3381fce5c9231e35.js',
          revision: '3381fce5c9231e35'
        },
        {
          url: '/_next/static/chunks/4012-151454bbce78d5f5.js',
          revision: '151454bbce78d5f5'
        },
        {
          url: '/_next/static/chunks/4079-7735142e99aa3ec3.js',
          revision: '7735142e99aa3ec3'
        },
        {
          url: '/_next/static/chunks/4110-5389522db1c8595f.js',
          revision: '5389522db1c8595f'
        },
        {
          url: '/_next/static/chunks/4149-aad3a0d5e1589103.js',
          revision: 'aad3a0d5e1589103'
        },
        {
          url: '/_next/static/chunks/4165-61272a902567a0c0.js',
          revision: '61272a902567a0c0'
        },
        {
          url: '/_next/static/chunks/4260-25518d6977577224.js',
          revision: '25518d6977577224'
        },
        {
          url: '/_next/static/chunks/4291-52ee408896999bc8.js',
          revision: '52ee408896999bc8'
        },
        {
          url: '/_next/static/chunks/4304-6b92d7931b8599cd.js',
          revision: '6b92d7931b8599cd'
        },
        {
          url: '/_next/static/chunks/4667-f5fa26ed600e2010.js',
          revision: 'f5fa26ed600e2010'
        },
        {
          url: '/_next/static/chunks/4689-55557793a815966c.js',
          revision: '55557793a815966c'
        },
        {
          url: '/_next/static/chunks/4710-1e248f7dba665814.js',
          revision: '1e248f7dba665814'
        },
        {
          url: '/_next/static/chunks/4768-52d62d012cede425.js',
          revision: '52d62d012cede425'
        },
        {
          url: '/_next/static/chunks/4833-5f265962c7cc39b0.js',
          revision: '5f265962c7cc39b0'
        },
        {
          url: '/_next/static/chunks/5025-1d5468dfa46b9ea5.js',
          revision: '1d5468dfa46b9ea5'
        },
        {
          url: '/_next/static/chunks/504-1d33cb1824215e7c.js',
          revision: '1d33cb1824215e7c'
        },
        {
          url: '/_next/static/chunks/5092-9dc44be125e9e904.js',
          revision: '9dc44be125e9e904'
        },
        {
          url: '/_next/static/chunks/5214-2618c3a97ac66115.js',
          revision: '2618c3a97ac66115'
        },
        {
          url: '/_next/static/chunks/5261-80f8091047647637.js',
          revision: '80f8091047647637'
        },
        {
          url: '/_next/static/chunks/5309-5f265962c7cc39b0.js',
          revision: '5f265962c7cc39b0'
        },
        {
          url: '/_next/static/chunks/5404-b8fbae9ac979d928.js',
          revision: 'b8fbae9ac979d928'
        },
        {
          url: '/_next/static/chunks/54a60aa6-cb934227cca4aa00.js',
          revision: 'cb934227cca4aa00'
        },
        {
          url: '/_next/static/chunks/5600-4e4b5de721fa8a6b.js',
          revision: '4e4b5de721fa8a6b'
        },
        {
          url: '/_next/static/chunks/5717-897ab0f75bd0ed4f.js',
          revision: '897ab0f75bd0ed4f'
        },
        {
          url: '/_next/static/chunks/5840-1362bc103a19168c.js',
          revision: '1362bc103a19168c'
        },
        {
          url: '/_next/static/chunks/6616-b6f44ee808b37a9f.js',
          revision: 'b6f44ee808b37a9f'
        },
        {
          url: '/_next/static/chunks/6911-a9d9b50205190dd2.js',
          revision: 'a9d9b50205190dd2'
        },
        {
          url: '/_next/static/chunks/696-d2c5d5121378fd51.js',
          revision: 'd2c5d5121378fd51'
        },
        {
          url: '/_next/static/chunks/6b92495e-b54ab2cbbe20916a.js',
          revision: 'b54ab2cbbe20916a'
        },
        {
          url: '/_next/static/chunks/7008-bb608e8726eafeb6.js',
          revision: 'bb608e8726eafeb6'
        },
        {
          url: '/_next/static/chunks/7013-6ce587966a51f406.js',
          revision: '6ce587966a51f406'
        },
        {
          url: '/_next/static/chunks/7214-5f265962c7cc39b0.js',
          revision: '5f265962c7cc39b0'
        },
        {
          url: '/_next/static/chunks/7529-c1acb4186997681d.js',
          revision: 'c1acb4186997681d'
        },
        {
          url: '/_next/static/chunks/7690-5f265962c7cc39b0.js',
          revision: '5f265962c7cc39b0'
        },
        {
          url: '/_next/static/chunks/7788-098e8d5a96fab49f.js',
          revision: '098e8d5a96fab49f'
        },
        {
          url: '/_next/static/chunks/7848-1cd28bd0bc227bf7.js',
          revision: '1cd28bd0bc227bf7'
        },
        {
          url: '/_next/static/chunks/8319-eaaed91a98dd3ce4.js',
          revision: 'eaaed91a98dd3ce4'
        },
        {
          url: '/_next/static/chunks/8329-dba65cd9a0b4ca73.js',
          revision: 'dba65cd9a0b4ca73'
        },
        {
          url: '/_next/static/chunks/8334-71794813b8ffe013.js',
          revision: '71794813b8ffe013'
        },
        {
          url: '/_next/static/chunks/8631-80754fea9b20473f.js',
          revision: '80754fea9b20473f'
        },
        {
          url: '/_next/static/chunks/870-271b5409d91918d5.js',
          revision: '271b5409d91918d5'
        },
        {
          url: '/_next/static/chunks/8738-be73ef7146b996d9.js',
          revision: 'be73ef7146b996d9'
        },
        {
          url: '/_next/static/chunks/8837-3b17a378bf0c9274.js',
          revision: '3b17a378bf0c9274'
        },
        {
          url: '/_next/static/chunks/8881-1b7e7420b0840c88.js',
          revision: '1b7e7420b0840c88'
        },
        {
          url: '/_next/static/chunks/8915-3f2e35c713913e6c.js',
          revision: '3f2e35c713913e6c'
        },
        {
          url: '/_next/static/chunks/897-2a48a16d6c5d363f.js',
          revision: '2a48a16d6c5d363f'
        },
        {
          url: '/_next/static/chunks/9080-ee0fa5ca4d05365c.js',
          revision: 'ee0fa5ca4d05365c'
        },
        {
          url: '/_next/static/chunks/9103-c58524cdeab0b83a.js',
          revision: 'c58524cdeab0b83a'
        },
        {
          url: '/_next/static/chunks/911-3c30774b3e4aa412.js',
          revision: '3c30774b3e4aa412'
        },
        {
          url: '/_next/static/chunks/9242-b3e9d8ae9892b986.js',
          revision: 'b3e9d8ae9892b986'
        },
        {
          url: '/_next/static/chunks/951-5b553898edd16c9d.js',
          revision: '5b553898edd16c9d'
        },
        {
          url: '/_next/static/chunks/9532-1a44ea95dd324a5e.js',
          revision: '1a44ea95dd324a5e'
        },
        {
          url: '/_next/static/chunks/9595-5f265962c7cc39b0.js',
          revision: '5f265962c7cc39b0'
        },
        {
          url: '/_next/static/chunks/9632-1d295c0d8b8b49b8.js',
          revision: '1d295c0d8b8b49b8'
        },
        {
          url: '/_next/static/chunks/9633-541945f14c37a6c1.js',
          revision: '541945f14c37a6c1'
        },
        {
          url: '/_next/static/chunks/9671-24c77356ed59acd3.js',
          revision: '24c77356ed59acd3'
        },
        {
          url: '/_next/static/chunks/973-d75bd1c4ba14f7db.js',
          revision: 'd75bd1c4ba14f7db'
        },
        {
          url: '/_next/static/chunks/9828-5295d4536b1a5e89.js',
          revision: '5295d4536b1a5e89'
        },
        {
          url: '/_next/static/chunks/a93b707c-61971b423b1db0ff.js',
          revision: '61971b423b1db0ff'
        },
        {
          url: '/_next/static/chunks/ab192eb5-ca0dc623a7c5c31a.js',
          revision: 'ca0dc623a7c5c31a'
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-d31583ab83438da6.js',
          revision: 'd31583ab83438da6'
        },
        {
          url: '/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-d31583ab83438da6.js',
          revision: 'd31583ab83438da6'
        },
        {
          url: '/_next/static/chunks/app/dashboard/content-management/gallery/%5Bid%5D/page-ca23560c3f96a24f.js',
          revision: 'ca23560c3f96a24f'
        },
        {
          url: '/_next/static/chunks/app/dashboard/content-management/gallery/page-45b4875028995f23.js',
          revision: '45b4875028995f23'
        },
        {
          url: '/_next/static/chunks/app/dashboard/content-management/guru-template/%5Bid%5D/page-ccdafa4836715694.js',
          revision: 'ccdafa4836715694'
        },
        {
          url: '/_next/static/chunks/app/dashboard/content-management/guru-template/page-7c1746893724d998.js',
          revision: '7c1746893724d998'
        },
        {
          url: '/_next/static/chunks/app/dashboard/content-management/news/%5Bid%5D/page-5243a19576cda5b8.js',
          revision: '5243a19576cda5b8'
        },
        {
          url: '/_next/static/chunks/app/dashboard/content-management/news/page-c564e55db01644e9.js',
          revision: 'c564e55db01644e9'
        },
        {
          url: '/_next/static/chunks/app/dashboard/content-management/testimoni/%5Bid%5D/page-46cd79fc32f11c1b.js',
          revision: '46cd79fc32f11c1b'
        },
        {
          url: '/_next/static/chunks/app/dashboard/content-management/testimoni/page-0fb0ab449759cd66.js',
          revision: '0fb0ab449759cd66'
        },
        {
          url: '/_next/static/chunks/app/dashboard/data-sekolah/page-50ebc5011a41d6f9.js',
          revision: '50ebc5011a41d6f9'
        },
        {
          url: '/_next/static/chunks/app/dashboard/e-konseling/konseling-siswa/%5Bid%5D/page-06314df527a560a6.js',
          revision: '06314df527a560a6'
        },
        {
          url: '/_next/static/chunks/app/dashboard/e-konseling/konseling-siswa/page-65e7b8af228542a4.js',
          revision: '65e7b8af228542a4'
        },
        {
          url: '/_next/static/chunks/app/dashboard/e-konseling/pelanggaran-prestasi/%5Bid%5D/page-034701cd0a4a1cc3.js',
          revision: '034701cd0a4a1cc3'
        },
        {
          url: '/_next/static/chunks/app/dashboard/e-konseling/pelanggaran-prestasi/page-1257f0e94c39fbb1.js',
          revision: '1257f0e94c39fbb1'
        },
        {
          url: '/_next/static/chunks/app/dashboard/e-perpus/data-buku/%5Bid%5D/page-fbd7f98501d293e4.js',
          revision: 'fbd7f98501d293e4'
        },
        {
          url: '/_next/static/chunks/app/dashboard/e-perpus/data-buku/page-dbfdcf594fc9c5f1.js',
          revision: 'dbfdcf594fc9c5f1'
        },
        {
          url: '/_next/static/chunks/app/dashboard/e-perpus/peminjaman-pengembalian/%5Bid%5D/page-d36710326d747a36.js',
          revision: 'd36710326d747a36'
        },
        {
          url: '/_next/static/chunks/app/dashboard/e-perpus/peminjaman-pengembalian/page-7d44a396c836c45f.js',
          revision: '7d44a396c836c45f'
        },
        {
          url: '/_next/static/chunks/app/dashboard/inventaris/daftar-inventaris/%5Bid%5D/page-1f45f8f90eb14a6c.js',
          revision: '1f45f8f90eb14a6c'
        },
        {
          url: '/_next/static/chunks/app/dashboard/inventaris/daftar-inventaris/page-df815741f33628b0.js',
          revision: 'df815741f33628b0'
        },
        {
          url: '/_next/static/chunks/app/dashboard/inventaris/inventaris-masuk/%5BId%5D/page-b9cbc66cb32921cd.js',
          revision: 'b9cbc66cb32921cd'
        },
        {
          url: '/_next/static/chunks/app/dashboard/inventaris/inventaris-masuk/page-d09862c2afb5e62b.js',
          revision: 'd09862c2afb5e62b'
        },
        {
          url: '/_next/static/chunks/app/dashboard/inventaris/jenis-inventaris/%5Bid%5D/page-23d170c6d6250c2c.js',
          revision: '23d170c6d6250c2c'
        },
        {
          url: '/_next/static/chunks/app/dashboard/inventaris/jenis-inventaris/page-4b3e8ff171ba7869.js',
          revision: '4b3e8ff171ba7869'
        },
        {
          url: '/_next/static/chunks/app/dashboard/inventaris/management-inventaris/%5Bid%5D/page-ca19b94445a40f5d.js',
          revision: 'ca19b94445a40f5d'
        },
        {
          url: '/_next/static/chunks/app/dashboard/inventaris/management-inventaris/page-e17c8845719cdc4c.js',
          revision: 'e17c8845719cdc4c'
        },
        {
          url: '/_next/static/chunks/app/dashboard/kanban/page-e0cc5406be353092.js',
          revision: 'e0cc5406be353092'
        },
        {
          url: '/_next/static/chunks/app/dashboard/layout-57177b9b72717af5.js',
          revision: '57177b9b72717af5'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/anggaran/%5Bid%5D/page-f02ca6cd3bb10ed9.js',
          revision: 'f02ca6cd3bb10ed9'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/anggaran/page-bf546a603fda39a2.js',
          revision: 'bf546a603fda39a2'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/arsip/%5Bid%5D/page-53a069029ba85a6c.js',
          revision: '53a069029ba85a6c'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/arsip/page-34221c37fcbef0b6.js',
          revision: '34221c37fcbef0b6'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/guru-staff/%5Bnip%5D/page-73dd0fae671ae704.js',
          revision: '73dd0fae671ae704'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/guru-staff/page-1dc27ec04316a60b.js',
          revision: '1dc27ec04316a60b'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/kegiatan-sekolah/%5Bid%5D/page-37faadc43b6ca679.js',
          revision: '37faadc43b6ca679'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/kegiatan-sekolah/page-f07837bc5d71b587.js',
          revision: 'f07837bc5d71b587'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/kelas/%5Bid%5D/page-eeefef948905e034.js',
          revision: 'eeefef948905e034'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/kelas/page-3f58aebc4995ee36.js',
          revision: '3f58aebc4995ee36'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/list-kelas/%5Bid%5D/page-f80028a8180390f3.js',
          revision: 'f80028a8180390f3'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/list-kelas/page-32a5f60102f135a9.js',
          revision: '32a5f60102f135a9'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/mata-pelajaran/%5Bid%5D/page-fe3bb7e7532cb126.js',
          revision: 'fe3bb7e7532cb126'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/mata-pelajaran/page-c0446198d1c53c12.js',
          revision: 'c0446198d1c53c12'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/pengumuman/%5Bid%5D/page-6789de76a5ee9098.js',
          revision: '6789de76a5ee9098'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/pengumuman/page-a7f58bd5c99f48c7.js',
          revision: 'a7f58bd5c99f48c7'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/ruangan/%5Bid%5D/page-7e2163da7bcb0201.js',
          revision: '7e2163da7bcb0201'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/ruangan/page-908bef8417ad556d.js',
          revision: '908bef8417ad556d'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/siswa/%5Bnis%5D/page-b289584ede9ffc0f.js',
          revision: 'b289584ede9ffc0f'
        },
        {
          url: '/_next/static/chunks/app/dashboard/master-data/siswa/page-7588ea7cdda3cd76.js',
          revision: '7588ea7cdda3cd76'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@area_stats/error-734d38e23243fab1.js',
          revision: '734d38e23243fab1'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@area_stats/loading-d31583ab83438da6.js',
          revision: 'd31583ab83438da6'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@area_stats/page-4db92e7eb931086e.js',
          revision: '4db92e7eb931086e'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@bar_stats/error-c7fd84e35b00718f.js',
          revision: 'c7fd84e35b00718f'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@bar_stats/loading-d31583ab83438da6.js',
          revision: 'd31583ab83438da6'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@bar_stats/page-aa35255b2430cde2.js',
          revision: 'aa35255b2430cde2'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@pie_stats/error-bef9149950911849.js',
          revision: 'bef9149950911849'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@pie_stats/loading-d31583ab83438da6.js',
          revision: 'd31583ab83438da6'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@pie_stats/page-463f1680ddc97f0b.js',
          revision: '463f1680ddc97f0b'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@sales/error-2acdf644a36bb289.js',
          revision: '2acdf644a36bb289'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@sales/loading-d31583ab83438da6.js',
          revision: 'd31583ab83438da6'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/@sales/page-0ea2f0077f95fde0.js',
          revision: '0ea2f0077f95fde0'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/error-f446a50c4fafa343.js',
          revision: 'f446a50c4fafa343'
        },
        {
          url: '/_next/static/chunks/app/dashboard/overview/layout-c7f02caa476cf675.js',
          revision: 'c7f02caa476cf675'
        },
        {
          url: '/_next/static/chunks/app/dashboard/page-d31583ab83438da6.js',
          revision: 'd31583ab83438da6'
        },
        {
          url: '/_next/static/chunks/app/dashboard/pembayaran/daftar-tagihan/%5Bid%5D/page-f2c13efa4949f275.js',
          revision: 'f2c13efa4949f275'
        },
        {
          url: '/_next/static/chunks/app/dashboard/pembayaran/daftar-tagihan/page-6c55c39a5ffa2a2b.js',
          revision: '6c55c39a5ffa2a2b'
        },
        {
          url: '/_next/static/chunks/app/dashboard/pembayaran/riwayat-pembayaran/page-fc4d58c7a5cc69c3.js',
          revision: 'fc4d58c7a5cc69c3'
        },
        {
          url: '/_next/static/chunks/app/dashboard/pendaftaran/%5Bnis%5D/page-3c71c655dab70bf3.js',
          revision: '3c71c655dab70bf3'
        },
        {
          url: '/_next/static/chunks/app/dashboard/pendaftaran/page-4e6a1de0e90e3e3b.js',
          revision: '4e6a1de0e90e3e3b'
        },
        {
          url: '/_next/static/chunks/app/dashboard/presensi/kehadiran/page-4b443b554fd0a986.js',
          revision: '4b443b554fd0a986'
        },
        {
          url: '/_next/static/chunks/app/dashboard/presensi/perizinan/page-d957a9b222fd5ddc.js',
          revision: 'd957a9b222fd5ddc'
        },
        {
          url: '/_next/static/chunks/app/dashboard/product/%5BproductId%5D/page-9e503a6d569d4de1.js',
          revision: '9e503a6d569d4de1'
        },
        {
          url: '/_next/static/chunks/app/dashboard/product/page-9bafe75cb7a70445.js',
          revision: '9bafe75cb7a70445'
        },
        {
          url: '/_next/static/chunks/app/dashboard/profile/page-0477ffe9d136d61b.js',
          revision: '0477ffe9d136d61b'
        },
        {
          url: '/_next/static/chunks/app/layout-ccb0b77611d7fd69.js',
          revision: 'ccb0b77611d7fd69'
        },
        {
          url: '/_next/static/chunks/app/little-alley-cyberschool/page-2c4926a156c8159a.js',
          revision: '2c4926a156c8159a'
        },
        {
          url: '/_next/static/chunks/app/little-alley-preschool/page-ee24c58526d9d693.js',
          revision: 'ee24c58526d9d693'
        },
        {
          url: '/_next/static/chunks/app/login-siswa/page-92f7bce2b742033f.js',
          revision: '92f7bce2b742033f'
        },
        {
          url: '/_next/static/chunks/app/login/page-c560e849aea3915e.js',
          revision: 'c560e849aea3915e'
        },
        {
          url: '/_next/static/chunks/app/logout/page-3a06a57d68f1b2ad.js',
          revision: '3a06a57d68f1b2ad'
        },
        {
          url: '/_next/static/chunks/app/mengajar/e-konseling/konseling-siswa/%5Bid%5D/page-c384becce8301264.js',
          revision: 'c384becce8301264'
        },
        {
          url: '/_next/static/chunks/app/mengajar/e-konseling/konseling-siswa/page-04f2ffb044c719cf.js',
          revision: '04f2ffb044c719cf'
        },
        {
          url: '/_next/static/chunks/app/mengajar/e-konseling/pelanggaran-prestasi/%5Bid%5D/page-24489267252a3872.js',
          revision: '24489267252a3872'
        },
        {
          url: '/_next/static/chunks/app/mengajar/e-konseling/pelanggaran-prestasi/page-34ea4d3bf7840352.js',
          revision: '34ea4d3bf7840352'
        },
        {
          url: '/_next/static/chunks/app/mengajar/e-perpus/data-buku/%5Bid%5D/page-befbc677eb5e6d7f.js',
          revision: 'befbc677eb5e6d7f'
        },
        {
          url: '/_next/static/chunks/app/mengajar/e-perpus/data-buku/page-3b60e0f3e0eae2b5.js',
          revision: '3b60e0f3e0eae2b5'
        },
        {
          url: '/_next/static/chunks/app/mengajar/e-perpus/peminjaman-pengembalian/%5Bid%5D/page-4f5c27619157f645.js',
          revision: '4f5c27619157f645'
        },
        {
          url: '/_next/static/chunks/app/mengajar/e-perpus/peminjaman-pengembalian/page-7d44a396c836c45f.js',
          revision: '7d44a396c836c45f'
        },
        {
          url: '/_next/static/chunks/app/mengajar/jadwal-mengajar/page-8b6df6257abc28a2.js',
          revision: '8b6df6257abc28a2'
        },
        {
          url: '/_next/static/chunks/app/mengajar/janji-temu/page-6d7d65fc7dce6e3a.js',
          revision: '6d7d65fc7dce6e3a'
        },
        {
          url: '/_next/static/chunks/app/mengajar/kelas-mapel/%5Bidkelas%5D/materi/%5Bidmateri%5D/page-d2ee52f5f69e325d.js',
          revision: 'd2ee52f5f69e325d'
        },
        {
          url: '/_next/static/chunks/app/mengajar/kelas-mapel/%5Bidkelas%5D/materi/add/%5Bidmateri%5D/page-462288eb7d61de2d.js',
          revision: '462288eb7d61de2d'
        },
        {
          url: '/_next/static/chunks/app/mengajar/kelas-mapel/%5Bidkelas%5D/page-92198c0272debbea.js',
          revision: '92198c0272debbea'
        },
        {
          url: '/_next/static/chunks/app/mengajar/kelas-mapel/%5Bidkelas%5D/tugas/%5Bidtugas%5D/page-c052686bfcb084ef.js',
          revision: 'c052686bfcb084ef'
        },
        {
          url: '/_next/static/chunks/app/mengajar/kelas-mapel/%5Bidkelas%5D/tugas/add/%5Bidtugas%5D/page-c01d35afecda68d6.js',
          revision: 'c01d35afecda68d6'
        },
        {
          url: '/_next/static/chunks/app/mengajar/kelas-mapel/%5Bidkelas%5D/ujian/%5Bidujian%5D/page-5483e98cf6b744a6.js',
          revision: '5483e98cf6b744a6'
        },
        {
          url: '/_next/static/chunks/app/mengajar/layout-655c32c4fbcd3162.js',
          revision: '655c32c4fbcd3162'
        },
        {
          url: '/_next/static/chunks/app/mengajar/log-absensi/page-d31583ab83438da6.js',
          revision: 'd31583ab83438da6'
        },
        {
          url: '/_next/static/chunks/app/mengajar/page-b7955fac1fe68188.js',
          revision: 'b7955fac1fe68188'
        },
        {
          url: '/_next/static/chunks/app/mengajar/pelanggaran-prestasi/%5Bid%5D/page-1532d87a204e79db.js',
          revision: '1532d87a204e79db'
        },
        {
          url: '/_next/static/chunks/app/mengajar/pelanggaran-prestasi/page-1257f0e94c39fbb1.js',
          revision: '1257f0e94c39fbb1'
        },
        {
          url: '/_next/static/chunks/app/mengajar/pembayaran/daftar-tagihan/%5Bid%5D/page-276a52690a1b1705.js',
          revision: '276a52690a1b1705'
        },
        {
          url: '/_next/static/chunks/app/mengajar/pembayaran/daftar-tagihan/page-2dc3341723fbfc60.js',
          revision: '2dc3341723fbfc60'
        },
        {
          url: '/_next/static/chunks/app/mengajar/pembayaran/riwayat-pembayaran/page-fc4d58c7a5cc69c3.js',
          revision: 'fc4d58c7a5cc69c3'
        },
        {
          url: '/_next/static/chunks/app/mengajar/perizinan-kehadiran/page-9156f6ecda50298f.js',
          revision: '9156f6ecda50298f'
        },
        {
          url: '/_next/static/chunks/app/mengajar/walikelas/%5Bid%5D/kartu-ujian/page-ac06c434df942cf5.js',
          revision: 'ac06c434df942cf5'
        },
        {
          url: '/_next/static/chunks/app/mengajar/walikelas/%5Bid%5D/list-siswa/%5Bidsiswa%5D/page-b652d846a7ed9d01.js',
          revision: 'b652d846a7ed9d01'
        },
        {
          url: '/_next/static/chunks/app/mengajar/walikelas/%5Bid%5D/list-siswa/page-b1410be50294839c.js',
          revision: 'b1410be50294839c'
        },
        {
          url: '/_next/static/chunks/app/mengajar/walikelas/%5Bid%5D/page-84d10592dcd8ae1c.js',
          revision: '84d10592dcd8ae1c'
        },
        {
          url: '/_next/static/chunks/app/mengajar/walikelas/%5Bid%5D/perizinan-siswa/page-db81b6383c26b3e4.js',
          revision: 'db81b6383c26b3e4'
        },
        {
          url: '/_next/static/chunks/app/mengajar/walikelas/%5Bid%5D/rekap-absensi/%5Bidsiswa%5D/page-ae18280af894418d.js',
          revision: 'ae18280af894418d'
        },
        {
          url: '/_next/static/chunks/app/mengajar/walikelas/%5Bid%5D/rekap-absensi/page-78939efa4a48d41d.js',
          revision: '78939efa4a48d41d'
        },
        {
          url: '/_next/static/chunks/app/mengajar/walikelas/%5Bid%5D/rekap-nilai/page-c3d7b778aad1450d.js',
          revision: 'c3d7b778aad1450d'
        },
        {
          url: '/_next/static/chunks/app/not-found-9c9cf2cc652f7aad.js',
          revision: '9c9cf2cc652f7aad'
        },
        {
          url: '/_next/static/chunks/app/page-d0fafd088ee16c40.js',
          revision: 'd0fafd088ee16c40'
        },
        {
          url: '/_next/static/chunks/app/pendaftaran-siswa/page-52ec9c3f00af410e.js',
          revision: '52ec9c3f00af410e'
        },
        {
          url: '/_next/static/chunks/app/siswa/catatan-perkembangan-siswa/page-a5b3944b6fd384b9.js',
          revision: 'a5b3944b6fd384b9'
        },
        {
          url: '/_next/static/chunks/app/siswa/janji-temu/page-f18cae715e3760d7.js',
          revision: 'f18cae715e3760d7'
        },
        {
          url: '/_next/static/chunks/app/siswa/kalender-akademik/page-14f5b082c9d10772.js',
          revision: '14f5b082c9d10772'
        },
        {
          url: '/_next/static/chunks/app/siswa/kelas/%5Bid%5D/materi/%5Bidmateri%5D/page-9135f86c0463670f.js',
          revision: '9135f86c0463670f'
        },
        {
          url: '/_next/static/chunks/app/siswa/kelas/%5Bid%5D/page-61614da3a960ea89.js',
          revision: '61614da3a960ea89'
        },
        {
          url: '/_next/static/chunks/app/siswa/kelas/%5Bid%5D/tugas/%5Bidtugas%5D/page-7bd7d26446ef83dd.js',
          revision: '7bd7d26446ef83dd'
        },
        {
          url: '/_next/static/chunks/app/siswa/kelas/%5Bid%5D/ujian/%5Bidujian%5D/page-596eab8c11321401.js',
          revision: '596eab8c11321401'
        },
        {
          url: '/_next/static/chunks/app/siswa/kelas/page-ad9c1aae27c82d7e.js',
          revision: 'ad9c1aae27c82d7e'
        },
        {
          url: '/_next/static/chunks/app/siswa/konseling/page-4943ef17bef5ccb2.js',
          revision: '4943ef17bef5ccb2'
        },
        {
          url: '/_next/static/chunks/app/siswa/layout-7040a854ce03d2db.js',
          revision: '7040a854ce03d2db'
        },
        {
          url: '/_next/static/chunks/app/siswa/log-presensi/page-454027a299a21eb8.js',
          revision: '454027a299a21eb8'
        },
        {
          url: '/_next/static/chunks/app/siswa/log-tabungan/page-060e5b10bd5b5a88.js',
          revision: '060e5b10bd5b5a88'
        },
        {
          url: '/_next/static/chunks/app/siswa/nilai-siswa/page-d5597d117ffb099e.js',
          revision: 'd5597d117ffb099e'
        },
        {
          url: '/_next/static/chunks/app/siswa/notifikasi/page-57ffef6c96ab15f1.js',
          revision: '57ffef6c96ab15f1'
        },
        {
          url: '/_next/static/chunks/app/siswa/page-3fd7c2212df57877.js',
          revision: '3fd7c2212df57877'
        },
        {
          url: '/_next/static/chunks/app/siswa/pelanggaran/page-8e845c364db05102.js',
          revision: '8e845c364db05102'
        },
        {
          url: '/_next/static/chunks/app/siswa/pembayaran/page-8b85838e9e0cb244.js',
          revision: '8b85838e9e0cb244'
        },
        {
          url: '/_next/static/chunks/app/siswa/pengumuman/page-14540bd8e508875a.js',
          revision: '14540bd8e508875a'
        },
        {
          url: '/_next/static/chunks/app/siswa/perizinan/page-1660d64fb251ff61.js',
          revision: '1660d64fb251ff61'
        },
        {
          url: '/_next/static/chunks/app/siswa/perpustakaan/page-ee867d0fe8c7ee3a.js',
          revision: 'ee867d0fe8c7ee3a'
        },
        {
          url: '/_next/static/chunks/app/siswa/prestasi/page-11c9f23c92d67dde.js',
          revision: '11c9f23c92d67dde'
        },
        {
          url: '/_next/static/chunks/app/siswa/rapot/%5Bid%5D/page-0a779b9962b1030d.js',
          revision: '0a779b9962b1030d'
        },
        {
          url: '/_next/static/chunks/app/siswa/rapot/page-26b8496efd325e81.js',
          revision: '26b8496efd325e81'
        },
        {
          url: '/_next/static/chunks/app/siswa/ubah-password/page-08fa1e1820ca62ba.js',
          revision: '08fa1e1820ca62ba'
        },
        {
          url: '/_next/static/chunks/app/siswa/weekly-activity/page-fc069fb4da4986fd.js',
          revision: 'fc069fb4da4986fd'
        },
        {
          url: '/_next/static/chunks/app/unauthorized/page-8490ca9d4062266b.js',
          revision: '8490ca9d4062266b'
        },
        {
          url: '/_next/static/chunks/framework-071ff1de338133d6.js',
          revision: '071ff1de338133d6'
        },
        {
          url: '/_next/static/chunks/main-app-952d7c2adeff986e.js',
          revision: '952d7c2adeff986e'
        },
        {
          url: '/_next/static/chunks/main-c62f3f6ade77de42.js',
          revision: 'c62f3f6ade77de42'
        },
        {
          url: '/_next/static/chunks/pages/_app-fd8fed0f1fd2dbe1.js',
          revision: 'fd8fed0f1fd2dbe1'
        },
        {
          url: '/_next/static/chunks/pages/_error-4d4a5a208fd02269.js',
          revision: '4d4a5a208fd02269'
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f'
        },
        {
          url: '/_next/static/chunks/webpack-23bf2e637627fa4d.js',
          revision: '23bf2e637627fa4d'
        },
        {
          url: '/_next/static/css/2e85c571399b9690.css',
          revision: '2e85c571399b9690'
        },
        {
          url: '/_next/static/css/30ed0e4cd604b851.css',
          revision: '30ed0e4cd604b851'
        },
        {
          url: '/_next/static/css/4607fd028f2808fb.css',
          revision: '4607fd028f2808fb'
        },
        {
          url: '/_next/static/css/6245fe8b36c40c24.css',
          revision: '6245fe8b36c40c24'
        },
        {
          url: '/_next/static/css/8aee48eb52f4c731.css',
          revision: '8aee48eb52f4c731'
        },
        {
          url: '/_next/static/css/d1819de920e34bd6.css',
          revision: 'd1819de920e34bd6'
        },
        {
          url: '/_next/static/css/efc0c72bbfba9003.css',
          revision: 'efc0c72bbfba9003'
        },
        {
          url: '/_next/static/css/f055e431c58b907b.css',
          revision: 'f055e431c58b907b'
        },
        {
          url: '/_next/static/media/39969fcf98a3026e-s.woff2',
          revision: '01cbba1eab04f564e7d2f44107608d74'
        },
        {
          url: '/_next/static/media/4de1fea1a954a5b6-s.p.woff2',
          revision: 'b7d6b48d8d12946dc808ff39aed6c460'
        },
        {
          url: '/_next/static/media/6d664cce900333ee-s.p.woff2',
          revision: '017598645bcc882a3610effe171c2ca3'
        },
        {
          url: '/_next/static/media/7ff6869a1704182a-s.p.woff2',
          revision: 'cf5ec3859b05de1b9351ab934b937417'
        },
        { url: '/_next/static/media/Foto.e6dd413f.png', revision: 'e6dd413f' },
        {
          url: '/_next/static/media/Garis.9842db97.png',
          revision: '060dad5ba9b80511ebd403cc143b29bb'
        },
        {
          url: '/_next/static/media/Logo.d3c6a2d3.png',
          revision: '89fe879f441dd4b1e761d4be6cf9bfd6'
        },
        {
          url: '/_next/static/media/Notif.28c8c2f9.png',
          revision: 'f66260f70c62d692de44780bfd402a0d'
        },
        {
          url: '/_next/static/media/background.cfa5263f.png',
          revision: 'cfa5263f'
        },
        {
          url: '/_next/static/media/background.cfa5263f.png',
          revision: '0f6a925e1d5b573f23c64a36b487b253'
        },
        {
          url: '/_next/static/media/banner.2ac908be.jpg',
          revision: '2ac908be'
        },
        {
          url: '/_next/static/media/bglac2.e3f44c9d.jpeg',
          revision: '133b2383b06e7d202953de410904b498'
        },
        {
          url: '/_next/static/media/cce080f35d014443-s.woff2',
          revision: 'b0d4953143648e4486d93df16327b906'
        },
        {
          url: '/_next/static/media/child1lac.8cae3dd8.jpg',
          revision: 'd73dc948f95636fcbfea00aaa4d6daf0'
        },
        {
          url: '/_next/static/media/child2lac.2608adf6.jpg',
          revision: 'ae4af197fb60700436401dae5f4bd1ae'
        },
        {
          url: '/_next/static/media/child3lac.f6d5c115.jpg',
          revision: '3146469975cefd7938e24522acd85130'
        },
        {
          url: '/_next/static/media/child4lac.64ed3379.jpg',
          revision: 'c590a715cc084a861a69f6868f26ed8e'
        },
        {
          url: '/_next/static/media/childs1.51a3074f.jpg',
          revision: 'a14568b5b6d7ef3cd72323ba395ddb1c'
        },
        {
          url: '/_next/static/media/childs2.ae4ce7ee.jpg',
          revision: 'a5d1a318df6f7c08d2e8be94a787d112'
        },
        {
          url: '/_next/static/media/childs3.50ad73f9.jpg',
          revision: 'e74a3f81c23a1fd1e14546ffb2322208'
        },
        {
          url: '/_next/static/media/curriculumLAC.bffa030e.png',
          revision: 'd907166224a3f3adec7b094fbd70d1e6'
        },
        {
          url: '/_next/static/media/education.6e1e1b14.png',
          revision: '05b2cbd19f5042c4cb47d4bb0080dfeb'
        },
        {
          url: '/_next/static/media/event1.eb94b3b6.jpg',
          revision: 'a369e0d72659f02ec891345ef20d583c'
        },
        {
          url: '/_next/static/media/event2.f3b0c375.jpg',
          revision: 'fb84dbc0ec70d8eae1cbf3f973a31065'
        },
        {
          url: '/_next/static/media/f97d1853053d8931-s.woff2',
          revision: 'ccbd9d26e2deabe33542ffb7de6494f2'
        },
        {
          url: '/_next/static/media/fasilitas1.9015924e.jpg',
          revision: 'dc407cb6c785b76aab8fe58847f4dacb'
        },
        {
          url: '/_next/static/media/fasilitas2.ce2cedb2.jpg',
          revision: '2dc791d21ec910d21b83493451035ba2'
        },
        {
          url: '/_next/static/media/fasilitas3.50ed4e2d.jpg',
          revision: '17c7c55d1722301cbd2109c367edd978'
        },
        {
          url: '/_next/static/media/fasilitas4.53e0ca4e.jpg',
          revision: '2731302e6ef790853a7977415c002729'
        },
        {
          url: '/_next/static/media/fasilitas5.b27f74de.jpg',
          revision: 'bf5ef6759a70a4705ed076dbbe126a80'
        },
        {
          url: '/_next/static/media/fasilitas6.d860956d.jpg',
          revision: 'ba30edcc77e8ce2675d885f56b01666e'
        },
        {
          url: '/_next/static/media/fasilitaslac10.ece4f8ca.jpg',
          revision: 'd5fb0d1a69e59c1ab206a014e8d1809d'
        },
        {
          url: '/_next/static/media/fasilitaslac11.1d08bf35.jpg',
          revision: '4ae44e5e8063d99e3e48c80220e066a8'
        },
        {
          url: '/_next/static/media/fasilitaslac12.df374709.jpg',
          revision: 'd5b337636d43ae09053ac94e7049e9d3'
        },
        {
          url: '/_next/static/media/fasilitaslac14.2f45d2dd.jpg',
          revision: '54f60a3c11932630cbbb781efa78ff82'
        },
        {
          url: '/_next/static/media/fasilitaslac7.a550af1c.jpg',
          revision: '2da925f1016f6a085b0c5a92c1d62d8c'
        },
        {
          url: '/_next/static/media/fasilitaslac8.f9f491f3.jpg',
          revision: 'dbef055f8e6e277cad9c049cc769e4f6'
        },
        {
          url: '/_next/static/media/fasilitaslac9.4da2846a.jpg',
          revision: '0012f78babb4ea3da9d8ce793a0bc7bb'
        },
        {
          url: '/_next/static/media/founder.b7890056.jpg',
          revision: 'b7890056'
        },
        {
          url: '/_next/static/media/founder.b7890056.jpg',
          revision: '7543046736e33d55afbe4943db453cf5'
        },
        {
          url: '/_next/static/media/logoYayasan.54120ea7.png',
          revision: '915fb6403ce1c78014cecac64dc4ed68'
        },
        {
          url: '/_next/static/media/playgroup.250bbf90.jpeg',
          revision: '167a2ffe66e759b9f2d8492a057bd8d6'
        },
        { url: '/awan.png', revision: '6878ce268bfcc48b341762d8881cdfa1' },
        { url: '/awan2.png', revision: '6878ce268bfcc48b341762d8881cdfa1' },
        {
          url: '/background.png',
          revision: '0f6a925e1d5b573f23c64a36b487b253'
        },
        { url: '/banner.jpg', revision: 'b36e17823247e2734d01be6177275d12' },
        { url: '/bg2.jpg', revision: '32af1f639b207f2ab12ac26f026dbcce' },
        { url: '/bg20.jpg', revision: '62f1c95f4625c8874599db3280f9ca83' },
        { url: '/bglac2.jpeg', revision: '133b2383b06e7d202953de410904b498' },
        { url: '/child1lac.jpg', revision: 'd73dc948f95636fcbfea00aaa4d6daf0' },
        { url: '/child2lac.jpg', revision: 'ae4af197fb60700436401dae5f4bd1ae' },
        { url: '/child3lac.jpg', revision: '3146469975cefd7938e24522acd85130' },
        { url: '/child4lac.jpg', revision: 'c590a715cc084a861a69f6868f26ed8e' },
        { url: '/children.png', revision: '3fc831821787d5a0c8301a148ca869fa' },
        { url: '/children2.png', revision: '3a7a73272f1ad4f6bce09f8123eed03f' },
        { url: '/childs1.jpg', revision: 'a14568b5b6d7ef3cd72323ba395ddb1c' },
        { url: '/childs2.jpg', revision: 'a5d1a318df6f7c08d2e8be94a787d112' },
        { url: '/childs3.jpg', revision: 'e74a3f81c23a1fd1e14546ffb2322208' },
        {
          url: '/curriculumLAC.png',
          revision: 'd907166224a3f3adec7b094fbd70d1e6'
        },
        { url: '/education.png', revision: '05b2cbd19f5042c4cb47d4bb0080dfeb' },
        { url: '/event1.jpg', revision: 'a369e0d72659f02ec891345ef20d583c' },
        { url: '/event10.jpg', revision: '052e46b6e43a799de306f278e8100c2e' },
        { url: '/event2.jpg', revision: 'fb84dbc0ec70d8eae1cbf3f973a31065' },
        { url: '/event3.jpg', revision: 'ae3133655611e1ead77770ac6a8d5d5f' },
        { url: '/event4.jpg', revision: 'c40b8dbe00628fb3d9ab68e2d27cfef2' },
        { url: '/event5.jpg', revision: '461f6d0dbbed865e63e49b8ce5d483b0' },
        { url: '/event6.jpg', revision: '71985ca61414bc2355f9f992a1ae4b61' },
        { url: '/event7.jpg', revision: 'a77240f07aeae37e06532d390597d725' },
        { url: '/event8.jpg', revision: '72413e71c0e07962feb7cff86c50c388' },
        { url: '/event9.jpg', revision: 'aa79d383d1f060865ce9787e7caaed47' },
        {
          url: '/fasilitas1.jpg',
          revision: 'dc407cb6c785b76aab8fe58847f4dacb'
        },
        {
          url: '/fasilitas2.jpg',
          revision: '2dc791d21ec910d21b83493451035ba2'
        },
        {
          url: '/fasilitas3.jpg',
          revision: '17c7c55d1722301cbd2109c367edd978'
        },
        {
          url: '/fasilitas4.jpg',
          revision: '2731302e6ef790853a7977415c002729'
        },
        {
          url: '/fasilitas5.jpg',
          revision: 'bf5ef6759a70a4705ed076dbbe126a80'
        },
        {
          url: '/fasilitas6.jpg',
          revision: 'ba30edcc77e8ce2675d885f56b01666e'
        },
        {
          url: '/fasilitas7.jpg',
          revision: '9f09e7ff18216de04459084baf47131a'
        },
        {
          url: '/fasilitaslac10.jpg',
          revision: 'd5fb0d1a69e59c1ab206a014e8d1809d'
        },
        {
          url: '/fasilitaslac11.jpg',
          revision: '4ae44e5e8063d99e3e48c80220e066a8'
        },
        {
          url: '/fasilitaslac12.jpg',
          revision: 'd5b337636d43ae09053ac94e7049e9d3'
        },
        {
          url: '/fasilitaslac14.jpg',
          revision: '54f60a3c11932630cbbb781efa78ff82'
        },
        {
          url: '/fasilitaslac7.jpg',
          revision: '2da925f1016f6a085b0c5a92c1d62d8c'
        },
        {
          url: '/fasilitaslac8.jpg',
          revision: 'dbef055f8e6e277cad9c049cc769e4f6'
        },
        {
          url: '/fasilitaslac9.jpg',
          revision: '0012f78babb4ea3da9d8ce793a0bc7bb'
        },
        { url: '/founder.jpg', revision: '7543046736e33d55afbe4943db453cf5' },
        { url: '/galery1.jpg', revision: '6a35ea058692ec36fd013cd877f7b9db' },
        { url: '/galery2.jpg', revision: 'a17b82ea6b61bc0847484332c8e58d9e' },
        { url: '/galery3.jpg', revision: 'c1f777325efc71365753ff195e22e15c' },
        { url: '/galery4.jpg', revision: '3748e46f7513de2695788c9813d919d7' },
        { url: '/galery5.jpg', revision: '08702ce2d4b5fc89f6fc667b9bba28fd' },
        { url: '/galery6.jpg', revision: 'eafc19730c8ff5e5545b1d4913986915' },
        { url: '/galery7.jpg', revision: 'd37a2a5483ad8e76281c65a0c1cfea96' },
        { url: '/guy.jpg', revision: '3505c48ff7141c12bd02d2c2d22786ed' },
        { url: '/hinata.jpg', revision: 'b44b13e9a4440cf28a5d61ad8d941e53' },
        {
          url: '/icons/icon-192.png',
          revision: '12439dcb286d71779fbddc2d7c06fec3'
        },
        {
          url: '/icons/icon-512.png',
          revision: '0b1f25da520d34265a8ffec9bd301ce3'
        },
        { url: '/itachi.jpg', revision: 'ea96e8371cc64a89ab7a93447de0cccf' },
        { url: '/jiraya.jpg', revision: '78551b5c21ce31e459e5346a036e3133' },
        { url: '/kakashi.jpg', revision: '9b469b983384d90380338ba4ec7d3711' },
        { url: '/lac-anak1.png', revision: '7781f95d22ee46252e63a581618e9770' },
        { url: '/lac-anak2.png', revision: 'e62b328fac33e42df56d84b6e6e4d2e7' },
        { url: '/lacbg1.jpg', revision: 'aed0b7da90de5e453c0c4c8e1234c201' },
        { url: '/lap-anak1.png', revision: '8d3467fb8f329deeccf3722fa9328faa' },
        { url: '/lap-anak2.png', revision: 'bc499ca16a0bb96e261185fca70036a8' },
        { url: '/logo2.png', revision: '91bdb82c3fcd5888e4caaed056208ea2' },
        { url: '/logo3.png', revision: '4d7f5c11504dadea457d08909582989b' },
        {
          url: '/logoYayasan.png',
          revision: '915fb6403ce1c78014cecac64dc4ed68'
        },
        { url: '/manifest.json', revision: 'dd483c91c8bbc1dc88f023f9f7bd2c7c' },
        { url: '/naruto.jpg', revision: '970719447ed489a33651d2a61ee2c741' },
        { url: '/news.jpg', revision: 'b1d74eba9fd5ece6879515dc916a516b' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        {
          url: '/playgroup.jpeg',
          revision: '167a2ffe66e759b9f2d8492a057bd8d6'
        },
        { url: '/primary1.jpg', revision: '5d68d2d487c336d82f91d9a158522c76' },
        { url: '/primary2.jpg', revision: '8447c69669edd0f2e9de26d1f11cb8fb' },
        { url: '/primary3.jpg', revision: '2ec1c4344f9605a028b71db3e98ea639' },
        { url: '/primary4.jpg', revision: '27cfeeee04c7d5ac87edb1fa40cf4fbd' },
        { url: '/primary5.jpg', revision: '10e1f8186e8908ddbc02380baf97b9ed' },
        { url: '/primary6.jpg', revision: 'e2c741da9d841274152277fcf7245b15' },
        { url: '/push-sw.js', revision: '6ca1246c07683e8b3aa8d73221a6dda6' },
        { url: '/react.svg', revision: 'f0402b67b6ce880f65666bb49e841696' },
        { url: '/robots.txt', revision: 'b0e793507c28177ce498bff60bf432d9' },
        { url: '/rocklee.jpg', revision: 'e9ded75148ec8dbf3d106708f0db81b2' },
        { url: '/shikamaru.jpg', revision: 'ad6aa412bd800cbc4b14c9062ec14ed5' },
        { url: '/sitemap.xml', revision: '2cbca0495838c2e53bc854d9aaf0cf14' },
        { url: '/slider1.jpg', revision: 'f0d5017f75f3e224b9c54ed0406fc30e' },
        { url: '/slider2.jpg', revision: '428c1a1dcde1bb7a6aa9d1cb9f9b9647' },
        { url: '/th.jpg', revision: 'a52b129ed10ef4b18b7cd6a567bc4f7a' },
        { url: '/vercel.png', revision: '89fe879f441dd4b1e761d4be6cf9bfd6' },
        { url: '/vercel.svg', revision: '6d67dacb9b804af63d63d552f9660ac7' }
      ],
      { ignoreURLParametersMatching: [] }
    ),
    a.cleanupOutdatedCaches(),
    a.registerRoute(
      '/',
      new a.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: a,
              response: e,
              event: s,
              state: i
            }) =>
              e && 'opaqueredirect' === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: e.headers
                  })
                : e
          }
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new a.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new a.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new a.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new a.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new a.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new a.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new a.RangeRequestsPlugin(),
          new a.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /\.(?:mp4)$/i,
      new a.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new a.RangeRequestsPlugin(),
          new a.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /\.(?:js)$/i,
      new a.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /\.(?:css|less)$/i,
      new a.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new a.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new a.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      ({ url: a }) => {
        if (!(self.origin === a.origin)) return !1;
        const e = a.pathname;
        return !e.startsWith('/api/auth/') && !!e.startsWith('/api/');
      },
      new a.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      ({ url: a }) => {
        if (!(self.origin === a.origin)) return !1;
        return !a.pathname.startsWith('/api/');
      },
      new a.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    a.registerRoute(
      ({ url: a }) => !(self.origin === a.origin),
      new a.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new a.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })
        ]
      }),
      'GET'
    );
});
