'use client';
import { Toggle } from '@/components/ui/toggle';
import { List, Link as LinkIcon } from 'lucide-react';
import {
  Heading1,
  Heading2,
  Heading3,
  Code,
  Bold,
  Italic,
  Strikethrough,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Highlighter,
  Upload
} from 'lucide-react';
import { ListOrdered } from 'lucide-react';

export default function ToolBar({ editor }: any) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL Gambar');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Masukkan URL link', previousUrl);

    // Jika kosong, hapus link
    if (url === null) return; // cancel klik
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    // Tambahkan link baru
    editor.chain().focus().setLink({ href: url }).run();
  };

  const Options = [
    {
      icon: <Heading1 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive('heading', { level: 1 })
    },
    {
      icon: <Heading2 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive('heading', { level: 2 })
    },
    {
      icon: <Heading3 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive('heading', { level: 3 })
    },
    {
      icon: <Bold className='size-4' />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive('bold')
    },
    {
      icon: <Italic className='size-4' />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive('italic')
    },
    {
      icon: <Strikethrough className='size-4' />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive('strike')
    },
    {
      icon: <AlignLeft className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      preesed: editor.isActive({ textAlign: 'left' })
    },
    {
      icon: <AlignCenter className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      preesed: editor.isActive({ textAlign: 'center' })
    },
    {
      icon: <AlignRight className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      preesed: editor.isActive({ textAlign: 'right' })
    },
    {
      icon: <List className='size-4' />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive('bulletList')
    },
    {
      icon: <ListOrdered className='size-4' />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive('orderedList')
    },
    {
      icon: <Code className='size-4' />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      preesed: editor.isActive('codeBlock')
    },
    {
      icon: <Highlighter className='size-4' />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive('highlight')
    },
    {
      icon: <Upload className='size-4' />,
      onClick: () => addImage(),
      preesed: editor.isActive('image')
    },
    {
      icon: <LinkIcon className='size-4' />,
      onClick: () => addLink(),
      preesed: editor.isActive('link')
    }
  ];

  return (
    <div className='sticky top-10 z-50 mb-1 space-x-1 rounded-md border p-1.5'>
      {Options.map((option, i) => (
        <Toggle
          key={i}
          size='sm'
          pressed={option.preesed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
