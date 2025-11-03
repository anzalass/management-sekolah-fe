'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/navbar';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/layout/footer';
import Success from '../../../public/Notif.png';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { API } from '@/lib/server';
import api from '@/lib/api';

export default function RegisterView() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (selectedProgram) {
      setValue('kategori', selectedProgram, {
        shouldValidate: true // penting agar error dihapus otomatis
      });
    }
  }, [selectedProgram, setValue]);

  const onSubmit = async (data: any) => {
    if (!selectedProgram) {
      toast.error('Please select LAC or LAP before submitting');
      return;
    }

    data.kategori = selectedProgram; // Tambahkan ke data yang dikirim

    try {
      const response = await api.post(`pendaftaran`, data);
      setIsSubmitted(true);
      toast.success('Berhasil melakukan pendaftaran');
      reset();
      setSelectedProgram(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
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
          onSubmit={handleSubmit(onSubmit)}
          className='relative top-[-25rem] w-full space-y-3 rounded-xl bg-white p-4 shadow-lg md:w-[500px] lg:top-0'
        >
          <h1 className='mx-auto flex w-[80%] items-center justify-center text-center text-2xl font-bold text-blue-800 lg:w-auto'>
            Register Now for LAP or LAC 2025–2026
          </h1>
          <p className='text-center text-gray-500'>
            Fill the form below and we'll get in touch shortly!
          </p>

          {/* Hidden input program */}
          <input
            type='hidden'
            value={selectedProgram || ''}
            {...register('kategori', { required: true })}
          />
          {errors.kategori && (
            <p className='text-sm text-red-500'>Kategori is required</p>
          )}

          <input
            type='text'
            placeholder='Student Name'
            {...register('studentName', { required: true })}
            className='w-full rounded-md border p-3'
          />
          {errors.studentName && (
            <p className='text-sm text-red-500'>Student Name is required</p>
          )}

          <input
            type='text'
            placeholder='Parent Name'
            {...register('parentName', { required: true })}
            className='w-full rounded-md border p-3'
          />
          {errors.parentName && (
            <p className='text-sm text-red-500'>Parent Name is required</p>
          )}

          <input
            type='text'
            placeholder='Your Location'
            {...register('yourLocation', { required: true })}
            className='w-full rounded-md border p-3'
          />
          {errors.yourLocation && (
            <p className='text-sm text-red-500'>Location is required</p>
          )}

          <input
            type='text'
            placeholder='Phone Number'
            {...register('phoneNumber', { required: true })}
            className='w-full rounded-md border p-3'
          />
          {errors.phoneNumber && (
            <p className='text-sm text-red-500'>Phone number is required</p>
          )}

          <input
            type='email'
            placeholder='Email'
            {...register('email', { required: true })}
            className='w-full rounded-md border p-3'
          />
          {errors.email && (
            <p className='text-sm text-red-500'>Email is required</p>
          )}

          {/* Tombol Pilih Program */}
          <div className='flex w-full gap-4'>
            <button
              type='button'
              onClick={() => setSelectedProgram('LAC')}
              className={`rounded-md border px-4 py-2 ${
                selectedProgram === 'LAC'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              LAC
            </button>
            <button
              type='button'
              onClick={() => setSelectedProgram('LAP')}
              className={`rounded-md border px-4 py-2 ${
                selectedProgram === 'LAP'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              LAP
            </button>
          </div>
          {!selectedProgram && (
            <p className='text-sm text-red-500'>
              Please select a program (LAC or LAP)
            </p>
          )}

          {/* Checkbox Agreement */}
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id='agree'
              {...register('agree', { required: true })}
              className='h-4 w-4'
            />
            <label htmlFor='agree' className='text-sm text-gray-700'>
              I agree to be contacted by LAP regarding this registration.
            </label>
          </div>
          {errors.agree && (
            <p className='text-sm text-red-500'>
              You must agree before submitting.
            </p>
          )}

          {/* Submit Button */}
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
            <div
              className='rounded-lg bg-white'
              onClick={() => setIsSubmitted(false)}
            >
              <button>
                <X />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
