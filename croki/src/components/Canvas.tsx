'use client';

import { Tldraw, useEditor, Editor, TLComponents, GeoShapeGeoStyle } from 'tldraw';
import 'tldraw/tldraw.css';
import { useEffect, useCallback, useImperativeHandle, forwardRef, useRef } from 'react';

interface CanvasProps {
  disabled?: boolean;
  onCountObjects?: (count: number) => void;
  onSubmit?: () => void;
  objectCount?: number;
  isSubmitting?: boolean;
}

export interface CanvasHandle {
  getImageData: () => Promise<string | null>;
}

// Custom components to hide default UI
const components: TLComponents = {
  Toolbar: null,
  MainMenu: null,
  PageMenu: null,
  NavigationPanel: null,
  StylePanel: null,
  KeyboardShortcutsDialog: null,
  QuickActions: null,
  HelperButtons: null,
  DebugPanel: null,
  DebugMenu: null,
  ActionsMenu: null,
  ZoomMenu: null,
};

function InnerComponents({
  onCountObjects,
  onEditorReady,
  disabled,
  onSubmit,
  objectCount,
  isSubmitting,
}: {
  onCountObjects?: (count: number) => void;
  onEditorReady: (editor: Editor) => void;
  disabled: boolean;
  onSubmit?: () => void;
  objectCount?: number;
  isSubmitting?: boolean;
}) {
  const editor = useEditor();

  // Capture editor reference
  useEffect(() => {
    if (editor) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Count objects
  useEffect(() => {
    if (!editor || !onCountObjects) return;

    const updateCount = () => {
      const shapes = editor.getCurrentPageShapes();
      onCountObjects(shapes.length);
    };

    updateCount();
    const cleanup = editor.store.listen(updateCount, { source: 'user' });
    return cleanup;
  }, [editor, onCountObjects]);

  if (disabled) return null;

  return <Toolbar onSubmit={onSubmit} objectCount={objectCount} isSubmitting={isSubmitting} />;
}

function Toolbar({
  onSubmit,
  objectCount,
  isSubmitting,
}: {
  onSubmit?: () => void;
  objectCount?: number;
  isSubmitting?: boolean;
}) {
  const editor = useEditor();

  const setTool = (tool: string) => {
    if (!editor) return;
    editor.setCurrentTool(tool);
  };

  const setEllipseTool = () => {
    if (!editor) return;
    // Ensure geo style is set to ellipse
    editor.setStyleForNextShapes(GeoShapeGeoStyle, 'ellipse');
    editor.setCurrentTool('geo');
  };

  const currentTool = editor?.getCurrentToolId();

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex gap-2 z-[1000]">
      <ToolBtn
        active={currentTool === 'select'}
        onClick={() => setTool('select')}
        icon="👆"
        label="Sélectionner"
      />
      <ToolBtn
        active={currentTool === 'line'}
        onClick={() => setTool('line')}
        icon="/"
        label="Ligne"
      />
      <ToolBtn
        active={currentTool === 'geo'}
        onClick={setEllipseTool}
        icon="○"
        label="Cercle"
      />
      <ToolBtn
        active={currentTool === 'eraser'}
        onClick={() => setTool('eraser')}
        icon="🧹"
        label="Effacer"
      />
      {onSubmit && (
        <>
          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            onClick={onSubmit}
            disabled={!objectCount || isSubmitting}
            className="px-3 h-10 flex items-center gap-2 rounded-lg font-medium transition-colors bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm"
            title="Proposer"
          >
            <span>{objectCount || 0}</span>
            <span>{isSubmitting ? '...' : '✓'}</span>
          </button>
        </>
      )}
    </div>
  );
}

function ToolBtn({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
      title={label}
    >
      {icon}
    </button>
  );
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(
  function Canvas({ disabled = false, onCountObjects, onSubmit, objectCount, isSubmitting }, ref) {
    const editorRef = useRef<Editor | null>(null);

    const handleEditorReady = useCallback((editor: Editor) => {
      editorRef.current = editor;
    }, []);

    const handleMount = useCallback((editor: Editor) => {
      if (!editor) return;
      // Set default geo shape to ellipse (circle)
      editor.setStyleForNextShapes(GeoShapeGeoStyle, 'ellipse');
      // Set default tool to line
      editor.setCurrentTool('line');

      // Force ellipses to be perfect circles
      editor.sideEffects.registerBeforeChangeHandler('shape', (prev, next) => {
        if (next.type === 'geo' && 'geo' in next.props && next.props.geo === 'ellipse') {
          const w = next.props.w as number;
          const h = next.props.h as number;
          if (w !== h) {
            // Use the larger dimension to make a circle
            const size = Math.max(w, h);
            return {
              ...next,
              props: {
                ...next.props,
                w: size,
                h: size,
              },
            };
          }
        }
        return next;
      });

      // Keep tool selected after completing a shape (don't switch back to select)
      editor.updateInstanceState({ isToolLocked: true });
    }, []);

    // Expose getImageData method to parent
    useImperativeHandle(ref, () => ({
      getImageData: async () => {
        const editor = editorRef.current;
        if (!editor) return null;

        try {
          const shapeIds = editor.getCurrentPageShapeIds();
          if (shapeIds.size === 0) return null;

          const result = await editor.toImage([...shapeIds], {
            format: 'png',
            background: true,
            padding: 16,
            scale: 1,
          });

          if (!result) return null;

          const blob = 'blob' in result ? result.blob : result;

          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              resolve(base64);
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.error('Failed to capture canvas:', e);
          return null;
        }
      },
    }), []);

    return (
      <div className="w-full h-full relative touch-none">
        <Tldraw
          licenseKey="tldraw-2026-03-31/WyJjdUdRZThZSiIsWyIqIl0sMTYsIjIwMjYtMDMtMzEiXQ.GGjJf5/4kypXMJqUPkQHoiHCZUAQJ+5qnPaoPw496clX3dFKXrwGUjVPF27QIk/qaioaO4nNpa8Lj4bNy/qYRw"
          onMount={handleMount}
          inferDarkMode
          components={components}
        >
          <InnerComponents
            onCountObjects={onCountObjects}
            onEditorReady={handleEditorReady}
            disabled={disabled}
            onSubmit={onSubmit}
            objectCount={objectCount}
            isSubmitting={isSubmitting}
          />
        </Tldraw>
      </div>
    );
  }
);
