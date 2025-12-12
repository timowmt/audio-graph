import React from 'react';
import { X, Activity, Zap, Settings, Circle } from 'lucide-react';
import { NODE_TYPES, NODE_CONFIG } from '../constants';
import AudioSourceNode from './AudioSourceNode';
import MathNode from './MathNode';
import PatternNode from './PatternNode';
import ValueNode from './ValueNode';
import LFONode from './LFONode';

const iconMap = {
  Activity,
  Zap,
  Settings,
  Circle
};

/**
 * 通用节点组件
 */
export default function Node({ 
  node, 
  onMouseDown, 
  onRemove, 
  onStartConnection, 
  onCompleteConnection,
  onUpdateData,
  onFileUpload,
  onTogglePlay
}) {
  const config = NODE_CONFIG[node.type];
  const Icon = iconMap[config?.icon] || Circle;

  const renderNodeContent = () => {
    switch (node.type) {
      case NODE_TYPES.AUDIO_SOURCE:
        return (
          <AudioSourceNode 
            node={node} 
            onUpdateData={onUpdateData}
            onFileUpload={onFileUpload}
            onTogglePlay={onTogglePlay}
            onStartConnection={onStartConnection}
            onCompleteConnection={onCompleteConnection}
          />
        );
      case NODE_TYPES.MATH_ADD:
      case NODE_TYPES.MATH_MULT:
        return (
          <MathNode 
            node={node} 
            onUpdateData={onUpdateData}
            onStartConnection={onStartConnection}
            onCompleteConnection={onCompleteConnection}
          />
        );
      case NODE_TYPES.PATTERN:
        return (
          <PatternNode 
            node={node} 
            onUpdateData={onUpdateData}
            onStartConnection={onStartConnection}
            onCompleteConnection={onCompleteConnection}
          />
        );
      case NODE_TYPES.VALUE:
        return (
          <ValueNode 
            node={node} 
            onUpdateData={onUpdateData}
            onStartConnection={onStartConnection}
            onCompleteConnection={onCompleteConnection}
          />
        );
      case NODE_TYPES.LFO:
        return (
          <LFONode 
            node={node} 
            onUpdateData={onUpdateData}
            onStartConnection={onStartConnection}
            onCompleteConnection={onCompleteConnection}
          />
        );
      default:
        return <div className="p-3 text-xs text-gray-400">未知节点类型</div>;
    }
  };

  return (
    <div
      className="absolute w-48 bg-gray-900/90 border border-gray-700 rounded-lg shadow-xl backdrop-blur-sm pointer-events-auto flex flex-col"
      style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
    >
      {/* 节点标题栏 */}
      <div 
        className="h-10 bg-gray-800 rounded-t-lg flex items-center justify-between px-3 cursor-move border-b border-gray-700"
        onMouseDown={(e) => onMouseDown(e, node.id)}
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className={`text-${config?.color}-400`} />
          <span className="text-sm font-bold text-gray-200">
            {node.type.replace('_', ' ')}
          </span>
        </div>
        <button 
          onClick={() => onRemove(node.id)} 
          className="text-gray-500 hover:text-red-400 transition-colors"
          title="删除节点"
        >
          <X size={14} />
        </button>
      </div>

      {/* 节点内容 */}
      {renderNodeContent()}
    </div>
  );
}

