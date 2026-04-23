import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import api from '../utils/api';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            username: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full Name is required'),
            username: Yup.string().required('Username is required').lowercase("Must be lowercase").trim(),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setErrorMsg("");
            try {
                await api.post('/auth/register', values);
                navigate('/login');
            } catch (error) {
                setErrorMsg(error.response?.data?.message || "Registration failed");
            } finally {
                setLoading(false);
            }
        }
    });

    const getError = (field) => {
        return formik.touched[field] && formik.errors[field] ? (
            <div className="font-semibold text-red-600 mt-1">{formik.errors[field]}</div>
        ) : null;
    };

    const togglePasswordVisible = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-5 w-full max-w-md rounded-lg bg-white p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-center">
                    <i className="pi pi-box text-darkBlue text-5xl"></i>
                </div>
                <div className="my-2 text-center text-3xl font-bold text-darkBlue">BrandPortal</div>
                
                {errorMsg && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded text-center font-semibold">{errorMsg}</div>}
                
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-1">
                            Full Name
                        </label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-id-card" />
                            <InputText
                                id="fullName"
                                name="fullName"
                                type="text"
                                className="w-full rounded-md"
                                value={formik.values.fullName}
                                placeholder="Enter your full name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={getError('fullName') != null}
                            />
                        </IconField>
                        {getError('fullName')}
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
                            Username
                        </label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-user" />
                            <InputText
                                id="username"
                                name="username"
                                type="text"
                                className="w-full rounded-md"
                                value={formik.values.username}
                                placeholder="Enter your username"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={getError('username') != null}
                            />
                        </IconField>
                        {getError('username')}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                            Email Address
                        </label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-envelope" />
                            <InputText
                                id="email"
                                name="email"
                                type="text"
                                className="w-full rounded-md"
                                value={formik.values.email}
                                placeholder="Enter your email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={getError('email') != null}
                            />
                        </IconField>
                        {getError('email')}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <IconField iconPosition="left">
                            <InputIcon
                                className={`${isPasswordVisible ? 'pi pi-eye-slash' : 'pi pi-eye'} cursor-pointer`}
                                onClick={togglePasswordVisible}
                            />
                            <InputText
                                id="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                name="password"
                                className="w-full rounded-md"
                                value={formik.values.password}
                                placeholder="Create a password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={getError('password') != null}
                            />
                        </IconField>
                        {getError('password')}
                    </div>

                    <Button
                        type="submit"
                        className="hover:border-1 w-full rounded-md bg-darkBlue px-4 py-2 text-white hover:border-darkBlue hover:bg-white hover:text-darkBlue focus:border-blue-300 focus:outline-none focus:ring mt-4 transition-colors"
                        loading={loading}
                        label="Register"
                        raised
                    />
                </form>

                <div className="mt-4 text-center font-semibold text-darkBlue">
                    <Link to="/login" className="hover:underline">Already have an account? Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
