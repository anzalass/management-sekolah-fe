'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';

const localizer = momentLocalizer(moment);

interface Kegiatan {
  id: string;
  nama: string;
  tahunAjaran: string;
  keterangan: string;
  waktuMulai: string;
  waktuSelesai: string;
  status: string;
}

export default function KegiatanKalender() {
  const [events, setEvents] = useState<any[]>([]);

  const getData = async () => {
    try {
      const res = await api.get('kegiatan-sekolah-2');
      const mapped = res.data.data.map((k: any) => ({
        id: k.id,
        title: k.nama,
        start: new Date(k.waktuMulai),
        end: new Date(k.waktuSelesai),
        allDay: false // kalau mau full day bisa set true
      }));
      setEvents(mapped);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='h-[600px]'>
      <NavbarSiswa title='Kalender Akademik' />
      <div className='mx-auto mt-12 w-11/12'>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 600 }}
        />
      </div>
      <BottomNav />
    </div>
  );
}
