import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--refine-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--refine-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--refine-elements-terminal-textColor'),
    background: cssVar('--refine-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--refine-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--refine-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--refine-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--refine-elements-terminal-color-black'),
    red: cssVar('--refine-elements-terminal-color-red'),
    green: cssVar('--refine-elements-terminal-color-green'),
    yellow: cssVar('--refine-elements-terminal-color-yellow'),
    blue: cssVar('--refine-elements-terminal-color-blue'),
    magenta: cssVar('--refine-elements-terminal-color-magenta'),
    cyan: cssVar('--refine-elements-terminal-color-cyan'),
    white: cssVar('--refine-elements-terminal-color-white'),
    brightBlack: cssVar('--refine-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--refine-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--refine-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--refine-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--refine-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--refine-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--refine-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--refine-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}
