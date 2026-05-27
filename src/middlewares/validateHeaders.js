const validateHeaders = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.headers, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
  });

  if (error) return next(error);

  req.validHead = value;
  next();
};

export default validateHeaders;
