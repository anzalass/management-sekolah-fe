'use client';
import { useEffect, useMemo, useState } from 'react';
import { Check, GraduationCap, Home } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import banner from '../../../public/background.png';
import banner1 from '../../../public/background.png';
import banner2 from '../../../public/event1.jpg';
import banner3 from '../../../public/event2.jpg';
import child1 from '../../../public/childs1.jpg';
import child2 from '../../../public/childs2.jpg';
import child3 from '../../../public/childs3.jpg';

import Fasilitas1 from '../../../public/fasilitaslac7.jpg';
import Fasilitas2 from '../../../public/fasilitaslac8.jpg';
import Fasilitas3 from '../../../public/fasilitaslac9.jpg';
import Fasilitas4 from '../../../public/fasilitaslac10.jpg';
import Fasilitas5 from '../../../public/fasilitaslac11.jpg';
import Fasilitas6 from '../../../public/fasilitaslac12.jpg';
import Fasilitas8 from '../../../public/fasilitaslac14.jpg';

import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import Jumbotron from './jumbotron';
import { AboutUs } from './about-us';
import { VisionAndMission } from './visimisi';
import { CurriculumSection } from './curriculum';
import OurFacilities from './ourfacilities';
import { WhyLittleAlley } from './whylittlealley';
const images = [child1, child2, child3];

export default function CyberschoolLanding() {
  const [activeClass, setActiveClass] = useState(0);

  // Intersection observer animation
  const [refAbout, inViewAbout] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const [refVision, inViewVision] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const [refWhy, inViewWhy] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [refCurriculum, inViewCurriculum] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const slides = useMemo(() => [banner1, banner2, banner3], []);

  const [showAbout, setShowAbout] = useState(false);
  const [showVision, setShowVision] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => {
    if (inViewAbout) setShowAbout(true);
    if (inViewVision) setShowVision(true);
    if (inViewWhy) setShowWhy(true);
  }, [inViewAbout, inViewVision, inViewWhy]);

  const classes = [
    { name: 'Primary 1', color: 'from-red-400 to-pink-500', src: '' },
    { name: 'Primary 2', color: 'from-orange-400 to-red-500', src: '' },
    { name: 'Primary 3', color: 'from-yellow-400 to-orange-500', src: '' },
    { name: 'Primary 4', color: 'from-green-400 to-emerald-500', src: '' },
    { name: 'Primary 5', color: 'from-blue-400 to-cyan-500', src: '' },
    { name: 'Primary 6', color: 'from-purple-400 to-pink-500', src: '' }
  ];

  const fasilitasImages = [
    { src: Fasilitas1, alt: 'Facility 1' },
    { src: Fasilitas2, alt: 'Facility 2' },
    { src: Fasilitas3, alt: 'Facility 3' },
    { src: Fasilitas4, alt: 'Facility 4' },
    { src: Fasilitas5, alt: 'Facility 5' },
    { src: Fasilitas6, alt: 'Facility 6' },
    { src: Fasilitas8, alt: 'Facility 8' }
  ];

  const iteachPrinciples = [
    {
      key: 'i',
      text: 'integrated approach to learning',
      color: 'from-red-500 to-pink-500'
    },
    {
      key: 'T',
      text: 'Teachers as facilitators of learning',
      color: 'from-orange-500 to-red-500'
    },
    {
      key: 'e',
      text: 'engaging children through purposeful play',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      key: 'a',
      text: 'authentic learning through quality interactions',
      color: 'from-green-500 to-emerald-500'
    },
    {
      key: 'c',
      text: 'children as constructors of knowledge',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'h',
      text: 'holistic development',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const facilities = [
    'Spacious and Safe Learning Environment',
    'Well-Equipped Classrooms',
    'Library and Resource Center',
    'Playgrounds and Sports Facilities'
  ];

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />

      <Jumbotron
        banner={banner1}
        content='Active, Curious & Creative Learning for Future Leaders'
        title1='🎓  Learning Excellence'
        title2='Little Alley'
        title3='Cyberschool'
      />
      <div className='w-full bg-[#bde0fe]'>
        <AboutUs
          title='Little Alley Cyberschool'
          content1='Little Alley is a refresh kindergarten curriculum framework that highlights teaching and learning principles that are relevant for developing competencies of young children'
          content2='We believe that every child is a unique learner with unlimited potential waiting to be unlocked.'
          content3='Kidsroom is designed to provide a nurturing and inspiring environment where children can grow academically and personally.'
          images={images}
          refAbout={refAbout}
          showAbout={showAbout}
        />
      </div>

      <VisionAndMission refVision={refVision} showVision={showVision} />

      {/* Our Classes */}
      <section className='bg-white py-20'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-5xl font-bold text-blue-900'>
              OUR CLASSES
            </h2>
            <p className='text-xl text-gray-600'>
              Primary education tailored to each student's needs
            </p>
          </div>

          <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
            {classes.map((cls, idx) => (
              <div
                key={idx}
                className='group cursor-pointer'
                onClick={() => setActiveClass(idx)}
              >
                <div
                  className={`relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 ${
                    activeClass === idx
                      ? 'scale-105 shadow-2xl'
                      : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`aspect-square bg-gradient-to-br ${cls.color} flex items-center justify-center p-8`}
                  >
                    <div className='text-center'>
                      <GraduationCap className='mx-auto mb-4 h-16 w-16 text-white' />
                      <h3 className='text-2xl font-bold text-white'>
                        {cls.name}
                      </h3>
                    </div>
                  </div>
                  {activeClass === idx && (
                    <div className='absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm'>
                      <Check className='h-16 w-16 text-white' />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyLittleAlley refWhy={refWhy} showWhy={showWhy} />

      {/* Facilities */}
      <div className='w-full bg-[#bde0fe]'>
        <CurriculumSection
          inViewCurriculum={inViewCurriculum}
          refCurriculum={refCurriculum}
        />
      </div>

      <OurFacilities
        fasilitasImages={fasilitasImages}
        fasilities={facilities}
      />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Footer />
    </div>
  );
}
