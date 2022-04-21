const isUrl = (value) => /^((https|http):\/\/)(www.)?([a-z0-9-.]*\.[a-z]*)(\/[a-zA-Z0-9#-_]+\/?)*$/mg.test(value);

const isUrlMethod = (value, helpers) => {
  if (!isUrl(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

module.exports = {
  isUrlMethod,
  isUrl,
};
