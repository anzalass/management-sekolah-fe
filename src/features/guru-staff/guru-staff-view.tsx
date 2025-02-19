import GuruStaffForm from './guru-staff-form';
import axios from 'axios';

type NipType = {
  nip: string;
};

export default async function GuruStaffViewPage({ nip }: NipType) {
  let GuruStaff = null;
  let pageTitle = '';

  if (nip !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_URL}/user/get-guru/${nip}`
        );
        return response.data.data;
      } catch (error) {}
    };
    const user = await fetchData();
    GuruStaff = user;
    pageTitle = `Ubah Data Guru / Staff`;
  }

  return (
    <GuruStaffForm nip={nip} initialData={GuruStaff} pageTitle={pageTitle} />
  );
}
