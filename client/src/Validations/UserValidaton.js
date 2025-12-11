import *as yup from "yup";
export const userSchemaValidation = yup.object().shape(
    {
      name:yup
      .string()
      .required("ypu should enter Name!"),
      
      email:yup.string()
      .email("Must Be Valid Email Address!")
      .required("email cannot be empty!"),

      password: yup.string()
      .min(4)
      .max(20)
      .required("password cannot be empty!"),

      confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords Don't Match")
    .required(),

    }
);