import React from 'react';
import { renderPath, getHandlePosition } from '../utils/graphUtils';

/**
 * 边（连接线）渲染组件
 */
export default function EdgeRenderer({ nodes, edges, connecting, onRemoveEdge }) {
  return (
    <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-visible">
      {/* 已存在的连接 */}
      {edges.map(edge => {
        const start = getHandlePosition(
          edge.source, 
          edge.sourceHandle, 
          'source', 
          nodes
        );
        const end = getHandlePosition(
          edge.target, 
          edge.targetHandle, 
          'target', 
          nodes
        );
        
        return (
          <g key={edge.id}>
            <path 
              d={renderPath(start.x, start.y, end.x, end.y)}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              className="opacity-60"
            />
            {/* 点击删除区域 */}
            <path 
              d={renderPath(start.x, start.y, end.x, end.y)}
              fill="none"
              stroke="transparent"
              strokeWidth="15"
              className="pointer-events-auto cursor-pointer hover:stroke-red-500/20 transition-colors"
              onClick={() => onRemoveEdge(edge.id)}
            />
          </g>
        );
      })}
      
      {/* 正在连接的临时线 */}
      {connecting && (
        <path 
          d={renderPath(connecting.startX, connecting.startY, connecting.currentX, connecting.currentY)}
          fill="none"
          stroke="#facc15"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}
    </svg>
  );
}

