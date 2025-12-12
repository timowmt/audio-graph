# Audio Graph Visualizer

一个基于 React 的音频可视化节点编辑器，通过连接不同的节点来创建动态的音频可视化效果。

## 功能特性

- 🎵 **音频处理** - 支持上传音频文件并实时分析频谱数据
- 🔗 **节点连接** - 通过拖拽连接不同的节点创建可视化流程
- 🎨 **实时渲染** - 基于 Canvas 的实时图形渲染
- 📊 **多种节点类型**：
  - **Audio Source** - 音频源节点，输出低音、中音、高音频段数据
  - **Math Add/Mult** - 数学运算节点（加法/乘法）
  - **Pattern** - 图案节点，根据输入参数绘制动态图形
  - **LFO** - 低频振荡器，生成周期性波形
  - **Value** - 常量值节点

## 技术栈

- **React 19** - UI 框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Web Audio API** - 音频处理
- **Canvas API** - 图形渲染

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用说明

1. **添加节点** - 点击左上角的 "Add Node" 按钮选择要添加的节点类型
2. **连接节点** - 从输出端口（右侧）拖拽到输入端口（左侧）创建连接
3. **上传音频** - 在 Audio Source 节点中点击上传按钮选择音频文件
4. **播放音频** - 点击 Play 按钮开始播放音频并查看可视化效果
5. **删除连接** - 点击连接线可以删除连接
6. **删除节点** - 点击节点右上角的 X 按钮删除节点
7. **移动节点** - 拖拽节点标题栏可以移动节点位置

## 键盘快捷键

- `ESC` - 关闭菜单或取消连接操作

## 项目结构

```
src/
├── components/          # React 组件
│   ├── Node.jsx        # 通用节点组件
│   ├── AudioSourceNode.jsx
│   ├── MathNode.jsx
│   ├── PatternNode.jsx
│   ├── ValueNode.jsx
│   ├── LFONode.jsx
│   ├── CanvasRenderer.jsx
│   ├── EdgeRenderer.jsx
│   └── ErrorToast.jsx
├── hooks/              # 自定义 Hooks
│   ├── useAudio.js     # 音频处理逻辑
│   └── useGraphExecution.js  # 图执行引擎
├── utils/              # 工具函数
│   ├── errorHandler.js # 错误处理
│   └── graphUtils.js   # 图工具函数
├── constants.js        # 常量定义
├── App.jsx             # 主应用组件
└── main.jsx            # 入口文件
```

## 浏览器支持

- Chrome/Edge (推荐)
- Firefox
- Safari

注意：需要支持 Web Audio API 的现代浏览器。

## 开发计划

- [ ] 保存/加载项目功能
- [ ] 撤销/重做功能
- [ ] 节点复制功能
- [ ] 画布缩放和平移
- [ ] 更多节点类型
- [ ] 节点对齐和网格吸附

## 许可证

MIT
