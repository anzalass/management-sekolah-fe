'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import logo3 from '../../../public/logo3.png';
import Ellipse from '../../../public/Ellipse.png';
import { easeInOut } from 'framer-motion';
import Children from '../../../public/children.png';
import Education from '../../../public/curriculumLAC.png';
import Fasilitas1 from '../../../public/fasilitas1.jpg';
import Fasilitas2 from '../../../public/fasilitas2.jpg';
import Fasilitas3 from '../../../public/fasilitas3.jpg';
import Fasilitas4 from '../../../public/fasilitas4.jpg';
import Fasilitas5 from '../../../public/fasilitas5.jpg';
import Galery1 from '../../../public/galery1.jpg';
import Galery2 from '../../../public/galery2.jpg';
import Galery3 from '../../../public/galery3.jpg';
import Galery4 from '../../../public/galery4.jpg';
import Galery5 from '../../../public/galery5.jpg';
import Galery6 from '../../../public/galery6.jpg';
import Galery7 from '../../../public/galery7.jpg';
import Garis from '../../../public/Garis.png';
import Awan from '../../../public/awan.png';
import Awan2 from '../../../public/awan2.png';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../components/layout/footer';
import Image from 'next/image';
import Navbar from '../../components/layout/navbar';

const fadeIn = (direction = 'up', delay = 0) => {
  return {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: easeInOut
      }
    }
  };
};

const testimonials = [
  {
    img: Fasilitas1,
    text: '“blablablala...”'
  },
  {
    img: Fasilitas2,
    text: '“blablablala...”'
  },
  {
    img: Fasilitas3,
    text: '“blablablala...”'
  },
  {
    img: Fasilitas4,
    text: '“blablablala...”'
  },
  {
    img: Fasilitas5,
    text: '“Tambahan agar loop & next jalan.”'
  }
];

const galleryImages = [
  Galery1,
  Galery2,
  Galery3,
  Galery4,
  Galery5,
  Galery6,
  Galery7
];

