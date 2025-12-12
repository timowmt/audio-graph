import React from 'react';

export default function MathNode({ 
  node, 
  onUpdateData,
  onStartConnection, 
  onCompleteConnection 
}) {
  const inputs = ['a', 'b'];
  const output = 'result';

  return (
    <div className="p-3 relative">
      {/* Inputs (Left) */}
      <div className="absolute left-[-6px] top-4 flex flex-col gap-[14px]">
        {inputs.map((k, i) => (
          <div 
            key={k}
            className="w-3 h-3 bg-gray-600 rounded-full border border-gray-400 hover:bg-cyan-400 cursor-crosshair transition-colors" 
            onMouseDown={(e) => onStartConnection(e, node.id, k, 'target')}
            onMouseUp={(e) => onCompleteConnection(e, node.id, k, 'target')}
            title={`Input ${k.toUpperCase()}`}
          />
        ))}
      </div>

      {/* Outputs (Right) */}
      <div className="absolute right-[-6px] top-4 flex flex-col gap-[14px]">
        <div 
          className="w-3 h-3 bg-gray-600 rounded-full border border-white hover:bg-cyan-400 cursor-crosshair transition-colors" 
          onMouseDown={(e) => onStartConnection(e, node.id, output, 'source')}
          onMouseUp={(e) => onCompleteConnection(e, node.id, output, 'source')}
          title="Result"
        />
      </div>

      {/* Node UI Content */}
      <div className="text-xs space-y-2 px-2">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center h-6">
            <span>Input A</span>
          </div>
          <div className="flex justify-between items-center h-6">
            <span>Input B</span>
            <input 
              type="number" 
              className="w-12 bg-gray-800 border border-gray-600 rounded px-1 text-right text-xs focus:outline-none focus:border-cyan-400" 
              value={node.data.valueB ?? (node.type.includes('MULT') ? 1 : 0)}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                onUpdateData(node.id, { valueB: val });
              }}
              onMouseDown={e => e.stopPropagation()}
            />
          </div>
          <div className="flex justify-end pt-1">
            <span className="text-gray-400 text-[10px]">Result -&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
}

