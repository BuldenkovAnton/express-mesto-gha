module.exports.handleError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: message === 500 ? 'Произошла ошибка' : message });

  next();
};
