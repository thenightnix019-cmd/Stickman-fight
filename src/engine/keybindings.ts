import { PlayerId, PlayerKeyBindingsMap } from '../types/game';

export const DEFAULT_KEY_BINDINGS: PlayerKeyBindingsMap = {
  1: {
    left: 'KeyA',
    right: 'KeyD',
    jump: 'KeyW',
    down: 'KeyS',
    attack: 'Space',
  },
  2: {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'ArrowUp',
    down: 'ArrowDown',
    attack: 'Enter',
  },
  3: {
    left: 'KeyJ',
    right: 'KeyL',
    jump: 'KeyI',
    down: 'KeyK',
    attack: 'KeyO',
  },
  4: {
    left: 'KeyF',
    right: 'KeyH',
    jump: 'KeyT',
    down: 'KeyG',
    attack: 'KeyY',
  },
  5: {
    left: 'Numpad4',
    right: 'Numpad6',
    jump: 'Numpad8',
    down: 'Numpad5',
    attack: 'Numpad0',
  },
  6: {
    left: 'KeyZ',
    right: 'KeyC',
    jump: 'KeyX',
    down: 'KeyV',
    attack: 'KeyB',
  },
};

const STORAGE_KEY = 'stick_arena_custom_keybindings_v1';

export function loadSavedKeyBindings(): PlayerKeyBindingsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_KEY_BINDINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_KEY_BINDINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_KEY_BINDINGS;
  }
}

export function saveKeyBindings(bindings: PlayerKeyBindingsMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bindings));
  } catch (err) {
    console.error('Failed to save key bindings', err);
  }
}

export function getKeyDisplayLabel(codeOrKey: string): string {
  if (!codeOrKey) return 'None';
  if (codeOrKey.startsWith('Key')) return codeOrKey.replace('Key', '');
  if (codeOrKey.startsWith('Digit')) return codeOrKey.replace('Digit', '');
  if (codeOrKey.startsWith('Numpad')) return 'Num ' + codeOrKey.replace('Numpad', '');
  switch (codeOrKey) {
    case 'Space':
      return 'Space';
    case 'Enter':
      return 'Enter';
    case 'ArrowUp':
      return '↑';
    case 'ArrowDown':
      return '↓';
    case 'ArrowLeft':
      return '←';
    case 'ArrowRight':
      return '→';
    case 'ShiftLeft':
      return 'L-Shift';
    case 'ShiftRight':
      return 'R-Shift';
    case 'ControlLeft':
      return 'L-Ctrl';
    case 'ControlRight':
      return 'R-Ctrl';
    case 'AltLeft':
      return 'L-Alt';
    case 'AltRight':
      return 'R-Alt';
    default:
      return codeOrKey.length === 1 ? codeOrKey.toUpperCase() : codeOrKey;
  }
}

export function isKeyPressed(bindingCode: string, keys: Record<string, boolean>): boolean {
  if (!bindingCode) return false;
  if (keys[bindingCode]) return true;

  // Also check character letter equivalent (e.g. 'KeyA' -> 'a' / 'A')
  if (bindingCode.startsWith('Key')) {
    const char = bindingCode.slice(3).toLowerCase();
    if (keys[char] || keys[char.toUpperCase()]) return true;
  } else if (bindingCode.startsWith('Digit')) {
    const digit = bindingCode.slice(5);
    if (keys[digit]) return true;
  } else if (bindingCode === 'Space' && (keys[' '] || keys['Space'])) {
    return true;
  }
  return false;
}
