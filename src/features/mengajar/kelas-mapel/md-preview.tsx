'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // optional: tema highlight syntax

interface MarkdownPreviewProps {
  content: string;
}

/**
 * Komponen untuk menampilkan Markdown dengan styling dan highlight kode.
 * - Mendukung tabel, bold, italic, list, code block, dsb.
 * - `rehypeRaw` mengizinkan HTML di markdown (aktifkan hanya jika konten tepercaya).
 */
export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className='prose prose-sm w-full dark:prose-invert'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeRaw], [rehypeHighlight]]}
      >
        {content || '_Tidak ada konten untuk ditampilkan._'}
      </ReactMarkdown>
    </div>
  );
}
