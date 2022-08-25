import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useSocket } from '../../hooks/index.js';
import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';

const AddNewChannelModal = ({ onHide }) => {
  const { t } = useTranslation();
  const { addNewChannel } = useSocket();
  const inputRef = useRef();
  const [validationError, setValidationError] = useState(null);
  const [buttonDisabled, setbuttonDisabled] = useState(false);
  const allChannels = useSelector(channelsSelectors.selectAll);
  const allChannelsNames = allChannels.map((channel) => channel.name);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t('modals.channelNameValidation.required'))
      .min(3, t('modals.channelNameValidation.channelNameConstraints'))
      .max(20, t('modals.channelNameValidation.channelNameConstraints'))
      .notOneOf(allChannelsNames, t('modals.channelNameValidation.uniqueName')),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      setbuttonDisabled(true);
      try {
        await validationSchema.validate(values);
        setValidationError(null);
        addNewChannel(values);
        formik.resetForm();
        onHide();
      } catch (err) {
        console.log(err);
        setValidationError(err.message);
        setbuttonDisabled(false);
      }
    },
  });

  return (
    <Modal
      show
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {t('modals.addChannel')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              onChange={formik.handleChange}
              value={formik.values.name}
              name="name"
              id="name"
              isInvalid={!!validationError}
              ref={inputRef}
              className="mb-2"
              disabled={buttonDisabled}
            />
            <Form.Label htmlFor="name" className="visually-hidden">{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={onHide}>{t('modals.canceling')}</Button>
            <Button type="submit" variant="primary" disabled={buttonDisabled}>{t('modals.sendChannel')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewChannelModal;
