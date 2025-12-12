
import React, { useRef, useEffect } from 'react';
import { NODE_TYPES } from '../constants';

/**
 * Canvas 渲染组件
 */
export default function CanvasRenderer({ nodes, getValue }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let startTime = Date.now();
    let animationFrameId = null;

    const drawPattern = (ctx, width, height, time) => {
      // 半透明黑色背景，产生拖影效果
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // 找到所有 Pattern 节点并绘制
      nodes
        .filter(n => n.type === NODE_TYPES.PATTERN)
        .forEach(node => {
          const radius = getValue(node.id, 'radius', 50);
          const speed = getValue(node.id, 'speed', 10);
          const count = getValue(node.id, 'count', 5);
          const colorShift = getValue(node.id, 'color', 0);

          const centerX = width / 2;
          const centerY = height / 2;

          ctx.save();
          ctx.translate(centerX, centerY);
          
          // 旋转整个系统
          ctx.rotate(time * 0.0005 * (speed / 10));

          for (let i = 0; i < Math.max(1, count); i++) {
            ctx.save();
            const angle = (Math.PI * 2 * i) / Math.max(1, count);
            ctx.rotate(angle);
            
            // 动态颜色
            const hue = (time * 0.1 + colorShift + (i * 20)) % 360;
            ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            // 绘制形状
            const r = Math.abs(radius) + 10;
            if (node.data.shape === 'square') {
              ctx.rect(-r/2, -r/2, r, r);
            } else {
              ctx.arc(0, r, r/2, 0, Math.PI * 2);
            }
            
            ctx.stroke();
            ctx.restore();
          }
          ctx.restore();
        });
    };

    const loop = () => {
      const now = Date.now();
      const time = now - startTime;

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        const rect = canvasRef.current.getBoundingClientRect();
        
        // 处理高 DPI 显示
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = rect.width * dpr;
        canvasRef.current.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        drawPattern(ctx, rect.width, rect.height, time);
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    loop();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [nodes, getValue]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}

