import React from 'react';
import Logo from '../../../public/logoYayasan.png';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className='bg-[#005A8C] py-10 text-white'>
      <div className='container mx-auto flex flex-col items-start justify-between gap-10 px-4 md:flex-row'>
        <div className='flex flex-col items-start gap-4 md:flex-row'>
          <Image
            src={Logo}
            alt='Little Alley PreSchool Logo'
            className='-mb-10 -ml-9 -mt-10 h-[174px] w-[140px] md:-ml-10 md:-mt-5 md:mb-0 md:h-[230px] md:w-[190px]'
          />
          <div className='space-y-4 text-sm'>
            <div>
              <p className='font-bold'>Little Alley PreSchool ( LAP )</p>
              <p>
                Ruko Terrace 8, Suvarna Bianca Utama No.9 Blok B, Sutera,
                Sindang Jaya, Tangerang Regency, BANTEN 15560
              </p>
            </div>
            <div>
              <p className='font-bold'>KidsRoom ( KR )</p>
              <p>
                Ruko Terrace 8, Suvarna Bianca Utama No.9 Blok B, Sutera,
                Sindang Jaya, Tangerang Regency, BANTEN 15560
              </p>
            </div>
            <div>
              <p className='font-bold'>Little Alley CyberSchool ( LAC )</p>
              <p>
                Ruko terrace 9, blok D no.38, Suvarna Sutera, Sindang Jaya,
                Tangerang Regency, BANTEN 15560
              </p>
            </div>
          </div>
        </div>
        <div className='text-sm'>
          <p className='mb-4 max-w-sm'>
            For inquiries, admissions, partnership opportunities or to learn
            more about Yayasan Tunas Anak Mulia, please contact us at:
          </p>
          <div className='mb-2 flex items-start gap-2'>
            <i className='fas fa-phone-alt mt-1'></i>
            <span>0857162373 / 082314069645</span>
          </div>
          <div className='mb-2 flex items-start gap-2'>
            <i className='fas fa-envelope mt-1'></i>
            <span>littlealleypresschool@gmail.com</span>
          </div>
          <div className='mb-2 flex items-start gap-2'>
            <i className='fab fa-instagram mt-1'></i>
            <span>@LittleAlleyPreschool</span>
          </div>
        </div>
      </div>

      <div className='mt-10 text-center text-xs text-white'>
        © 2025 <span className='font-bold'>Yayasan Tunas Anak Mulia.</span> All
        Right Reserved
      </div>
    </footer>
  );
}
