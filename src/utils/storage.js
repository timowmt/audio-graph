// 本地存储工具函数

const STORAGE_KEY = 'audio-graph-project';

/**
 * 保存项目到本地存储
 */
export const saveProject = (nodes, edges) => {
  try {
    const project = {
      nodes,
      edges,
      version: '1.0.0',
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    return true;
  } catch (error) {
    console.error('保存项目失败:', error);
    return false;
  }
};

/**
 * 从本地存储加载项目
 */
export const loadProject = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const project = JSON.parse(data);
    return {
      nodes: project.nodes || [],
      edges: project.edges || []
    };
  } catch (error) {
    console.error('加载项目失败:', error);
    return null;
  }
};

/**
 * 导出项目为 JSON
 */
export const exportProject = (nodes, edges) => {
  const project = {
    nodes,
    edges,
    version: '1.0.0',
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audio-graph-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * 导入项目从 JSON 文件
 */
export const importProject = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target.result);
        resolve({
          nodes: project.nodes || [],
          edges: project.edges || []
        });
      } catch (error) {
        reject(new Error('无效的项目文件格式'));
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file);
  });
};

