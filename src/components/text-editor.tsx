'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link2,
  List,
  ListOrdered,
  Code,
  ImageIcon
} from 'lucide-react';
import { useCallback } from 'react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  type: string;
}

export default function TextEditor({ value, onChange, type }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        listItem: false
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6]
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      BulletList,
      OrderedList,
      ListItem
    ],
    content: value || `<p>Tulis ${type} di sini...</p>`,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px]'
      }
    }
  });

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Masukkan URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = () => {
    const url = window.prompt('Masukkan URL Gambar');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className='h-[50vh] overflow-auto rounded-md border bg-white p-2'>
      <div className='mb-2 flex flex-wrap gap-2 border-b pb-2'>
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className='btn'
        >
          <Bold size={16} />
        </button>
        {[1, 2, 3, 4, 5, 6].map((level: any) => (
          <button
            key={level}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level }).run()
            }
            className='btn'
          >
            H{level}
          </button>
        ))}

        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className='btn'
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className='btn'
        >
          <UnderlineIcon size={16} />
        </button>
        <button onClick={setLink} className='btn'>
          <Link2 size={16} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className='btn'
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className='btn'
        >
          <ListOrdered size={16} />
        </button>

        <button onClick={addImage} className='btn'>
          <ImageIcon size={16} />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
