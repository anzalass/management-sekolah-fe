'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Edit,
  MoreHorizontal,
  Trash,
  Image as ImageIcon,
  Key
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Siswa } from '../siswa-listing';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import Image from 'next/image';

interface CellActionProps {
  data: Siswa;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openFoto, setOpenFoto] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openNaikKelas, setOpenNaikKelas] = useState(false);
  const [openLulus, setOpenLulus] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [kelasBaru, setKelasBaru] = useState('');
  const [masterKelas, setMasterKelas] = useState<any[]>([]);

  const router = useRouter();
  const { data: session } = useSession();
  const { trigger, toggleTrigger } = useRenderTrigger();

  // GET KELAS
  useEffect(() => {
    const getKelas = async () => {
      try {
        const res = await api.get('list-kelas', {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        });
        setMasterKelas(res.data.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Terjadi kesalahan');
      }
    };
    getKelas();
  }, []);

  // DELETE SISWA
  const onConfirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`user/delete-siswa/${data.id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      setOpenDelete(false);
      toggleTrigger();
      toast.success('Berhasil menghapus siswa');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE FOTO
  const handleFileChange = (file: File | null) => {
    if (!file) return setSelectedFile(null);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type))
      return toast.error('Format foto harus jpg/jpeg/png');
    if (file.size > 300 * 1024) return toast.error('Ukuran maksimal 300 KB');
    setSelectedFile(file);
  };

  const onUpdateFoto = async () => {
    if (!selectedFile) return toast.error('Silahkan pilih foto');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('foto', selectedFile);
      await api.put(`user/update-foto-siswa/${data.id}`, formData, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setOpenFoto(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toggleTrigger();
      toast.success('Foto berhasil diperbarui');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedFile) return setPreviewUrl(null);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  // UPDATE PASSWORD
  const onUpdatePassword = async () => {
    if (!password || !confirmPassword)
      return toast.error('Password wajib diisi');
    if (password !== confirmPassword) return toast.error('Password tidak sama');
    setLoading(true);
    try {
      await api.put(
        `user/update-password-siswa/${data.id}`,
        { newPassword: password },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        }
      );
      setOpenPassword(false);
      setPassword('');
      setConfirmPassword('');
      toast.success('Password berhasil diperbarui');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE KELAS
  const onNaikKelas = async () => {
    if (!kelasBaru) return toast.error('Pilih kelas baru');
    setLoading(true);
    try {
      await api.put(
        `user/naik-kelas-siswa/${data.id}`,
        { kelasBaru },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        }
      );
      setOpenNaikKelas(false);
      toggleTrigger();
      toast.success('Berhasil naik kelas');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // LULUS
  const onLuluskan = async () => {
    setLoading(true);
    try {
      await api.put(
        `user/luluskan-siswa/${data.id}`,
        { tahunLulus: new Date().getFullYear(), lulus: true },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        }
      );
      setOpenLulus(false);
      toggleTrigger();
      toast.success('Siswa dinyatakan lulus');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const onGaLuluskan = async () => {
    setLoading(true);
    try {
      await api.put(
        `user/luluskan-siswa/${data.id}`,
        { tahunLulus: null, lulus: false },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        }
      );
      setOpenLulus(false);
      toggleTrigger();
      toast.success('Siswa tidak lulus');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Delete Modal */}
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
      />

      {/* Foto Modal */}
      {openFoto && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='w-full max-w-md space-y-4 rounded-lg bg-white p-6'>
            <h3 className='text-lg font-bold'>Update Foto Siswa</h3>
            <div className='flex gap-4'>
              {data.foto && (
                <Image
                  src={data.foto}
                  alt='Foto Lama'
                  width={100}
                  height={100}
                  className='rounded border'
                />
              )}
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt='Preview'
                  width={100}
                  height={100}
                  className='rounded border'
                />
              )}
            </div>
            <input
              type='file'
              accept='.jpg,.jpeg,.png'
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            <div className='flex justify-end gap-2'>
              <Button variant='ghost' onClick={() => setOpenFoto(false)}>
                Batal
              </Button>
              <Button onClick={onUpdateFoto} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {openPassword && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='w-full max-w-md space-y-4 rounded-lg bg-white p-6'>
            <h3 className='text-lg font-bold'>Update Password</h3>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password Baru'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full rounded border px-3 py-2'
            />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Konfirmasi Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full rounded border px-3 py-2'
            />
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className='ml-2 text-sm'>Tampilkan password</span>
            </div>
            <div className='flex justify-end gap-2'>
              <Button variant='ghost' onClick={() => setOpenPassword(false)}>
                Batal
              </Button>
              <Button onClick={onUpdatePassword} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Naik Kelas Modal */}
      {openNaikKelas && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='w-full max-w-md space-y-4 rounded-lg bg-white p-6'>
            <h3 className='text-lg font-bold'>Naik Kelas</h3>
            <Select onValueChange={setKelasBaru} value={kelasBaru}>
              <SelectTrigger>
                <SelectValue placeholder='Pilih Kelas Baru' />
              </SelectTrigger>
              <SelectContent>
                {masterKelas?.map((k) => (
                  <SelectItem key={k.id} value={k.namaKelas}>
                    {k.namaKelas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex justify-end gap-2'>
              <Button variant='ghost' onClick={() => setOpenNaikKelas(false)}>
                Batal
              </Button>
              <Button onClick={onNaikKelas} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Naikkan'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lulus Modal */}
      {openLulus && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='w-full max-w-md space-y-4 rounded-lg bg-white p-6'>
            <h3 className='text-lg font-bold'>Status Kelulusan</h3>
            <div className='flex justify-between gap-2'>
              <Button variant='default' onClick={onLuluskan} disabled={loading}>
                Luluskan
              </Button>
              <Button
                variant='destructive'
                onClick={onGaLuluskan}
                disabled={loading}
              >
                Ga Luluskan
              </Button>
            </div>
            <Button variant='ghost' onClick={() => setOpenLulus(false)}>
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/master-data/siswa/${data.id}`)
            }
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenFoto(true)}>
            <ImageIcon className='mr-2 h-4 w-4' /> Update Foto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenPassword(true)}>
            <Key className='mr-2 h-4 w-4' /> Update Password
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenNaikKelas(true)}>
            <Edit className='mr-2 h-4 w-4' /> Naik Kelas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenLulus(true)}>
            <Edit className='mr-2 h-4 w-4' /> Kelulusan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
