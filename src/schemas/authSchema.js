import joi from 'joi';

 const authRegisterSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.ref('password')
});

export default authRegisterSchema;