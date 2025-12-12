import React from 'react';

export default function ValueNode({ 
  node, 
  onUpdateData,
  onStartConnection, 
  onCompleteConnection 
}) {
  const output = 'out';

  return (
    <div className="p-3 relative">
      {/* Inputs (Left) - Value 节点没有输入 */}
      
      {/* Outputs (Right) */}
      <div className="absolute right-[-6px] top-4 flex flex-col gap-[14px]">
        <div 
          className="w-3 h-3 bg-gray-600 rounded-full border border-white hover:bg-cyan-400 cursor-crosshair transition-colors" 
          onMouseDown={(e) => onStartConnection(e, node.id, output, 'source')}
          onMouseUp={(e) => onCompleteConnection(e, node.id, output, 'source')}
          title="Output"
        />
      </div>

      {/* Node UI Content */}
      <div className="text-xs space-y-2 px-2">
        <div className="flex items-center gap-2">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={node.data.value ?? 0}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              onUpdateData(node.id, { value: val });
            }}
            onMouseDown={e => e.stopPropagation()}
            className="w-full accent-cyan-400 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-8 text-right">{node.data.value ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

