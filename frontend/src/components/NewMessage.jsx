import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { useSocket, useAuth } from '../hooks/index.js';

const NewMessage = ({ channelId }) => {
  const inputRef = useRef();
  const { t } = useTranslation();
  const { user: { username } } = useAuth();
  const { addNewMessage } = useSocket();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    onSubmit: (values) => {
      formik.resetForm();
      addNewMessage({
        text: values.text,
        channelId,
        author: username,
        data: new Date(),
      });
    },
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
        <Form.Group className="input-group">
          <Form.Control
            onChange={formik.handleChange}
            aria-label={t('chat.newMessage')}
            value={formik.values.text}
            name="text"
            id="text"
            ref={inputRef}
            placeholder={t('chat.textMessage')}
            className="border-0 p-0 ps-2"
          />
          <Button type="submit" variant="none" disabled={!formik.values.text} className="btn-group-vertical border-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
            </svg>
            <span className="visually-hidden">{t('chat.sendMessage')}</span>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default NewMessage;
