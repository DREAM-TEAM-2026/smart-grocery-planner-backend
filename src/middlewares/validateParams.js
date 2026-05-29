const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) return next(error);

  req.validated = value;
  next();
};

export default validateParams;
