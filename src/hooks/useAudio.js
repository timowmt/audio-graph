import { useRef, useCallback } from 'react';
import { handleAudioError, validateAudioFile } from '../utils/errorHandler';

/**
 * 音频处理 Hook
 */
export const useAudio = (setError) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioElRef = useRef(null);
  const sourceNodeRef = useRef(null);

  // 初始化音频上下文
  const initAudio = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
          throw new Error('浏览器不支持 Web Audio API');
        }
        
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        if (!audioElRef.current) {
          audioElRef.current = new Audio();
        }
        
        // 创建媒体元素源
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElRef.current);
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
      
      // 恢复暂停的上下文
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(err => {
          handleAudioError(err, setError);
        });
      }
    } catch (error) {
      handleAudioError(error, setError);
      throw error;
    }
  }, [setError]);

  // 加载音频文件
  const loadAudioFile = useCallback((file, onLoad) => {
    try {
      validateAudioFile(file);
      
      if (!audioElRef.current) {
        audioElRef.current = new Audio();
      }
      
      const url = URL.createObjectURL(file);
      audioElRef.current.src = url;
      audioElRef.current.loop = true;
      
      // 添加错误处理
      audioElRef.current.onerror = (e) => {
        handleAudioError(new Error('音频文件加载失败'), setError);
        if (onLoad) onLoad(null);
      };
      
      audioElRef.current.onloadeddata = () => {
        initAudio();
        if (onLoad) onLoad(file.name);
      };
      
      // 清理旧的 URL
      audioElRef.current.onloadstart = () => {
        if (audioElRef.current.dataset.oldUrl) {
          URL.revokeObjectURL(audioElRef.current.dataset.oldUrl);
        }
        audioElRef.current.dataset.oldUrl = url;
      };
      
    } catch (error) {
      handleAudioError(error, setError);
      if (onLoad) onLoad(null);
    }
  }, [initAudio, setError]);

  // 播放/暂停
  const togglePlay = useCallback(async () => {
    try {
      initAudio();
      
      if (!audioElRef.current) {
        throw new Error('音频未加载');
      }
      
      if (audioElRef.current.paused) {
        await audioElRef.current.play();
        return true;
      } else {
        audioElRef.current.pause();
        return false;
      }
    } catch (error) {
      handleAudioError(error, setError);
      return false;
    }
  }, [initAudio, setError]);

  // 获取音频数据
  const getFrequencyData = useCallback(() => {
    if (!analyserRef.current) {
      return new Uint8Array(128);
    }
    const freqData = new Uint8Array(128);
    analyserRef.current.getByteFrequencyData(freqData);
    return freqData;
  }, []);

  // 清理资源
  const cleanup = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.src = '';
      if (audioElRef.current.dataset.oldUrl) {
        URL.revokeObjectURL(audioElRef.current.dataset.oldUrl);
      }
    }
    
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // 忽略断开连接错误
      }
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {
        // 忽略关闭错误
      });
    }
  }, []);

  return {
    initAudio,
    loadAudioFile,
    togglePlay,
    getFrequencyData,
    cleanup,
    audioElRef,
    analyserRef,
    audioContextRef
  };
};

