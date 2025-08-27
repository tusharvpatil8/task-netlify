  const ValidateBody = (schema) => {
    return (req, res, next) => {
      const reqData = req.body;

      const { error, value } = schema.validate(reqData);

      if (error) {
        return res.status(400).json({
          success: false,
          message: `validation error: ${error.details[0].message}`,
          data: [],
        });
      }

      req.body = value;
      next();
    };
  };


  module.exports = {
  ValidateBody,
};