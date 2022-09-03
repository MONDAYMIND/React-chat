import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useSocket } from '../../hooks/index.js';
import { getChannels } from '../../slices/channelsSlice.js';
import { getCurrentModalType, actions as userInterfaceActions } from '../../slices/userInterfaceSlice.js';

const AddNewChannelModal = () => {
  const { t } = useTranslation();
  const { addNewChannel } = useSocket();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const [validationErrorKey, setValidationErrorKey] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const isModalShown = !!useSelector(getCurrentModalType);
  const allChannels = useSelector(getChannels);
  const allChannelsNames = allChannels.map((channel) => channel.name);
  const currentLanguage = i18next.logger.options.lng;
  const obsceneWords = filter.getDictionary(currentLanguage);
  const notifyChannelAdd = () => toast.success(t('modals.channelAdded'));

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required('modals.channelNameValidation.required')
      .min(3, 'modals.channelNameValidation.channelNameConstraints')
      .max(20, 'modals.channelNameValidation.channelNameConstraints')
      .notOneOf(allChannelsNames, 'modals.channelNameValidation.uniqueName')
      .notOneOf(obsceneWords, 'modals.channelNameValidation.obsceneWord'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      setDisabled(true);
      try {
        await validationSchema.validate(values);
        setValidationErrorKey(null);
        addNewChannel(values);
        formik.resetForm();
        dispatch(userInterfaceActions.hideModal());
        notifyChannelAdd();
      } catch (err) {
        setValidationErrorKey(err.message);
        setDisabled(false);
      }
    },
  });

  return (
    <Modal
      show={isModalShown}
      onHide={() => dispatch(userInterfaceActions.hideModal())}
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
              isInvalid={!!validationErrorKey}
              ref={inputRef}
              className="mb-2"
              disabled={disabled}
            />
            <Form.Label htmlFor="name" className="visually-hidden">{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">{t(validationErrorKey)}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => dispatch(userInterfaceActions.hideModal())}
            >
              {t('modals.canceling')}
            </Button>
            <Button type="submit" variant="primary" disabled={disabled}>{t('modals.sendChannel')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewChannelModal;
