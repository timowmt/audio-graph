import { useRef, useCallback } from 'react';
import { NODE_TYPES } from '../constants';
import { getNodeValue } from '../utils/graphUtils';

/**
 * 图执行引擎 Hook
 */
export const useGraphExecution = (nodes, edges) => {
  const valuesRef = useRef({});

  const processGraph = useCallback((time, getFrequencyData) => {
    const values = {};
    const freqData = getFrequencyData ? getFrequencyData() : new Uint8Array(128);

    // 按类型顺序处理节点（Source -> LFO/Value -> Math -> Pattern）
    
    // 1. 处理音频源
    nodes
      .filter(n => n.type === NODE_TYPES.AUDIO_SOURCE)
      .forEach(node => {
        // 频段划分
        const bass = freqData.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
        const mid = freqData.slice(10, 50).reduce((a, b) => a + b, 0) / 40 / 255;
        const high = freqData.slice(50, 100).reduce((a, b) => a + b, 0) / 50 / 255;
        
        values[`${node.id}-bass`] = bass * 100;
        values[`${node.id}-mid`] = mid * 100;
        values[`${node.id}-high`] = high * 100;
      });

    // 2. 处理 LFO
    nodes
      .filter(n => n.type === NODE_TYPES.LFO)
      .forEach(node => {
        const speed = node.data.speed || 1;
        const val = Math.sin(time * 0.002 * speed) * 50 + 50; // 0-100
        values[`${node.id}-out`] = val;
      });

    // 3. 处理 VALUE (常量)
    nodes
      .filter(n => n.type === NODE_TYPES.VALUE)
      .forEach(node => {
        values[`${node.id}-out`] = node.data.value || 0;
      });

    // 4. 处理 Math 节点
    nodes
      .filter(n => n.type === NODE_TYPES.MATH_ADD || n.type === NODE_TYPES.MATH_MULT)
      .forEach(node => {
        const valA = getNodeValue(node.id, 'a', edges, valuesRef, 0);
        const valB = getNodeValue(node.id, 'b', edges, valuesRef, node.data.valueB || 1);
        
        let res = 0;
        if (node.type === NODE_TYPES.MATH_ADD) {
          res = valA + valB;
        } else if (node.type === NODE_TYPES.MATH_MULT) {
          res = valA * valB;
        }
        
        values[`${node.id}-result`] = res;
      });

    // 更新值缓存
    valuesRef.current = { ...valuesRef.current, ...values };
    
    return valuesRef.current;
  }, [nodes, edges]);

  const getValue = useCallback((nodeId, handleName, defaultValue = 0) => {
    return getNodeValue(nodeId, handleName, edges, valuesRef, defaultValue);
  }, [edges]);

  return {
    processGraph,
    getValue,
    valuesRef
  };
};

