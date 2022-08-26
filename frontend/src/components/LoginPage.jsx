import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';
import avatarImage from '../assets/avatar.jpg';

const LoginPage = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required(t('login.required')),
    password: yup
      .string()
      .trim()
      .required(t('login.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const res = await axios.post(routes.loginPath(), values);
        console.log(res.data);
        auth.logIn(res.data);
        const { from } = location.state || { from: { pathname: routes.chatPagePath() } };
        navigate(from);
      } catch (err) {
        console.error(err);
        if (!err.isAxiosError) {
          // toast.error(t('errors.unknown'));
          return;
        }

        if (err.response?.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
        } else {
          // toast.error(t('errors.network'));
        }
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={avatarImage}
                  className="rounded-circle"
                  alt={t('login.header')}
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('login.header')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    name="username"
                    id="username"
                    autoComplete="username"
                    isInvalid={authFailed}
                    required
                    ref={inputRef}
                    placeholder={t('login.username')}
                  />
                  <Form.Label htmlFor="username">{t('login.username')}</Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    isInvalid={authFailed}
                    required
                    placeholder={t('login.password')}
                  />
                  <Form.Label htmlFor="password">{t('login.password')}</Form.Label>
                  {authFailed && <Form.Control.Feedback type="invalid" tooltip>{t('login.authFailed')}</Form.Control.Feedback>}
                </Form.Group>
                <Button type="submit" variant="outline-primary" className="w-100 mb-3">{t('login.submit')}</Button>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('login.newToChat')}</span>
                {' '}
                <a href={routes.signupPagePath()}>{t('login.signup')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
