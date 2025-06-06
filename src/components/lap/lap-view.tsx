'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/layout/navbar';
import logo2 from '../../../public/logo2.png';
import Ellipse from '../../../public/Ellipse.png';
import Children from '../../../public/children.png';
import Education from '../../../public/education.png';
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
import Footer from '../../components/layout/footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import axios from 'axios';
import { API } from '@/lib/server';

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
        ease: 'easeInOut'
      }
    }
  };
};

interface GalleryItem {
  image: string;
}

interface TestimonialItem {
  image: string;
  description: string;
}

const BASE_URL = `${API}view-image`;

export default function Lap() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
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

  const [refWhy, inViewWhy] = useInView({ triggerOnce: true, threshold: 0.2 });
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

  useEffect(() => {
    axios
      .get(`${API}testimonials`)
      .then((response) => {
        setTestimonials(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching the news:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API}gallery`)
      .then((response) => {
        setGallery(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching the news:', error);
      });
  }, []);

  return (
    <div className='lap md:overflow-x-hidden'>
      <Navbar />
      <div className='bg-lap relative z-0 flex flex-wrap items-start justify-center gap-10 bg-cover bg-center p-4 pt-28'>
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
            <a href='/register'>
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
            src={logo2}
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
              Little Alley is a refresh kindergarten curriculum framework that
              highlights teaching and learning principles that are relevant for
              developing competencies of young children. Kidsroom where learning
              meets imagination! We believe that every child is a unique learner
              with unlimited potential waiting to be unlocked. Kidsroom is
              designed to provide a nurturing and inspiring environment where
              children can grow academically and personally.
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
              To be a Pioneer in providing quality space and time for future
              generations preparing them to become the best
              <br />
              for the nation, with character and moral values as the foundation
              of life.
            </p>
          </div>

          <div className='flex items-center justify-center md:mt-[-15] lg:mt-[-65px]'>
            <Image src={Ellipse} alt='Little Alley Preschool' />
          </div>

          <div className='misi -ml-12 space-y-4'>
            <p className='text-[#017BBD]'>
              <span className='font-montserrat text-2xl font-extrabold'>
                MISSION
              </span>
            </p>
            <ul className='mb-0 mt-0 list-disc pl-5 text-[#017BBD]'>
              <li>
                To design holistic child development programs using an
                integrated approach
              </li>
              <li>
                To facilitate the learning process in order to broaden
                children's thinking and understanding
              </li>
              <li>To observe and assess children's learning and development</li>
              <li>
                To collaborate with families and communities to support
                children's learning
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
              <p className='text-2xl font-bold text-blue-800'>Preparatory</p>
              <p className='text-lg text-gray-700'>Age: 1.5 - 2 Years</p>
            </div>

            {/* Card 2 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 h-[200px] w-[200px] rounded-2xl border-[6px] border-blue-500 bg-white'></div>
              <p className='text-2xl font-bold text-blue-800'>Toddler</p>
              <p className='text-lg text-gray-700'>Age: 2 - 3 Years</p>
            </div>

            {/* Card 3 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 h-[200px] w-[200px] rounded-2xl border-[6px] border-blue-500 bg-white'></div>
              <p className='text-2xl font-bold text-blue-800'>Playgroup</p>
              <p className='text-lg text-gray-700'>Age: 3 - 4 Years</p>
            </div>

            {/* Card 4 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 h-[200px] w-[200px] rounded-2xl border-[6px] border-blue-500 bg-white'></div>
              <p className='text-2xl font-bold text-blue-800'>
                Learners & Achievers
              </p>
              <p className='text-lg text-gray-700'>Age: 4 Years +</p>
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
            LITTLE ALLEY PRESCHOOL ?
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
            We teach using various methods, become facilitators for students
            with diverse characters because they have the same opportunities. We
            provide our students with a strong foundation for lifelong learning
            and leading academically.
          </div>
        </div>

        <div className='mt-10 flex flex-col space-y-10 md:flex-row md:items-center md:justify-center md:space-x-10 lg:space-x-20 lg:space-y-0'>
          <p className='order-2 max-w-xl text-center text-sm leading-relaxed text-[#0B6CBF] sm:text-base md:order-none'>
            Our preschool program is designed to lay a strong foundation for
            children aged 1 to 6 years old. Through a blend of play-based
            learning, thematic approaches, and hands-on activities, we nurture
            early literacy, numeracy, social skills, and creativity. Our
            curriculum integrates language development, mathematics, science,
            arts, and physical education to provide a well-rounded educational
            experience.
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
        className='mx-auto mt-24 max-w-7xl px-4 py-5'
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
              width={1000}
              height={1000}
              alt='Curriculum diagram'
              className='h-[300px] w-[800px] md:ml-[50px] lg:ml-0'
              src={Education}
            />
          </div>
          <div className='max-w-xl text-left'>
            <h2 className='mb-3 text-center text-lg font-semibold text-[#0066b3] md:text-left md:text-xl'>
              NURTURING EARLY LEARNERS CURRICULUM
            </h2>
            <ul className='mb-6 list-outside list-disc space-y-2 pl-5 text-sm text-[#0066b3] md:text-base'>
              <li>Published by the MOE (Ministry of Education) 2012</li>
              <li>
                NEL was designing and implementing a quality kindergarten
                curriculum for children aged four to six with six principles,
                encapsulated in the acronym “iTeach” as the basis for the best
                practices
              </li>
            </ul>
            <h3 className='mb-2 ml-[20px] text-base font-bold text-[#0066b3] md:text-lg lg:ml-0'>
              iTeach
            </h3>
            <ul className='list-inside list-disc space-y-1 text-sm text-[#0066b3] md:text-base'>
              <li>i = integrated approach to learning</li>
              <li>T = Teachers as facilitators of learning</li>
              <li>e = engaging children in learning through purposeful play</li>
              <li>a = authentic learning through quality interactions</li>
              <li>c = children as constructors of knowledge</li>
              <li>h = holistic development</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <div className='mx-auto mt-24 max-w-3xl px-4 py-8'>
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

      <Image
        width={1000}
        height={1000}
        src={Garis}
        className='mt-10 mt-24 w-full'
        alt='Garis horizontal'
      />

      <div className='bg-white px-4 py-10 text-center md:px-16'>
        <h2
          className='mb-10 text-4xl font-extrabold text-[#017BBD]'
          style={{ fontFamily: "'Poetsen One', sans-serif" }}
        >
          GALLERY
        </h2>
        <div className='mt-14 overflow-hidden'>
          <div className='animate-scroll-images flex gap-4'>
            {gallery.concat(gallery).map((item, index) => {
              // Extract the image URL here
              const imageUrl = `${BASE_URL}/${item.image.split('/').pop()}`;

              return (
                <div key={index} className='flex-shrink-0'>
                  <Image
                    width={1000}
                    height={1000}
                    src={imageUrl} // Use imageUrl here
                    alt={`Facility ${index + 1}`}
                    className='h-40 w-64 rounded-lg object-cover shadow'
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className='mt-10 bg-[#bde0fe] font-sans'>
        <div className='mx-auto max-w-5xl px-4 py-10'>
          <div className='mb-8 text-center'>
            <h2 className='text-4xl font-extrabold text-[#003049]'>
              TESTIMONIAL
            </h2>
            <p className='text-sm italic text-[#003049] md:text-base'>
              Hear From Our Parents
            </p>
          </div>
          <Swiper
            onSwiper={(swiper) => {
              setSwiperInstance(swiper);
              console.log('Swiper instance set:', swiper);
            }}
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false
            }}
            navigation={false}
            slidesPerView={2} // Default value for smaller screens (1 slide on mobile)
            breakpoints={{
              640: {
                slidesPerView: 2 // 2 slides per view on mobile devices
              },
              768: {
                slidesPerView: 4 // 2 slides per view on tablets
              },
              1024: {
                slidesPerView: 3 // 3 slides per view on medium screens (laptops)
              },
              1280: {
                slidesPerView: 4 // 4 slides per view on desktop
              }
            }}
          >
            {testimonials.map((item, index) => {
              const imageUrl = `${BASE_URL}/${item.image.split('/').pop()}`;
              return (
                <SwiperSlide key={index}>
                  <div className='mx-auto flex h-[230px] w-full max-w-[250px] flex-col overflow-hidden rounded-3xl bg-white shadow-lg'>
                    <Image
                      width={1000}
                      height={1000}
                      src={imageUrl} // Use the imageUrl here
                      alt='Testimonial'
                      className='h-40 w-full rounded-t-3xl object-cover'
                    />
                    <p className='flex-1 p-4 text-xs leading-relaxed text-[#003049] md:text-sm'>
                      {item.description}
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className='mb-3 mt-14 flex justify-center space-x-4'>
            <button
              onClick={() => swiperInstance.slidePrev()}
              className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500'
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              onClick={() => swiperInstance.slideNext()}
              className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500'
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
