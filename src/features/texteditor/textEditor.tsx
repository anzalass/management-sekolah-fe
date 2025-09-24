'use client';
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ImageResize from 'tiptap-extension-resize-image';
import Link from '@tiptap/extension-link'; // ✅ Tambah Link
import ToolBar from './toolbar';

export default function RichTextEditor({ content, onChange }: any) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Heading.configure({
        levels: [1, 2, 3]
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-3'
        }
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-3'
        }
      }),
      Highlight,
      Image,
      ImageResize,
      Link.configure({
        openOnClick: false, // biar klik link gak langsung buka tab baru
        autolink: true,
        linkOnPaste: true
      })
    ],
    content,
    editorProps: {
      attributes: {
        class: 'min-h-[156px] border rounded-md py-2 px-3'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false);
    }
  }, [content, editor]);

  return (
    <div>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
