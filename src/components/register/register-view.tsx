'use client';
import React, { useState } from 'react';
import Navbar from '@/components/layout/navbar';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/layout/footer';
import Success from '../../../public/Notif.png';
import Image from 'next/image';

export default function RegisterView() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    location: '',
    phoneNumber: '',
    email: '',
    program: '',
    whatsappConsent: false
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Convert boolean to string for whatsappConsent
    const formDataForSubmit = {
      ...formData,
      whatsappConsent: formData.whatsappConsent ? 'true' : 'false'
    };

    const scriptURL =
      'https://script.google.com/macros/s/AKfycbyZmzyOIZgJCjLLRCmkXFskxPRczY6voRPhYdf_e_iPO-jf8Hf7C17B5kIijrvIadZ3jA/exec'; // <- ganti dengan URL Web Apps kamu

    const response = await fetch(scriptURL, {
      method: 'POST',
      body: new URLSearchParams(formDataForSubmit)
    });

    if (response.ok) {
      setIsSubmitted(true);
      setFormData({
        studentName: '',
        parentName: '',
        location: '',
        phoneNumber: '',
        email: '',
        program: '',
        whatsappConsent: false
      });
    } else {
      alert('Failed to submit form');
    }
  };

  return (
    <div>
      <Navbar />
      <div className='bg pb flex flex-wrap items-center justify-center gap-10 p-4 md:max-h-screen xl:h-auto'>
        <div className='relative min-h-[400px] w-full md:w-1/2'>
          <div className='absolute left-0 top-0 hidden h-full w-full flex-col items-start justify-center p-10 text-white sm:flex md:hidden lg:flex'>
            <h1 className='mb-4 text-4xl font-bold'>
              HAPPY CHILD, HAPPY FAMILY
            </h1>
            <p className='text-lg'>Admissions Open for 2025/2026</p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className='relative top-[-25rem] w-full space-y-3 rounded-xl bg-white p-4 shadow-lg md:w-[500px] lg:top-0'
        >
          <h1 className='mx-auto flex w-[80%] items-center justify-center text-center text-2xl font-bold text-blue-800 lg:w-auto'>
            Register Now for LAP 2025–2026
          </h1>

          <p className='text-center text-gray-500'>
            Fill the form below and we'll get in touch shortly!
          </p>

          <input
            type='text'
            name='studentName'
            placeholder='Student Name'
            value={formData.studentName}
            onChange={handleChange}
            className='w-full rounded-md border p-3'
          />
          <input
            type='text'
            name='parentName'
            placeholder='Parent Name'
            value={formData.parentName}
            onChange={handleChange}
            className='w-full rounded-md border p-3'
          />
          <input
            type='text'
            name='location'
            placeholder='Your Location'
            value={formData.location}
            onChange={handleChange}
            className='w-full rounded-md border p-3'
          />
          <input
            type='text'
            name='phoneNumber'
            placeholder='Phone Number'
            value={formData.phoneNumber}
            onChange={handleChange}
            className='w-full rounded-md border p-3'
          />
          <input
            type='email'
            name='email'
            placeholder='Email Id'
            value={formData.email}
            onChange={handleChange}
            className='w-full rounded-md border p-3'
          />

          <select
            name='program'
            value={formData.program}
            onChange={handleChange}
            className='w-full rounded-md border p-3'
          >
            <option value=''>Select Program</option>
            <option value='Preparatory'>Preparatory (age 1.5 - 2 Years)</option>
            <option value='Toddler'>Toddler (age 2 - 3 Years)</option>
            <option value='Playgroup'>Playgroup (age 3 - 4 Years)</option>
            <option value='Learnes & Achives'>
              Learnes & Achives (age 4 Years+)
            </option>
          </select>

          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              name='whatsappConsent'
              checked={formData.whatsappConsent}
              onChange={handleChange}
              id='whatsapp'
              className='h-4 w-4'
            />
            <label htmlFor='whatsapp' className='text-sm text-gray-700'>
              I agree to receive messages on Whatsapp
            </label>
          </div>

          <button
            type='submit'
            className='mt-2 w-full rounded-md bg-blue-500 p-3 text-white hover:bg-blue-600'
          >
            Enquiry Now
          </button>
        </form>
      </div>
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
            onClick={() => setIsSubmitted(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='rounded-lg p-4'
              onClick={() => setIsSubmitted(false)}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Image
                src={Success}
                alt='Success'
                className='h-[650px] w-[500px]'
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
