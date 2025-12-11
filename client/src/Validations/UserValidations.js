import * as yup from "yup";
export const userSchemaValdition = yup.object().shape({
    name: yup.string()
    .required("Name is required"),
    email: yup.string()
    .email("Not valid email format")
    .required("Email is required"),
    password: yup.string()
    .min(4)
    .max(20)
    .required("Password is required"),
    Re_password: yup.string()
    .oneOf([yup.ref("password"),null],"Passwords Don't match")
    .required(),
});
