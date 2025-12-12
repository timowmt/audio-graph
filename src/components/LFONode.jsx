import React from 'react';

export default function LFONode({ 
  node, 
  onUpdateData,
  onStartConnection, 
  onCompleteConnection 
}) {
  const output = 'out';

  return (
    <div className="p-3 relative">
      {/* Inputs (Left) - LFO 节点没有输入 */}
      
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
          <span className="w-16">Speed:</span>
          <input 
            type="range" 
            min="0.1" 
            max="10" 
            step="0.1"
            value={node.data.speed ?? 1}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onUpdateData(node.id, { speed: val });
            }}
            onMouseDown={e => e.stopPropagation()}
            className="flex-1 accent-cyan-400 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-10 text-right">{(node.data.speed ?? 1).toFixed(1)}</span>
        </div>
        <div className="text-[10px] text-gray-400 pt-1">
          Low Frequency Oscillator
        </div>
      </div>
    </div>
  );
}

