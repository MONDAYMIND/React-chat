import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useSocket } from '../../hooks/index.js';
import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';

const RenameChannelModal = ({ onHide, currentChannel }) => {
  const { t } = useTranslation();
  const { renameChannel } = useSocket();
  const inputRef = useRef();
  const [validationError, setValidationError] = useState(null);
  const [disabled, setDisabled] = useState(false);
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
      name: currentChannel.name,
    },
    onSubmit: async (values) => {
      setDisabled(true);
      try {
        await validationSchema.validate(values);
        setValidationError(null);
        renameChannel({ ...currentChannel, name: values.name });
        formik.resetForm();
        onHide();
      } catch (err) {
        setValidationError(err.message);
        setDisabled(false);
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
          {t('modals.renameChannel')}
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
              disabled={disabled}
            />
            <Form.Label htmlFor="name" className="visually-hidden">{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={onHide}>{t('modals.canceling')}</Button>
            <Button type="submit" variant="primary" disabled={disabled}>{t('modals.sendChannel')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;
