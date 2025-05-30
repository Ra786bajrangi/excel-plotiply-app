const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };
  
  export default errorHandler;