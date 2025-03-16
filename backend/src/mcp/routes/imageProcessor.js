import express from 'express';
import path from 'path';
import ImageProcessor from '../services/ImageProcessor.js';

const router = express.Router();
const imageProcessor = new ImageProcessor();

// 处理图片目录
router.post('/process', async (req, res) => {
  try {
    const { sourceDir, options } = req.body;
    
    if (!sourceDir) {
      return res.status(400).json({ 
        success: false, 
        error: '请提供源目录路径' 
      });
    }

    const result = await imageProcessor.processDirectory(sourceDir, options);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('图片处理错误:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取目录统计信息
router.get('/stats/:dir(*)', async (req, res) => {
  try {
    const dir = req.params.dir;
    const stats = await imageProcessor.getDirectoryStats(dir);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取处理报告
router.get('/report/:dir(*)', async (req, res) => {
  try {
    const dir = req.params.dir;
    const reportPath = path.join(dir, 'process-report.json');
    const report = await import(reportPath);
    res.json({ success: true, data: report.default });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: '处理报告不存在'
    });
  }
});

export default router; 
