import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import api from '../utils/api';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const formik = useFormik({
        initialValues: {
            identifier: '', // email or username
            password: ''
        },
        validationSchema: Yup.object({
            identifier: Yup.string().required('Email or Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setErrorMsg("");
            try {
                const isEmail = values.identifier.includes('@');
                const payload = { password: values.password };
                if (isEmail) {
                    payload.email = values.identifier;
                } else {
                    payload.username = values.identifier;
                }

                const response = await api.post('/auth/login', payload);
                const { accessToken, refreshToken, user } = response.data.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                dispatch(loginSuccess({ user }));
                navigate('/dashboard');
            } catch (error) {
                setErrorMsg(error.response?.data?.message || "Login failed");
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
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="mx-5 w-full max-w-md rounded-lg bg-white p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-center">
                    <i className="pi pi-box text-darkBlue text-5xl"></i>
                </div>
                <div className="my-2 text-center text-3xl font-bold text-darkBlue">PropIntel</div>
                
                {errorMsg && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded text-center font-semibold">{errorMsg}</div>}
                
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="identifier" className="block text-sm font-medium text-gray-600 mb-1">
                            Email or Username
                        </label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-user" />
                            <InputText
                                id="identifier"
                                name="identifier"
                                type="text"
                                className="w-full rounded-md"
                                value={formik.values.identifier}
                                placeholder="Enter your email or username"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={getError('identifier') != null}
                            />
                        </IconField>
                        {getError('identifier')}
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
                                placeholder="Enter your password"
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
                        label="Login"
                        raised
                    />
                </form>

                <div className="mt-4 text-center font-semibold text-darkBlue">
                    <Link to="/register" className="hover:underline">Don't have an account? Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
