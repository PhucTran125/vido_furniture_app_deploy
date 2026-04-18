'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold, Italic, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote,
  Link as LinkIcon,
  Undo, Redo, Minus,
  X, Trash2,
} from 'lucide-react';

interface TiptapEditorProps {
  content: Record<string, unknown> | null;
  onChange: (content: Record<string, unknown>) => void;
  placeholder?: string;
}

function MenuButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        isActive
          ? 'bg-accent text-white'
          : 'text-gray-600 hover:bg-gray-200'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
}

/* ── Link Modal ── */

interface LinkModalProps {
  initialText: string;
  initialUrl: string;
  hasExistingLink: boolean;
  onSubmit: (text: string, url: string) => void;
  onRemove?: () => void;
  onClose: () => void;
}

function LinkModal({ initialText, initialUrl, hasExistingLink, onSubmit, onRemove, onClose }: LinkModalProps) {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    textRef.current?.focus();
    textRef.current?.select();
  }, []);

  const isValidUrl = (str: string): boolean => {
    try {
      const parsed = new URL(str);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    const trimmedUrl = url.trim();
    const trimmedText = text.trim();
    if (!trimmedUrl) {
      setError('Please enter a link URL.');
      return;
    }
    if (!isValidUrl(trimmedUrl)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    onSubmit(trimmedText || trimmedUrl, trimmedUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <h3 className="text-lg font-bold text-gray-900">Add link</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-5 space-y-4">
          <div>
            <label htmlFor="link-text" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Text
            </label>
            <input
              ref={textRef}
              id="link-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Display text"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="link-url" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Link
            </label>
            <input
              id="link-url"
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              placeholder="https://example.com"
              className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {onRemove && (
                <button type="button" onClick={onRemove} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="px-5 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Editor ── */

export function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const [modal, setModal] = useState<'link' | null>(null);
  const [linkInitialText, setLinkInitialText] = useState('');
  const [linkInitialUrl, setLinkInitialUrl] = useState('');
  const [hasExistingLink, setHasExistingLink] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-accent underline',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        },
      }),
    ],
    content: content || { type: 'doc', content: [{ type: 'paragraph' }] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getJSON() as Record<string, unknown>);
    },
  });

  const openLinkModal = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkInitialText(selectedText);
    setLinkInitialUrl(previousUrl || 'https://');
    setHasExistingLink(!!previousUrl);
    setModal('link');
  }, [editor]);

  const handleLinkSubmit = useCallback((text: string, url: string) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    if (hasSelection) {
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContentAt(from, { type: 'text', text, marks: [{ type: 'link', attrs: { href: url } }] })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent({ type: 'text', text, marks: [{ type: 'link', attrs: { href: url } }] })
        .run();
    }
    setModal(null);
  }, [editor]);

  const handleLinkRemove = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setModal(null);
  }, [editor]);

  const handleModalClose = useCallback(() => {
    setModal(null);
    editor?.chain().focus().run();
  }, [editor]);

  if (!editor) return null;

  const iconSize = 16;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={iconSize} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={iconSize} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={iconSize} />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={iconSize} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={iconSize} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={iconSize} />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={iconSize} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered size={iconSize} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={iconSize} />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <MenuButton onClick={openLinkModal} isActive={editor.isActive('link')} title="Add Link">
          <LinkIcon size={iconSize} />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={iconSize} />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo size={iconSize} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo size={iconSize} />
        </MenuButton>
      </div>

      <EditorContent editor={editor} />

      {placeholder && editor.isEmpty && (
        <div className="px-4 pb-2 text-gray-400 text-sm pointer-events-none">
          {placeholder}
        </div>
      )}

      {modal === 'link' && createPortal(
        <LinkModal
          initialText={linkInitialText}
          initialUrl={linkInitialUrl}
          hasExistingLink={hasExistingLink}
          onSubmit={handleLinkSubmit}
          onRemove={hasExistingLink ? handleLinkRemove : undefined}
          onClose={handleModalClose}
        />,
        document.body
      )}

    </div>
  );
}
