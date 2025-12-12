import React from 'react';

export default function PatternNode({ 
  node, 
  onUpdateData,
  onStartConnection, 
  onCompleteConnection 
}) {
  const inputs = ['radius', 'speed', 'count', 'color'];

  return (
    <div className="p-3 relative">
      {/* Inputs (Left) */}
      <div className="absolute left-[-6px] top-4 flex flex-col gap-[14px]">
        {inputs.map((k, i) => (
          <div 
            key={k} 
            className="w-3 h-3 bg-gray-600 rounded-full border border-gray-400 hover:bg-cyan-400 cursor-crosshair transition-colors" 
            style={{marginTop: i === 0 ? 0 : 0}}
            onMouseDown={(e) => onStartConnection(e, node.id, k, 'target')}
            onMouseUp={(e) => onCompleteConnection(e, node.id, k, 'target')}
            title={k}
          />
        ))}
      </div>

      {/* Outputs (Right) - Pattern 节点没有输出 */}
      
      {/* Node UI Content */}
      <div className="text-xs space-y-2 px-2">
        <div className="flex flex-col gap-[14px] pt-1 pb-1">
          {inputs.map((k) => (
            <div key={k} className="h-3 flex items-center">
              <span className="capitalize">{k}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

