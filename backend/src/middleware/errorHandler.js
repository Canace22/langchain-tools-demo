export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.response) {
      // API 错误响应
      return res.status(err.response.status).json({
        error: err.response.data.message || '外部 API 调用失败'
      });
    }
    
    res.status(500).json({
      error: err.message || '服务器内部错误'
    });
  };