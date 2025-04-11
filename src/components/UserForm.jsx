import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Circles } from 'react-loader-spinner';

const UserForm = () => {
    const [loading, setLoading] = useState(false)
    const [suggestedDomains, setSuggestedDomains] = useState([]);
    const [show, setShow] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const commonDomains = ["gmail.com", "outlook.com","ghibli.com"];

    const showHidePassword = () =>{
        const passwordField = document.getElementById("password");
        if(passwordField.type === "password"){
            passwordField.type = "text";
        } else {
            passwordField.type = "password";
        }
    }

    const showHideConfPassword = () =>{
        const passwordField = document.getElementById("confirmPassword");
        if(passwordField.type === "password"){
            passwordField.type = "text";
        } else {
            passwordField.type = "password";
        }
    };
    const handleEmailChange = (e) => {
        const value = e.target.value;
        formik.setFieldValue("PersonalEmail", value);
        console.log("value-------",value)
       const parts = value.split("@");
       console.log("parts-------",parts)
       if(parts.length === 2) {
            const domain = parts[1].toLowerCase();
            if (domain) {
                const matches = commonDomains.filter((d) => d.startsWith(domain));
                setSuggestedDomains(matches);
            } else {
                setSuggestedDomains([]);
            }
        }
    };
    const formik = useFormik({
        initialValues: {
            fullname: "",
            PersonalEmail: "",
            password: "",
            confirmPassword: "",
            account_type: "",
            termsAndConditions: false,
            companyName: "",
            businessEmail: "",
            vatNumber: ""
        },

        validationSchema: Yup.object({

            fullname: Yup.string().trim()
                .min(3, "Name must be at least 3 characters")
                .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces.")
                .required("Name is required"),

            PersonalEmail: Yup.string().trim().email("Invalid email").required("Email is required"),
            account_type: Yup.string().required("Account type is required"),
            companyName: Yup.string().when("account_type", {
                is: "Business",
                then:()=> Yup.string().required("Company name is required"),
                otherwise:()=> Yup.string().notRequired(),
            }),

            businessEmail: Yup.string().when("account_type", {
                is: "Business",
                then:()=> Yup.string()
                    .email("Invalid email")
                    .notOneOf([Yup.ref("PersonalEmail")], "Business email must be different from personal email")
                    .required("Business email is required"),
                otherwise:()=> Yup.string().notRequired(),
            }),

            password: Yup.string().trim()
                .min(8, "Password must be at least 6 characters")
                .matches(/^(?=.*[a-z])/, 'Must contain at least one lowercase character')
                .matches(/^(?=.*[A-Z])/, 'Must contain at least one uppercase character')
                .matches(/^(?=.*[0-9])/, 'Must contain at least one number')
                .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character.")
                .required("Password is required"),

            confirmPassword: Yup.string().trim().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),

            vatNumber: Yup.string().when("account_type", {
                is: "Business",
                then:()=> Yup.string()
                    .matches(/^\d{9,}$/, "VAT Number must be at least 8 digits")
                    .notRequired()
            }),
            termsAndConditions: Yup.boolean().oneOf([true], "You must accept the terms and conditions").required("You must accept the terms and conditions"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setLoading(true)
                setTimeout(() => { 
                    setSubmittedData(values);
                    console.log(values)
                    setShow(true);
                    const userId = Math.floor(Math.random() * 10) + 1;
                    toast.success(`Welcome ${values.fullname}! Your User ID is: ${userId}`)
                }, 2000);

                    resetForm();

            } catch (err) {
                console.log(err)
                toast.error("Error: " + err.message)
            } finally {
                setSubmitting(false)
            }
        }
    });
    return (
        <div className="max-w-md  mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <ToastContainer />
            {show ? (
            <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Signup Successful!</h2>
            <div className="space-y-2 text-gray-800">
              <p><strong>Full Name:</strong> {submittedData.fullname}</p>
              <p><strong>Email:</strong> {submittedData.PersonalEmail}</p>
              <p><strong>Account Type:</strong> {submittedData.account_type}</p>
              {submittedData.account_type === "Business" && (
                <>
                  <p><strong>Company Name:</strong> {submittedData.companyName}</p>
                  <p><strong>Business Email:</strong> {submittedData.businessEmail}</p>
                  <p><strong>VAT Number:</strong> {submittedData.vatNumber}</p>
                </>
              )}
            </div>
            <button
              onClick={() => {
                formik.resetForm();
                setShow(false);
                setSubmittedData(null);
                setLoading(false);
              }}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
              Start Over
            </button>
          </div>     
        ):(
            <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">signup</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="fullname" className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fullname}
                        className={`w-full border rounded px-3 py-2 ${formik.touched.fullname && formik.errors.fullname ? "border-red-500" : "border-gray-300"}`}
                    />
                    {formik.touched.fullname && formik.errors.fullname ? (
                        <div className="text-red-500 text-sm">{formik.errors.fullname}</div>
                    ) : null}
                </div>

                <div>
                    <label htmlFor="PersonalEmail" className="block text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        id="PersonalEmail"
                        name="PersonalEmail"
                        onChange={handleEmailChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.PersonalEmail}
                        className={`w-full border rounded px-3 py-2 ${formik.touched.PersonalEmail && formik.errors.PersonalEmail ? "border-red-500" : "border-gray-300"}`}
                    />
                    {formik.touched.PersonalEmail && formik.errors.PersonalEmail ? (
                        <div className="text-red-500 text-sm">{formik.errors.PersonalEmail}</div>
                    ) : null}
                    
                </div>
                {suggestedDomains.length > 0 && formik.values.PersonalEmail.includes("@") && (
                        <div className="mt-2 text-sm text-gray-600">
                            {suggestedDomains.map((domain,index)=>{
                                const name = formik.values.PersonalEmail.split("@")[0];
                                console.log("name",name)
                                console.log("domain",domain)
                                const suggestedEmail = `${name}@${domain}`;
                                console.log("suggestedEmail",suggestedEmail)
                                return(
                                    <li
                                        key={index}
                                        onClick={() => {formik.setFieldValue("PersonalEmail", suggestedEmail)
                                        setSuggestedDomains([])
                                        }}
                                        >
                                        {suggestedEmail}
                                    </li>
                                )
                            })}
                        </div>
                    )}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className={`w-full border rounded px-3 py-2 ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"}`}
                    />
                    <button type="button" onClick={showHidePassword} className="text-sm">show password</button>
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-sm">{formik.errors.password}</div>
                    ) : null}
                    <div className="mt-2">
                        <div className={`h-2 rounded ${formik.values.password.length < 6 ? "bg-red-500" : formik.values.password.length < 8 ? "bg-yellow-500" : "bg-green-500"}`}></div>
                        <div className="text-sm mt-1">
                            {formik.values.password.length < 6 ? "Weak" : formik.values.password.length < 8 ? "Moderate" : "Strong"}
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        className={`w-full border rounded px-3 py-2 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                    />
                    <button type="button" onClick={showHideConfPassword}>show password</button>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
                    ) : null}
                </div>

                <div>
                    <label htmlFor="account_type" className="block text-sm font-semibold mb-2">Account Type</label>
                    <select
                        id="account_type"
                        name="account_type"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.account_type}
                        className={`w-full border rounded px-3 py-2 ${formik.touched.account_type && formik.errors.account_type ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="">Select Account Type</option>
                        <option value="Personal">Personal</option>
                        <option value="Business">Business</option>
                    </select>
                    {formik.touched.account_type && formik.errors.account_type ? (
                        <div className="text-red-500 text-sm">{formik.errors.account_type}</div>
                    ) : null}
                </div>
                {formik.values.account_type === "Business" && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-semibold mb-2">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.companyName}
                                className={`w-full border rounded px-3 py-2 ${formik.touched.companyName && formik.errors.companyName ? "border-red-500" : "border-gray-300"}`}
                            />
                            {formik.touched.companyName && formik.errors.companyName ? (
                                <div className="text-red-500 text-sm">{formik.errors.companyName}</div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="businessEmail" className="block text-sm font-semibold mb-2">Business Email</label>
                            <input
                                type="email"
                                id="businessEmail"
                                name="businessEmail"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.businessEmail}
                                className={`w-full border rounded px-3 py-2 ${formik.touched.businessEmail && formik.errors.businessEmail ? "border-red-500" : "border-gray-300"}`}
                            />
                            {formik.touched.businessEmail && formik.errors.businessEmail ? (
                                <div className="text-red-500 text-sm">{formik.errors.businessEmail}</div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="vatNumber" className="block text-sm font-semibold mb-2">VAT Number</label>
                            <input
                                type="text"
                                id="vatNumber"
                                name="vatNumber"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.vatNumber}
                                className={`w-full border rounded px-3 py-2 ${formik.touched.vatNumber && formik.errors.vatNumber ? "border-red-500" : "border-gray-300"}`}
                            />
                            {formik.touched.vatNumber && formik.errors.vatNumber ? (
                                <div className="text-red-500 text-sm
                            ">{formik.errors.vatNumber}</div>
                            ) : null}
                        </div>
                    </div>
                )}

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="termsAndConditions"
                        name="termsAndConditions"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.termsAndConditions}
                        className={`mr-2 ${formik.touched.termsAndConditions && formik.errors.termsAndConditions ? "border-red-500" : "border-gray-300"}`}
                    />
                    <label htmlFor="termsAndConditions" className="text-sm font-semibold">I accept the terms and conditions</label>
                </div>
                {formik.touched.termsAndConditions && formik.errors.termsAndConditions ? (
                    <div className="text-red-500 text-sm">{formik.errors.termsAndConditions}</div>
                ) : null}

                <button
                    type="button"
                    onClick={() => formik.resetForm()}
                    className="w-full bg-gray-600 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition"
                >
                    Reset
                </button>
                
                <button type="submit" disabled={!formik.isValid ||!formik.dirty|| formik.isSubmitting} 
                className={`${
                    !formik.isValid || !formik.dirty || formik.isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
                } text-white font-semibold py-2 px-4 rounded transition`}>
                      
                {loading ? (
                    // console.log("loadingg"),
                    //    console.log(loading),
                    //    console.log("formik"),
                    //    console.log(formik.values),
                    //    console.log("ISVALID"),
                    //    console.log(formik.isValid),
                    //    console.log("issubmitting"),
                    //    console.log(formik.isSubmitting),
                <Circles
                    height="40"
                    width="40"
                    color="#4fa94d"
                    ariaLabel="circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
                
                ) : (
                    "Submit"
                )}
                </button>
            </form>
            </div>
        )}
        </div>
    )
}

export default UserForm