import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Formik, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import classNames from 'classnames';
import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';
import avatarImage from '../assets/signup.png';

const SignupPage = () => {
  const { logIn } = useAuth();
  const [signupFailed, setSignupFailed] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const notifyConnectionError = () => toast.error(t('errors.network'));
  const notifyUnknownError = () => toast.error(t('errors.unknown'));
  const btnClassNames = classNames('w-100', {
    disabled: !dataLoaded,
  });

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required('signup.required')
      .min(3, 'signup.usernameConstraints')
      .max(20, 'signup.usernameConstraints'),
    password: yup
      .string()
      .trim()
      .required('signup.required')
      .min(6, 'signup.passMin'),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('password'), null],
        'signup.mustMatch',
      ),
  });

  const onSubmit = async (values) => {
    setSignupFailed(false);
    setDataLoaded(false);
    try {
      const res = await axios
        .post(routes.signupPath(), { username: values.username, password: values.password });
      logIn(res.data);
      setDataLoaded(true);
      const { from } = location.state || { from: { pathname: routes.chatPagePath() } };
      navigate(from);
    } catch (err) {
      console.error(err);
      setDataLoaded(true);
      if (!err.isAxiosError) {
        notifyUnknownError();
        return;
      }
      if (err.response?.status === 409) {
        setSignupFailed(true);
      } else {
        notifyConnectionError();
      }
    }
  };

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  src={avatarImage}
                  className="rounded-circle"
                  alt={t('login.header')}
                  width="250px"
                  height="250px"
                />
              </div>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ errors, handleSubmit, touched }) => (
                  <Form
                    onSubmit={handleSubmit}
                    className="w-50"
                  >
                    <h1 className="text-center mb-4">{t('signup.header')}</h1>
                    <div className="form-floating mb-3">
                      <Field
                        id="username"
                        name="username"
                        autoComplete="username"
                        className={signupFailed || (errors.username && touched.username)
                          ? 'form-control is-invalid'
                          : 'form-control'}
                        placeholder={t('signup.usernameConstraints')}
                        autoFocus
                        disabled={!dataLoaded}
                      />
                      <label htmlFor="username">{t('signup.username')}</label>
                      <ErrorMessage name="username">
                        {(message) => <Form.Control.Feedback type="invalid" tooltip>{t(message)}</Form.Control.Feedback>}
                      </ErrorMessage>
                      {signupFailed && <Form.Control.Feedback type="invalid" tooltip />}
                    </div>
                    <div className="form-floating mb-3 position-relative">
                      <Field
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        className={signupFailed || (errors.password && touched.password)
                          ? 'form-control is-invalid'
                          : 'form-control'}
                        placeholder={t('signup.passMin')}
                        disabled={!dataLoaded}
                      />
                      <label htmlFor="password">{t('login.password')}</label>
                      <ErrorMessage name="password">
                        {(message) => <Form.Control.Feedback type="invalid" tooltip>{t(message)}</Form.Control.Feedback>}
                      </ErrorMessage>
                      {signupFailed && <Form.Control.Feedback type="invalid" tooltip />}
                    </div>
                    <div className="form-floating mb-4 position-relative">
                      <Field
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        placeholder={t('signup.mustMatch')}
                        className={
                          signupFailed || (errors.confirmPassword && touched.confirmPassword)
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        disabled={!dataLoaded}
                      />
                      <label htmlFor="confirmPassword">{t('signup.confirm')}</label>
                      <ErrorMessage name="confirmPassword">
                        {(message) => <Form.Control.Feedback type="invalid" tooltip>{t(message)}</Form.Control.Feedback>}
                      </ErrorMessage>
                      {signupFailed && <Form.Control.Feedback type="invalid" tooltip>{t('signup.alreadyExists')}</Form.Control.Feedback>}
                    </div>
                    <Button
                      type="submit"
                      variant="outline-primary"
                      className={btnClassNames}
                    >
                      {t('signup.submit')}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('signup.alreadyRegistered')}</span>
                {' '}
                <a href={routes.loginPagePath()}>{t('signup.login')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