export default function LacView() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [refAbout, inViewAbout] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const [refVision, inViewVision] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [showAbout, setShowAbout] = useState(false);
  const [showVision, setShowVision] = useState(false);

  const [refWhy, inViewWhy] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const [showWhy, setShowWhy] = useState(false);
  const [refCurriculum, inViewCurriculum] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  useEffect(() => {
    if (inViewAbout) setShowAbout(true);
    if (inViewVision) setShowVision(true);
    if (inViewWhy) setShowWhy(true);
  }, [inViewAbout, inViewVision, inViewWhy]);
  return (
    <div className='lac md:overflow-x-hidden'>
      <Navbar />
      <div className='bg-lac relative z-0 flex flex-wrap items-start justify-center gap-10 bg-cover bg-center p-4 pt-28'>
        <div className='absolute inset-0 z-0 bg-black bg-opacity-40'></div>
        <div className='tes relative z-10 ml-[-35px] flex w-full flex-col items-start p-10 text-white md:w-1/2 lg:ml-0 lg:ml-[-100px]'>
          <h1
            className='pb-7 text-3xl font-bold sm:text-4xl md:text-5xl'
            style={{ fontFamily: "'Poetsen One', sans-serif" }}
          >
            A HAPPY
          </h1>
          <h1
            className='w-[400px] pb-10 text-3xl font-bold sm:text-4xl md:text-5xl lg:w-auto'
            style={{ fontFamily: "'Poetsen One', sans-serif" }}
          >
            PRE-SCHOOL
          </h1>
          <p className='font-montserrat pb-1 text-lg font-bold'>
            Where every day is an unforgettable
          </p>
          <p className='font-montserrat pb-7 text-lg font-bold'>
            adventure of learning
          </p>
          <div className='flex gap-4 sm:flex-row'>
            <a href='/pendaftaran-siswa'>
              <button className='rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700'>
                Join Us
              </button>
            </a>
            <a href='#about'>
              <button className='rounded border border-white bg-transparent px-6 py-2 font-semibold text-white hover:bg-white/20'>
                Learn More
              </button>
            </a>
          </div>
        </div>
        <div className='relative z-10 flex w-full justify-end pr-4 md:w-[500px]'>
          <Image
            width={1000}
            height={1000}
            src={logo3}
            alt='Logo'
            className='absolute right-[-110px] top-[-32rem] h-40 object-contain md:left-72 md:right-auto lg:relative lg:left-20 lg:top-[-110px] lg:ml-44 lg:h-60'
          />
        </div>
      </div>

      <motion.div
        ref={refAbout}
        initial={{ opacity: 0, x: -100 }}
        animate={showAbout ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className='mx-auto mt-20 max-w-4xl px-4 py-12 sm:max-w-full md:mb-[30rem] lg:mb-0'
      >
        <div
          className='about flex flex-col items-center justify-center sm:gap-4 md:flex-row md:gap-28 md:pl-[100px] lg:ml-64 lg:gap-32'
          id='about'
        >
          <div className='group relative flex items-center justify-center sm:w-full md:w-auto'>
            <Image
              width={1000}
              height={1000}
              alt='Back card'
              src='https://storage.googleapis.com/a1aa/image/d8ef3b8c-4a38-4a11-7f34-2897f7117777.jpg'
              className='absolute left-0 top-0 z-10 h-[250px] w-[250px] rotate-[-10deg] transform rounded-md object-cover transition-transform duration-500 ease-in-out group-hover:z-20 group-hover:-translate-y-4 group-hover:translate-x-4 group-hover:scale-110 sm:h-[200px] sm:w-[200px]'
            />
            <Image
              width={1000}
              height={1000}
              alt='Front card'
              src='https://storage.googleapis.com/a1aa/image/405ee2e3-92a0-4c62-563a-c7293cd2229e.jpg'
              className='absolute left-8 top-6 z-20 h-[250px] w-[250px] rotate-[3deg] transform rounded-md object-cover transition-transform duration-500 ease-in-out group-hover:z-10 group-hover:-translate-x-2 group-hover:translate-y-2 group-hover:scale-95 sm:h-[200px] sm:w-[200px]'
            />
            <div className='invisible h-44 w-44 sm:h-52 sm:w-52'></div>
          </div>

          <div className='relative max-w-xl text-left sm:w-full'>
            <span className='garis mb-3 block h-1 w-28 justify-center bg-blue-700'></span>
            <h2
              className='mb-3 text-4xl font-semibold text-[#017BBD] sm:text-2xl'
              style={{ fontFamily: "'Poetsen One', sans-serif" }}
            >
              ABOUT US
            </h2>
            <p className='text-sm leading-relaxed text-[#0066b3] sm:w-[100%] sm:text-base md:w-[90%] lg:w-[80%]'>
              Little Alley Cyberschool is an online school built for active,
              curious, and creative children. We move beyond textbook learning,
              offering a full day of hands-on activities that let students
              explore, create, and grow. Here, students lead their own learning
              journey, while teachers serve as facilitators—guiding, supporting,
              and helping each child discover their unique strengths. We use
              technology as a tool to connect learners with real-world
              experiences and meaningful projects, encouraging independence,
              critical thinking, and personal growth. Little Alley is a
              flexible, engaging space where children are free to be themselves
              and learn in ways that matter to them.
            </p>
          </div>
        </div>
      </motion.div>

      {/* VISION AND MISSION Section */}
      <motion.div
        ref={refVision}
        initial={{ opacity: 0, y: 50 }}
        animate={showVision ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='vision mt-20 bg-white px-4 py-10 text-center md:mt-[-25rem] lg:mb-0 lg:mt-0 lg:px-16'
      >
        <h2
          className='mb-10 text-4xl font-extrabold text-[#017BBD]'
          style={{ fontFamily: "'Poetsen One', sans-serif" }}
        >
          VISION AND MISSION
        </h2>

        <div className='mx-auto mt-5 grid grid-cols-3 items-start text-left'>
          <div className='w-30 visi -mr-12 space-y-4 text-right'>
            <p style={{ color: '#017BBD' }}>
              <span className='font-montserrat text-2xl font-extrabold'>
                VISION
              </span>
              <br />
              learn without limits, be virtuous throughout life
              <br />
              Empowering digital culture outside with moral values inside
            </p>
          </div>

          <div className='flex items-center justify-center md:mt-[-15] lg:mt-[-65px]'>
            <Image src={logo3} alt='Little Alley Preschool' />
          </div>

          <div className='misi -ml-12 space-y-4'>
            <p className='text-[#017BBD]'>
              <span className='font-montserrat text-2xl font-extrabold'>
                MISSION
              </span>
            </p>
            <ul className='mb-0 mt-0 list-disc pl-5 text-[#017BBD]'>
              <li>Facilitate the learning process anywhere, anytime.</li>
              <li>Design technology-based teaching and learning.</li>
              <li>Reflect on and improve professional practice.</li>
              <li>
                Collaborate with the virtual and real worlds to enhance
                children's understanding.
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      <div className='our-class max-h-auto relative mb-20 mt-[-45rem] md:mt-[10rem] lg:mt-0'>
        {/* Awan Atas */}
        <Image
          width={1000}
          height={1000}
          src={Awan2}
          alt=''
          className='img1 w-full md:mb-[15rem] lg:mb-0'
        />

        {/* Konten OUR CLASS */}
        <div
          className='bg2-lap px-4 py-7 md:h-auto lg:h-[170vh]'
          style={{ marginTop: '-60rem' }}
        >
          {/* OUR CLASS Title */}
          <div className='mb-10 mt-10 flex justify-center'>
            <div
              className='w-[200px] rounded-[30px] bg-white py-4 text-center text-4xl font-extrabold text-[#017BBD] shadow-md'
              style={{ fontFamily: "'Poetsen One', sans-serif" }}
            >
              OUR <br /> CLASS
            </div>
          </div>

          {/* Grid 2x2 */}
          <div className='relative mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-8'>
            {/* Card 1 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 h-[200px] w-[200px] rounded-2xl border-[6px] border-blue-500 bg-white'></div>
              <p className='text-2xl font-bold text-blue-800'>Primary 1</p>
            </div>
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 h-[200px] w-[200px] rounded-2xl border-[6px] border-blue-500 bg-white'></div>
              <p className='text-2xl font-bold text-blue-800'>Primary 2</p>
            </div>
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 h-[200px] w-[200px] rounded-2xl border-[6px] border-blue-500 bg-white'></div>
              <p className='text-2xl font-bold text-blue-800'>Primary 3</p>
            </div>

            {/* Card 2 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 h-[200px] w-[200px] rounded-2xl border-[6px] border-blue-500 bg-white'></div>
              <p className='text-2xl font-bold text-blue-800'>Primary 4</p>
            </div>

            {/* Card 3 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 h-[200px] w-[200px] rounded-2xl border-[6px] border-blue-500 bg-white'></div>
              <p className='text-2xl font-bold text-blue-800'>Primary 5</p>
            </div>

            {/* Card 4 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 h-[200px] w-[200px] rounded-2xl border-[6px] border-blue-500 bg-white'></div>
              <p className='text-2xl font-bold text-blue-800'>Primary 6</p>
            </div>
          </div>
        </div>
        <Image
          width={1000}
          height={1000}
          src={Awan}
          alt=''
          className='img2 -mt-[68rem] w-full md:mt-[-45rem] lg:mt-[-65rem]'
        />
      </div>

      <motion.div
        ref={refWhy}
        initial={{ opacity: 0, y: 60 }}
        animate={showWhy ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='quetions mx-auto mt-5 max-w-7xl px-1 py-12'
      >
        <h2
          className='title-font text-center text-4xl font-extrabold leading-tight text-[#017BBD]'
          style={{ fontFamily: "'Poetsen One', sans-serif" }}
        >
          WHY
          <br />
          <span className='mt-1 block text-xl lg:text-3xl'>
            LITTLE ALLEY CYBERSCHOOL ?
          </span>
        </h2>

        <div className='mt-10 flex flex-col space-y-10 md:flex-row md:items-center md:justify-center md:space-x-[-55px] lg:space-x-20 lg:space-y-0'>
          <div className='order-1 mx-auto flex max-w-[180px] flex-col items-center justify-center md:order-none md:max-w-none lg:mx-0'>
            <Image
              width={1000}
              height={1000}
              src={Children}
              alt='Young girl with two buns hairstyle holding a phone'
              className='h-[180px] w-[180px] object-contain'
            />
          </div>

          <div className='order-2 max-w-xl text-center text-sm leading-relaxed text-[#0B6CBF] sm:text-base md:order-none'>
            Little Alley Cyberschool As a fully internet-based school, all
            classes, exams, and announcements are conducted through email and
            our official website. This makes it easy for both students and
            parents to stay informed and involved—anytime, anywhere.
          </div>
        </div>

        <div className='mt-10 flex flex-col space-y-10 md:flex-row md:items-center md:justify-center md:space-x-10 lg:space-x-20 lg:space-y-0'>
          <p className='order-2 max-w-xl text-center text-sm leading-relaxed text-[#0B6CBF] sm:text-base md:order-none'>
            Little Alley Cyberschool offers a modern and flexible learning
            experience designed for today’s students. We use the IB-based
            curriculum from Swiss, carefully tailored to help each child grow
            through their unique interests and talents. Our approach encourages
            curiosity, independence, and lifelong learning.
          </p>
          <div className='order-1 mx-auto flex max-w-[180px] flex-col items-center justify-center md:order-none md:max-w-none lg:mx-0'>
            <Image
              width={1000}
              height={1000}
              src={Children}
              alt='Young girl with two buns hairstyle holding a phone'
              className='h-[180px] w-[180px] object-contain'
            />
          </div>
        </div>
      </motion.div>

      {/* Curriculum */}
      <motion.div
        ref={refCurriculum}
        variants={fadeIn('up', 0.3)}
        initial='hidden'
        animate={inViewCurriculum ? 'show' : 'hidden'}
        className='curiculum mx-auto mt-24 max-w-7xl px-4 py-5'
      >
        <h2
          className='title-font mb-5 text-center text-4xl font-extrabold leading-tight text-[#017BBD]'
          style={{ fontFamily: "'Poetsen One', sans-serif" }}
        >
          OUR CURRICULUM
        </h2>
        <div className='flex flex-col items-center justify-center gap-10 py-10 md:flex-row md:items-start md:gap-20'>
          <div className='w-72 flex-shrink-0 md:w-[320px]'>
            <Image
              alt='Curriculum diagram'
              className='h-[400px] w-[800px] md:ml-[50px] lg:ml-0'
              src={Education}
            />
          </div>
          <div className='max-w-xl text-left'>
            <h2 className='mb-3 text-center text-lg font-semibold text-[#0066b3] md:text-left md:text-xl'>
              IB CURRICULUM
            </h2>
            <ul className='mb-6 list-outside list-disc space-y-2 pl-5 text-sm text-[#0066b3] md:text-base'>
              <li>
                Published by the International Baccalaureate Organization (IBO),
                a global non-profit based in Geneva, Switzerland
              </li>
              <li>
                IB Curriculum focuses on developing internationally-minded,
                inquiry-driven, and well-rounded learners, with strong emphasis
                on learner agency, conceptual understanding, and
                global citizenship
              </li>
            </ul>
            <h3 className='mb-4 ml-[20px] text-base font-bold text-[#0066b3] md:text-lg lg:ml-0'>
              INTERNATIONAL BACCALAUREATE PRIMARY YEARS PROGRAMME
            </h3>
            <ul className='list-disc space-y-1 pl-5 text-sm text-[#0066b3] md:text-base'>
              <li>
                KNOWLEDGE (Content in math, language, social studies, science,
                and the arts.)
              </li>
              <li>
                CONCEPTS (Important ideas that have universal significance
                regardless of time or place within and across disciplines.
                Concepts are presented in the forms of questions that drive the
                inquiry.)
              </li>
              <li>
                SKILLS (Specific capabilities in thinking, social interactions,
                self-management, and research.)
              </li>
              <li>
                ATTITUDES (Dispositions, values, beliefs, and feelings towards
                learning.)
              </li>
              <li>ACTIONS (Making changes to and in the world.)</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <div className='mx-auto mt-24 mt-[3rem] max-w-3xl px-4 py-8 lg:mt-0'>
        <h2
          className='mb-6 text-center text-4xl font-extrabold text-[#017BBD]'
          style={{ fontFamily: "'Poetsen One', sans-serif" }}
        >
          OUR FACILITIES
        </h2>

        <div className='mt-14 grid grid-cols-2 justify-items-center gap-x-4 gap-y-6'>
          <Image
            width={1000}
            height={1000}
            src={Fasilitas1}
            alt='Facility 1'
            className='w-72 transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={Fasilitas2}
            alt='Facility 2'
            className='w-72 transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={Fasilitas3}
            alt='Facility 3'
            className='w-72 transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={Fasilitas4}
            alt='Facility 4'
            className='w-72 transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={Fasilitas1}
            alt='Facility 1'
            className='w-72 transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={Fasilitas2}
            alt='Facility 2'
            className='w-72 transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={Fasilitas3}
            alt='Facility 3'
            className='w-72 transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={Fasilitas4}
            alt='Facility 4'
            className='w-72 transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <div className='mb-6 mt-9 hidden w-72 text-sm leading-tight text-[#0066b3] lg:block'>
            <p>
              Yayasan Tunas Anak Mulia is equipped with facilities and resources
              to enhance the learning experience:
            </p>
            <ul className='mt-2 list-inside list-disc space-y-1'>
              <li>Spacious and Safe Learning</li>
              <li>Environment Well-Equipped</li>
              <li>Classrooms Library and Resource</li>
              <li>Center Playgrounds</li>
            </ul>
          </div>

          <Image
            width={1000}
            height={1000}
            src={Fasilitas5}
            alt='Facility 5'
            className='w-72 transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
