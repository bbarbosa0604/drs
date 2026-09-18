'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { useEffect } from 'react';

import styles from './RichTextEditor.module.css';

/**
 * Editor de conteudo rico (PRD secao 29): TipTap/ProseMirror, nunca
 * `document.execCommand`. As extensoes ativas espelham a allowlist de
 * `sanitizeRichTextHtml` no backend (Task 012) — sem code block, code inline
 * ou linha horizontal, que o backend removeria de qualquer forma.
 */
export function RichTextEditor({
  initialHtml,
  onChangeHtml,
}: {
  initialHtml: string;
  onChangeHtml: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        horizontalRule: false,
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: initialHtml,
    onUpdate: ({ editor: currentEditor }) => {
      onChangeHtml(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  function toggleButton(
    label: string,
    isActive: boolean,
    onClick: () => void,
  ) {
    return (
      <button
        type="button"
        className={clsx(
          styles.toolbarButton,
          isActive && styles.toolbarButtonActive,
        )}
        onClick={onClick}
        aria-pressed={isActive}
      >
        {label}
      </button>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar} role="toolbar" aria-label="Formatacao">
        {toggleButton('B', editor.isActive('bold'), () =>
          editor.chain().focus().toggleBold().run(),
        )}
        {toggleButton('I', editor.isActive('italic'), () =>
          editor.chain().focus().toggleItalic().run(),
        )}
        {toggleButton('S', editor.isActive('strike'), () =>
          editor.chain().focus().toggleStrike().run(),
        )}
        {toggleButton('H1', editor.isActive('heading', { level: 1 }), () =>
          editor.chain().focus().toggleHeading({ level: 1 }).run(),
        )}
        {toggleButton('H2', editor.isActive('heading', { level: 2 }), () =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
        )}
        {toggleButton('H3', editor.isActive('heading', { level: 3 }), () =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
        )}
        {toggleButton('• Lista', editor.isActive('bulletList'), () =>
          editor.chain().focus().toggleBulletList().run(),
        )}
        {toggleButton('1. Lista', editor.isActive('orderedList'), () =>
          editor.chain().focus().toggleOrderedList().run(),
        )}
        {toggleButton('" Citacao', editor.isActive('blockquote'), () =>
          editor.chain().focus().toggleBlockquote().run(),
        )}
      </div>
      <div className={styles.editor}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
