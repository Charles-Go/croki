import type { TLUiOverrides } from 'tldraw';

// Restrict toolbar to only show: select, line, ellipse (circle), eraser
export const crokiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    // Only keep the tools we need for Croki
    // Lines and circles only (as per Pikto rules)
    return {
      select: tools.select,
      eraser: tools.eraser,
      line: tools.line,
      geo: tools.geo, // For ellipse/circle
    };
  },
};

// Allowed shape types for the game
export const allowedShapeTypes = ['line', 'geo'] as const;
