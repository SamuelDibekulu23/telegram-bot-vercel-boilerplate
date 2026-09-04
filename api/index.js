module.exports = async (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'FineBot is running'
  });
};