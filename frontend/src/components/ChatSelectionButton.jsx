import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dropdown, Button, ButtonGroup,
} from 'react-bootstrap';

const ChatSelectionButton = ({
  channel, switchChannel, setCurrentModalEvent, setModalShow,
}) => {
  const { id, name, removable } = channel;
  const { t } = useTranslation();
  const { currentChannelId } = useSelector((state) => state.userInterface);
  const variant = id === currentChannelId ? 'secondary' : 'none';

  return removable ? (
    <Dropdown
      as={ButtonGroup}
      className="d-flex"
    >
      <Button
        variant={variant}
        className="w-100 rounded-0 border-0 text-start text-truncate"
        onClick={switchChannel}
        id={id}
        data-toggle="tooltip"
        title={name}
      >
        <span className="me-1">#</span>
        {name}
      </Button>
      <Dropdown.Toggle split variant={variant} id="dropdown-split-basic" className="flex-grow-0 border-0">
        <span className="visually-hidden">{t('chat.manageChannel')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          eventKey="remove"
          onClick={() => {
            setCurrentModalEvent({ event: 'remove', channel });
            setModalShow(true);
          }}>
          {t('chat.removeChannel')}
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="rename"
          onClick={() => {
            setCurrentModalEvent({ event: 'rename', channel });
            setModalShow(true);
          }}>
          {t('chat.renameChannel')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <Button
      id={id}
      className="w-100 text-start border-0"
      variant={variant}
      onClick={switchChannel}
      data-toggle="tooltip"
      title={name}
    >
      <span className="me-1">#</span>{name}
    </Button>
  );
};

export default ChatSelectionButton;
