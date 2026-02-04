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
  EyeOff,
  Eye,
  Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Guru } from '../guru-staff-listing';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface CellActionProps {
  data: Guru;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openFoto, setOpenFoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const { trigger, toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();

  // State tambahan untuk modal password
  const [openPassword, setOpenPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fungsi update password
  const onUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      return toast.error('Password minimal 8 karakter');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Password dan konfirmasi tidak cocok');
    }

    setLoading(true);
    try {
      await api.put(
        `user/update-password-guru/${data.id}`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );

      toast.success('Password berhasil diperbarui');
      setOpenPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // DELETE GURU
  const onConfirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`user/delete-guru/${data.id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      setOpenDelete(false);
      toggleTrigger();
      toast.success('Berhasil menghapus guru');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // VALIDASI FILE FOTO
  const validateFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 300 * 1024; // 300 KB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Format foto harus .jpg, .jpeg, atau .png');
      return false;
    }
    if (file.size > maxSize) {
      toast.error('Ukuran foto maksimal 300 KB');
      return false;
    }
    return true;
  };

  // HANDLE FILE CHANGE
  const handleFileChange = (file: File | null) => {
    if (!file) return setSelectedFile(null);

    if (!validateFile(file)) return;

    setSelectedFile(file);
  };

  // UPDATE FOTO
  const onUpdateFoto = async () => {
    if (!selectedFile) {
      toast.error('Silahkan pilih foto terlebih dahulu');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('foto', selectedFile);

      await api.put(`user/update-foto-guru/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      setOpenFoto(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toggleTrigger();
      toast.success('Foto berhasil diperbarui');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // Buat preview foto baru ketika dipilih
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <>
      {/* DELETE MODAL */}
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
      />

      {/* FOTO MODAL */}
      {openFoto && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='w-full max-w-md space-y-4 rounded-lg bg-white p-6'>
            <h3 className='text-lg font-bold'>Update Foto Guru {data.nama}</h3>

            <div className='flex gap-4'>
              {/* Preview Foto Lama */}
              {data.foto && (
                <div className='flex flex-col items-center'>
                  <p className='text-sm text-gray-500'>Foto Lama</p>
                  <Image
                    src={data.foto}
                    alt='Foto Lama'
                    width={100}
                    height={100}
                    className='rounded border'
                  />
                </div>
              )}

              {/* Preview Foto Baru */}
              {previewUrl && (
                <div className='flex flex-col items-center'>
                  <p className='text-sm text-gray-500'>Preview Foto Baru</p>
                  <Image
                    src={previewUrl}
                    alt='Preview Foto'
                    width={100}
                    height={100}
                    className='rounded border'
                  />
                </div>
              )}
            </div>

            {/* Input File */}
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

      {openPassword && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='w-full max-w-md space-y-4 rounded-lg bg-white p-6'>
            <h3 className='text-lg font-bold'>
              Update Password Guru - {data.nama}
            </h3>

            {/* Password Baru */}
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password Baru'
                className='w-full rounded border px-3 py-2'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type='button'
                className='absolute right-2 top-2'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Konfirmasi Password */}
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Konfirmasi Password'
                className='w-full rounded border px-3 py-2'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type='button'
                className='absolute right-2 top-2'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
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

      {/* DROPDOWN MENU */}
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
              router.push(`/dashboard/master-data/guru-staff/${data.id}`)
            }
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenFoto(true)}>
            <ImageIcon className='mr-2 h-4 w-4' /> Update Foto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenPassword(true)}>
            <Lock className='mr-2 h-4 w-4' /> Update Password
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
