import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

class ImageProcessor {
  constructor() {
    this.supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  }

  async processDirectory(sourceDir, options = {}) {
    const {
      renameFormat = 'timestamp',
      createSubfolders = true,
      copyInsteadOfMove = false
    } = options;

    try {
      await fs.access(sourceDir);
      const files = await fs.readdir(sourceDir);
      const imageFiles = files.filter(file => 
        this.supportedFormats.includes(path.extname(file).toLowerCase())
      );

      const results = [];
      const errors = [];

      let targetDir = sourceDir;
      if (createSubfolders) {
        const timestamp = new Date().toISOString().split('T')[0];
        targetDir = path.join(sourceDir, timestamp);
        await fs.mkdir(targetDir, { recursive: true });
      }

      for (const file of imageFiles) {
        try {
          const result = await this.processImage(file, sourceDir, targetDir, {
            renameFormat,
            copyInsteadOfMove
          });
          results.push(result);
        } catch (err) {
          errors.push({ file, error: err.message });
        }
      }

      const report = {
        timestamp: Date.now(),
        sourceDirectory: sourceDir,
        targetDirectory: targetDir,
        totalFiles: imageFiles.length,
        processedFiles: results.length,
        errors: errors,
        results: results
      };

      const reportPath = path.join(targetDir, 'process-report.json');
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

      return report;
    } catch (err) {
      throw new Error(`处理目录失败: ${err.message}`);
    }
  }

  async processImage(fileName, sourceDir, targetDir, options) {
    const { renameFormat, copyInsteadOfMove } = options;
    const sourcePath = path.join(sourceDir, fileName);
    const stats = await fs.stat(sourcePath);
    
    const newName = this.generateNewName(fileName, stats.birthtime, renameFormat);
    const targetPath = path.join(targetDir, newName);

    if (copyInsteadOfMove) {
      await fs.copyFile(sourcePath, targetPath);
    } else {
      await fs.rename(sourcePath, targetPath);
    }

    return {
      originalName: fileName,
      newName: newName,
      originalPath: sourcePath,
      newPath: targetPath,
      size: stats.size,
      createTime: stats.birthtime,
      processTime: new Date()
    };
  }

  generateNewName(originalName, createTime, format) {
    const ext = path.extname(originalName);
    const timestamp = createTime.getTime();
    const hash = crypto.createHash('md5')
      .update(originalName + timestamp)
      .digest('hex')
      .slice(0, 6);
    
    if (format === 'date') {
      const dateStr = createTime.toISOString()
        .split('T')[0]
        .replace(/-/g, '');
      return `${dateStr}_${hash}${ext}`;
    }
    
    return `${timestamp}_${hash}${ext}`;
  }

  async getDirectoryStats(dir) {
    const files = await fs.readdir(dir);
    const imageFiles = files.filter(file => 
      this.supportedFormats.includes(path.extname(file).toLowerCase())
    );

    const stats = {
      totalFiles: files.length,
      imageFiles: imageFiles.length,
      formats: {},
      totalSize: 0
    };

    for (const file of imageFiles) {
      const ext = path.extname(file).toLowerCase();
      stats.formats[ext] = (stats.formats[ext] || 0) + 1;
      
      const fileStat = await fs.stat(path.join(dir, file));
      stats.totalSize += fileStat.size;
    }

    return stats;
  }
}

export default ImageProcessor; 
