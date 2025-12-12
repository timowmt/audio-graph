// 错误处理工具

export class AudioError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AudioError';
    this.code = code;
  }
}

export const handleAudioError = (error, setError) => {
  let errorMessage = '音频处理出错';
  
  if (error instanceof AudioError) {
    errorMessage = error.message;
  } else if (error.name === 'NotAllowedError') {
    errorMessage = '需要用户交互才能播放音频';
  } else if (error.name === 'NotSupportedError') {
    errorMessage = '浏览器不支持此音频格式';
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  if (setError) {
    setError(errorMessage);
    // 3秒后自动清除错误
    setTimeout(() => setError(null), 3000);
  }
  
  console.error('Audio Error:', error);
  return errorMessage;
};

export const validateAudioFile = (file) => {
  if (!file) {
    throw new AudioError('请选择一个音频文件', 'NO_FILE');
  }
  
  const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/m4a', 'audio/aac'];
  const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidType && !hasValidExtension) {
    throw new AudioError('不支持的音频格式，请使用 MP3、WAV 或 OGG 格式', 'INVALID_FORMAT');
  }
  
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    throw new AudioError('文件过大，请选择小于 50MB 的文件', 'FILE_TOO_LARGE');
  }
  
  return true;
};

