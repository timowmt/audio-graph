import React from 'react';
import { Upload, Play, Pause } from 'lucide-react';

export default function AudioSourceNode({ 
  node, 
  onUpdateData, 
  onFileUpload,
  onTogglePlay,
  onStartConnection, 
  onCompleteConnection 
}) {
  const outputs = ['bass', 'mid', 'high'];

  return (
    <div className="p-3 relative">
      {/* Inputs (Left) - Audio Source 没有输入 */}
      
      {/* Outputs (Right) */}
      <div className="absolute right-[-6px] top-4 flex flex-col gap-[14px]">
        {outputs.map((k, i) => (
          <div 
            key={k} 
            className="w-3 h-3 bg-gray-600 rounded-full border border-white hover:bg-cyan-400 cursor-crosshair transition-colors" 
            onMouseDown={(e) => onStartConnection(e, node.id, k, 'source')}
            onMouseUp={(e) => onCompleteConnection(e, node.id, k, 'source')}
            title={k}
          />
        ))}
      </div>

      {/* Node UI Content */}
      <div className="text-xs space-y-2 px-2">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors">
            <Upload size={12} />
            <span className="truncate max-w-[100px]">
              {node.data.file || "Upload Audio"}
            </span>
            <input 
              type="file" 
              accept="audio/*" 
              className="hidden" 
              onChange={(e) => onFileUpload(e, node.id)} 
            />
          </label>
          <button 
            className={`flex items-center justify-center gap-2 p-1 rounded transition-colors ${
              node.data.playing ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'
            } ${!node.data.file ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => onTogglePlay(node.id)}
            disabled={!node.data.file}
          >
            {node.data.playing ? <Pause size={12}/> : <Play size={12}/>}
            {node.data.playing ? "Playing" : "Play"}
          </button>
          <div className="flex justify-between text-[10px] text-gray-400 pt-2">
            <span>Bass</span><span>Mid</span><span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}

