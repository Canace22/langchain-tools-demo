import ImageProcessor from '../services/ImageProcessor.js';

const imageProcessor = new ImageProcessor();

/**
 * 处理图片目录
 * @param {string} message - 用户消息，包含目录路径和可选的处理选项
 * @returns {Promise<string>} - 处理结果的描述
 */
export async function processImages(message) {
  try {
    // 从消息中提取目录路径和选项
    const sourceDir = extractDirectoryPath(message);
    const options = extractOptions(message);

    if (!sourceDir) {
      return '请提供要处理的图片目录路径。例如：\n- 处理目录 /path/to/images\n- 整理图片 /path/to/images 按日期分类';
    }

    // 调用 MCP 服务处理图片
    const result = await imageProcessor.processDirectory(sourceDir, options);

    // 生成处理报告的文本描述
    return formatProcessResult(result);
  } catch (error) {
    console.error('图片处理错误:', error);
    return `处理图片时出错: ${error.message}`;
  }
}

/**
 * 获取目录统计信息
 * @param {string} message - 用户消息，包含目录路径
 * @returns {Promise<string>} - 统计信息的描述
 */
export async function getDirectoryStats(message) {
  try {
    const dir = extractDirectoryPath(message);
    
    if (!dir) {
      return '请提供要统计的目录路径。例如：\n- 统计目录 /path/to/images\n- 查看图片 /path/to/images';
    }

    const stats = await imageProcessor.getDirectoryStats(dir);
    return formatStatsResult(stats);
  } catch (error) {
    console.error('获取统计信息错误:', error);
    return `获取统计信息时出错: ${error.message}`;
  }
}

// 辅助函数：从消息中提取目录路径
function extractDirectoryPath(message) {
  const pathMatch = message.match(/[\/\\][\w\-\.\/\\]+/);
  return pathMatch ? pathMatch[0] : null;
}

// 辅助函数：从消息中提取处理选项
function extractOptions(message) {
  const options = {
    renameFormat: 'timestamp',
    createSubfolders: true,
    copyInsteadOfMove: false
  };

  if (message.includes('按日期') || message.includes('日期格式')) {
    options.renameFormat = 'date';
  }

  if (message.includes('不分类') || message.includes('不创建文件夹')) {
    options.createSubfolders = false;
  }

  if (message.includes('复制') || message.includes('保留原文件')) {
    options.copyInsteadOfMove = true;
  }

  return options;
}

// 辅助函数：格式化处理结果
function formatProcessResult(result) {
  const { totalFiles, processedFiles, errors, targetDirectory } = result;
  
  let response = `处理完成！\n`;
  response += `- 总文件数：${totalFiles}\n`;
  response += `- 成功处理：${processedFiles}\n`;
  response += `- 处理失败：${errors.length}\n`;
  response += `- 输出目录：${targetDirectory}\n`;

  if (errors.length > 0) {
    response += '\n处理失败的文件：\n';
    errors.forEach(({ file, error }) => {
      response += `- ${file}: ${error}\n`;
    });
  }

  return response;
}

// 辅助函数：格式化统计结果
function formatStatsResult(stats) {
  const { totalFiles, imageFiles, formats, totalSize } = stats;
  
  let response = `目录统计信息：\n`;
  response += `- 总文件数：${totalFiles}\n`;
  response += `- 图片文件：${imageFiles}\n`;
  response += `- 总大小：${formatFileSize(totalSize)}\n`;
  
  if (Object.keys(formats).length > 0) {
    response += '\n图片格式分布：\n';
    Object.entries(formats).forEach(([format, count]) => {
      response += `- ${format}: ${count} 个\n`;
    });
  }

  return response;
}

// 辅助函数：格式化文件大小
function formatFileSize(size) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let index = 0;
  let fileSize = size;

  while (fileSize >= 1024 && index < units.length - 1) {
    fileSize /= 1024;
    index++;
  }

  return `${fileSize.toFixed(2)} ${units[index]}`;
} 