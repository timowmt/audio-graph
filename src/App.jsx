import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Save, Download, Upload as UploadIcon } from 'lucide-react';
import { NODE_TYPES, INITIAL_NODES, INITIAL_EDGES } from './constants';
import { useAudio } from './hooks/useAudio';
import { useGraphExecution } from './hooks/useGraphExecution';
import { isValidConnection } from './utils/graphUtils';
import { saveProject, loadProject, exportProject, importProject } from './utils/storage';
import Node from './components/Node';
import CanvasRenderer from './components/CanvasRenderer';
import EdgeRenderer from './components/EdgeRenderer';
import ErrorToast from './components/ErrorToast';

export default function AudioGraphVisualizer() {
  // State
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [draggedNode, setDraggedNode] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Audio Hook
  const { 
    loadAudioFile, 
    togglePlay, 
    getFrequencyData, 
    cleanup 
  } = useAudio(setError);

  // Graph Execution Hook
  const { processGraph, getValue } = useGraphExecution(nodes, edges);

  // 渲染循环 - 优化：使用 useRef 避免依赖变化导致重新绑定
  const processGraphRef = useRef(processGraph);
  const getFrequencyDataRef = useRef(getFrequencyData);
  
  useEffect(() => {
    processGraphRef.current = processGraph;
    getFrequencyDataRef.current = getFrequencyData;
  }, [processGraph, getFrequencyData]);

  useEffect(() => {
    let animationFrameId = null;
    let startTime = Date.now();
    
    const loop = () => {
      const time = Date.now() - startTime;
      processGraphRef.current(time, getFrequencyDataRef.current);
      animationFrameId = requestAnimationFrame(loop);
    };
    
    loop();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []); // 空依赖数组，只在组件挂载时运行一次

  // 清理资源
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // 加载保存的项目
  useEffect(() => {
    const saved = loadProject();
    if (saved && saved.nodes.length > 0) {
      setNodes(saved.nodes);
      setEdges(saved.edges);
    }
  }, []);

  // 自动保存（防抖）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nodes.length > 0) {
        saveProject(nodes, edges);
      }
    }, 2000); // 2秒后自动保存

    return () => clearTimeout(timer);
  }, [nodes, edges]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S 保存
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveProject(nodes, edges);
        setError('项目已保存');
      }
      // Escape 关闭菜单
      if (e.key === 'Escape') {
        setContextMenu(null);
        setConnecting(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges]);

  // 节点拖拽
  const handleMouseDown = useCallback((e, nodeId) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setDraggedNode({ 
        id: nodeId, 
        startX: e.clientX, 
        startY: e.clientY, 
        nodeStartX: node.x, 
        nodeStartY: node.y 
      });
    }
  }, [nodes]);

  const handleMouseMove = useCallback((e) => {
    if (draggedNode) {
      const dx = e.clientX - draggedNode.startX;
      const dy = e.clientY - draggedNode.startY;
      setNodes(nds => nds.map(n => 
        n.id === draggedNode.id 
          ? { ...n, x: draggedNode.nodeStartX + dx, y: draggedNode.nodeStartY + dy } 
          : n
      ));
    }
    if (connecting) {
        setConnecting(prev => ({ ...prev, currentX: e.clientX, currentY: e.clientY }));
    }
  }, [draggedNode, connecting]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    setConnecting(null);
  }, []);

  // 连接处理
  const startConnection = useCallback((e, nodeId, handle, type) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setConnecting({
        nodeId,
        handle,
      type,
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        currentX: e.clientX,
        currentY: e.clientY
    });
  }, []);

  const completeConnection = useCallback((e, nodeId, handle, type) => {
    e.stopPropagation();
    if (!connecting) return;
    if (connecting.nodeId === nodeId) return;
    if (connecting.type === type) return;

    const source = connecting.type === 'source' 
      ? { nodeId: connecting.nodeId, handle: connecting.handle }
      : { nodeId, handle };
    const target = connecting.type === 'target' 
      ? { nodeId: connecting.nodeId, handle: connecting.handle }
      : { nodeId, handle };

    if (isValidConnection(source.nodeId, target.nodeId, source.handle, target.handle, edges)) {
        setEdges(prev => [...prev, {
            id: `e-${Date.now()}`,
            source: source.nodeId,
            sourceHandle: source.handle,
            target: target.nodeId,
            targetHandle: target.handle
        }]);
    }
    setConnecting(null);
  }, [connecting, edges]);

  // 节点操作
  const removeNode = useCallback((id) => {
      setNodes(prev => prev.filter(n => n.id !== id));
      setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
  }, []);

  const removeEdge = useCallback((id) => {
      setEdges(prev => prev.filter(e => e.id !== id));
  }, []);

  const addNode = useCallback((type) => {
      const id = `${type.toLowerCase()}-${Date.now()}`;
      const newNode = {
          id,
          type,
          x: 100 + Math.random() * 200,
          y: 100 + Math.random() * 200,
          data: {}
      };
    
    if (type === NODE_TYPES.MATH_MULT) {
      newNode.data = { valueB: 1 };
    } else if (type === NODE_TYPES.PATTERN) {
      newNode.data = { shape: 'circle' };
    } else if (type === NODE_TYPES.LFO) {
      newNode.data = { speed: 1 };
    } else if (type === NODE_TYPES.VALUE) {
      newNode.data = { value: 50 };
    }
      
      setNodes(prev => [...prev, newNode]);
      setContextMenu(null);
  }, []);

  const updateNodeData = useCallback((nodeId, data) => {
    setNodes(prev => prev.map(n => 
      n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
    ));
  }, []);

  // 音频文件上传
  const handleFileUpload = useCallback(async (e, nodeId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    loadAudioFile(file, (fileName) => {
      if (fileName) {
        updateNodeData(nodeId, { file: fileName, playing: false });
      }
      setLoading(false);
    });
  }, [loadAudioFile, updateNodeData]);

  // 播放/暂停
  const handleTogglePlay = useCallback(async (nodeId) => {
    const isPlaying = await togglePlay();
    updateNodeData(nodeId, { playing: isPlaying });
  }, [togglePlay, updateNodeData]);

  // 保存/加载功能
  const handleSave = useCallback(() => {
    if (saveProject(nodes, edges)) {
      setError('项目已保存到本地存储');
    } else {
      setError('保存失败');
    }
  }, [nodes, edges]);

  const handleExport = useCallback(() => {
    try {
      exportProject(nodes, edges);
      setError('项目已导出');
    } catch (err) {
      setError('导出失败');
    }
  }, [nodes, edges]);

  const handleImport = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const project = await importProject(file);
      setNodes(project.nodes);
      setEdges(project.edges);
      setError('项目已导入');
    } catch (err) {
      setError(err.message || '导入失败');
    } finally {
      setLoading(false);
      e.target.value = ''; // 重置文件输入
    }
  }, []);

  return (
    <div 
        className="w-full h-screen bg-gray-900 text-white overflow-hidden relative font-mono select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      onClick={() => setContextMenu(null)}
    >
      {/* 1. 背景 Canvas */}
      <CanvasRenderer nodes={nodes} getValue={getValue} />

      {/* 2. SVG 连接层 */}
      <EdgeRenderer 
        nodes={nodes}
        edges={edges}
        connecting={connecting}
        onRemoveEdge={removeEdge}
      />

      {/* 3. 节点层 */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {nodes.map(node => (
          <Node
                key={node.id}
            node={node}
            onMouseDown={handleMouseDown}
            onRemove={removeNode}
            onStartConnection={startConnection}
            onCompleteConnection={completeConnection}
            onUpdateData={updateNodeData}
            onFileUpload={handleFileUpload}
            onTogglePlay={handleTogglePlay}
          />
        ))}
      </div>

      {/* 4. UI 叠加层 */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="relative group">
            <button 
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setContextMenu(contextMenu === 'add' ? null : 'add');
              }}
            >
              <Plus size={18} />
              <span>Add Node</span>
            </button>
            
            {contextMenu === 'add' && (
              <div 
                className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden flex flex-col z-50"
                onClick={(e) => e.stopPropagation()}
              >
                {Object.keys(NODE_TYPES).map(type => (
                  <button 
                    key={type}
                    className="text-left px-4 py-3 hover:bg-gray-700 text-sm border-b border-gray-700 last:border-0 transition-colors"
                    onClick={() => addNode(NODE_TYPES[type])}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
            onClick={handleSave}
            title="保存项目 (Ctrl+S)"
          >
            <Save size={18} />
            <span>Save</span>
          </button>

          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
            onClick={handleExport}
            title="导出项目"
          >
            <Download size={18} />
            <span>Export</span>
          </button>

          <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all cursor-pointer">
            <UploadIcon size={18} />
            <span>Import</span>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleImport}
            />
          </label>
        </div>
        
        <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-300">
          Drag output (Right) to input (Left). Press ESC to cancel. Ctrl+S to save.
        </div>
      </div>

      {/* 5. 错误提示 */}
      <ErrorToast error={error} onClose={() => setError(null)} />

      {/* 6. 加载指示器 */}
      {loading && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-cyan-600/90 text-white px-4 py-2 rounded-lg shadow-lg">
          加载音频中...
        </div>
      )}
    </div>
  );
}
