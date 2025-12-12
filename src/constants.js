// 节点类型定义
export const NODE_TYPES = {
  AUDIO_SOURCE: 'AUDIO_SOURCE',
  LFO: 'LFO',
  MATH_ADD: 'MATH_ADD',
  MATH_MULT: 'MATH_MULT',
  PATTERN: 'PATTERN',
  VALUE: 'VALUE'
};

// 初始节点
export const INITIAL_NODES = [
  { id: 'audio-1', type: NODE_TYPES.AUDIO_SOURCE, x: 50, y: 50, data: { file: null, playing: false } },
  { id: 'mult-1', type: NODE_TYPES.MATH_MULT, x: 300, y: 150, data: { valueB: 2 } },
  { id: 'pattern-1', type: NODE_TYPES.PATTERN, x: 600, y: 100, data: { shape: 'circle' } }
];

// 初始连接
export const INITIAL_EDGES = [
  { id: 'e1', source: 'audio-1', sourceHandle: 'bass', target: 'mult-1', targetHandle: 'a' },
  { id: 'e2', source: 'mult-1', sourceHandle: 'result', target: 'pattern-1', targetHandle: 'radius' },
  { id: 'e3', source: 'audio-1', sourceHandle: 'mid', target: 'pattern-1', targetHandle: 'speed' },
];

// 节点配置
export const NODE_CONFIG = {
  [NODE_TYPES.AUDIO_SOURCE]: {
    outputs: ['bass', 'mid', 'high'],
    icon: 'Activity',
    color: 'green'
  },
  [NODE_TYPES.LFO]: {
    outputs: ['out'],
    icon: 'Circle',
    color: 'blue'
  },
  [NODE_TYPES.MATH_ADD]: {
    inputs: ['a', 'b'],
    outputs: ['result'],
    icon: 'Settings',
    color: 'blue'
  },
  [NODE_TYPES.MATH_MULT]: {
    inputs: ['a', 'b'],
    outputs: ['result'],
    icon: 'Settings',
    color: 'blue'
  },
  [NODE_TYPES.PATTERN]: {
    inputs: ['radius', 'speed', 'count', 'color'],
    icon: 'Zap',
    color: 'purple'
  },
  [NODE_TYPES.VALUE]: {
    outputs: ['out'],
    icon: 'Circle',
    color: 'gray'
  }
};

// 画布配置
export const CANVAS_CONFIG = {
  NODE_WIDTH: 192, // w-48 = 12rem = 192px
  HEADER_HEIGHT: 40,
  SOCKET_HEIGHT: 24,
  SOCKET_SIZE: 12
};

