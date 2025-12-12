// 图工具函数

/**
 * 获取节点的输入值
 */
export const getNodeValue = (nodeId, handleName, edges, valuesRef, defaultValue = 0) => {
  const edge = edges.find(e => e.target === nodeId && e.targetHandle === handleName);
  if (edge) {
    const sourceVal = valuesRef.current[`${edge.source}-${edge.sourceHandle}`];
    return sourceVal !== undefined ? sourceVal : defaultValue;
  }
  return defaultValue;
};

import { CANVAS_CONFIG, NODE_CONFIG } from '../constants';

/**
 * 计算连接点的位置
 */
export const getHandlePosition = (nodeId, handleName, type, nodes) => {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return { x: 0, y: 0 };

  const { NODE_WIDTH, HEADER_HEIGHT, SOCKET_HEIGHT } = CANVAS_CONFIG;
  const config = NODE_CONFIG[node.type];
  
  let yOffset = HEADER_HEIGHT + 20;
  
  if (type === 'target' && config?.inputs) {
    const index = config.inputs.indexOf(handleName);
    if (index !== -1) {
      yOffset += index * SOCKET_HEIGHT;
    }
  } else if (type === 'source' && config?.outputs) {
    const index = config.outputs.indexOf(handleName);
    if (index !== -1) {
      yOffset += index * SOCKET_HEIGHT;
    }
  }

  const x = type === 'source' ? node.x + NODE_WIDTH : node.x;
  const y = node.y + yOffset;
  return { x, y };
};

/**
 * 渲染 SVG 路径
 */
export const renderPath = (x1, y1, x2, y2) => {
  const dist = Math.abs(x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dist} ${y1}, ${x2 - dist} ${y2}, ${x2} ${y2}`;
};

/**
 * 检查连接是否有效
 */
export const isValidConnection = (source, target, sourceHandle, targetHandle, edges) => {
  // 不能连接自己
  if (source === target) return false;
  
  // 不能输入连输入或输出连输出（这个在调用时已经检查）
  
  // 检查是否已存在相同连接
  const exists = edges.find(edge => 
    edge.source === source && edge.sourceHandle === sourceHandle &&
    edge.target === target && edge.targetHandle === targetHandle
  );
  
  return !exists;
};

