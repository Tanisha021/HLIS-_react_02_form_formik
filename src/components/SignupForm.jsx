import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Circles } from 'react-loader-spinner';

const SignupForm = () => {
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            age: "",
            termsAndConditions: false,
        },

        validationSchema: Yup.object({
            email: Yup.string().trim().email("Invalid email").required("Email is required"),
            name: Yup.string().trim().min(3, "Name must be at least 3 characters").required("Name is required"),
            password: Yup.string().trim().min(6, "Password must be at least 6 characters").required("Password is required"),
            confirmPassword: Yup.string().trim().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),
            age: Yup.number()
            .typeError("Age must be a number")
            .integer("Age must be an integer")
            .positive("should be positive")
            .min(18, "You must be at least 18 years old")
            .max(120, "Please enter a realistic age"),
            termsAndConditions: Yup.boolean().oneOf([true], "You must accept the terms and conditions").required("You must accept the terms and conditions"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setLoading(true)
                const userId = Math.floor(Math.random() * 10) + 1;
                const data = {
                    title: "foo",
                    body: "bar",
                    userId: userId
                };
                const response = await axios.post('https://jsonplaceholder.typicode.com/posts',data )
                console.log("api_resonse", response.data.data);

                toast.success("Signup successful");
                resetForm();         
            } catch (err) {
                console.log(err)
                toast.error("Failed to submit form.");
            } finally {
                setLoading(false)
                setSubmitting(false)
            }
        }
    });
    return (
        <div className="max-w-md  mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">signup</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Name</label>
                    <input type="text" name="name" placeholder="Enter your full name"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                   {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Email</label>
                    <input type="email" name="email" placeholder="Enter your email"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                    ) : null}
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Password</label>
                    <input type="password" name="password" placeholder="Enter your password"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                    ) : null}
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                    <input type="password" name="confirmPassword" placeholder="Confirm your password"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                    ) : null}
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Age</label>
                    <input type="number" name="age" placeholder="Enter your age"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.age}
                    />
                    {formik.touched.age && formik.errors.age ? (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.age}</div>
                    ) : null}
                </div>
                <div className="flex items-start gap-2">
                    <label>Terms and Conditions</label>
                    <input type="checkbox" name="termsAndConditions" checked={formik.values.termsAndConditions}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.termsAndConditions && formik.errors.termsAndConditions ? (
                        <div className="text-red-500 text-sm">{formik.errors.termsAndConditions}</div>
                    ) : null}
                </div>
                <button type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
                >
                    {loading ? 
                    (<Circles
                        height="40"
                        width="40"
                        color="#4fa94d"
                        ariaLabel="circles-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        />)
                    : "Submit"}
                </button>
            </form>
        </div>

    )
}

export default SignupForm
