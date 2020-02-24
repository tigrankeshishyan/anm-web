import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';

import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import {
  TextField,
} from 'components/Form';
import Icon from 'components/Icon';
import Button from 'components/Button';
import Loading from 'components/Loading';
import DropZone from 'components/DropZone';

import { withI18n } from 'localization/helpers';

import { withToastActions } from 'containers/ToastMessages';

import {
  REQUEST_MESSAGE,
} from '_graphql/actions';

import { generateDateKeyString } from 'helpers/date';

import './styles.sass';

const FormRow = ({ labelFor, value, onChange, name, inputProps, i18n }) => (
  <TextField
    {...inputProps}
    fullWidth
    name={name}
    id={labelFor}
    margin="normal"
    onChange={onChange}
    value={value || ''}
    label={i18n(labelFor)}
  />
);

const emptyForm = {};

function ContactForm(props) {
  const [formKey, setFormKey] = useState(generateDateKeyString());
  const [formData, setFormData] = useState(emptyForm);
  const [requestMessage, { loading }] = useMutation(REQUEST_MESSAGE);
  const {
    i18n,
    title,
    fields,
    subTitle,
    validateForm,
    canSubmitForm,
    addToastMessage,
    submitButtonText,
    transformDataBeforeSend,
  } = props;
  
  const handleFormChange = useCallback(data => {
      setFormData({ ...formData, ...data });
    },
    [setFormData, formData],
  );
  
  const showError = useCallback(() => {
    addToastMessage.error(i18n('somethingWrong'));
  }, [addToastMessage, i18n]);
  
  const handleFormSubmit = useCallback(async () => {
    if (canSubmitForm(formData)) {
      try {
        const res = await requestMessage({
          variables: transformDataBeforeSend(formData),
        });
        
        if (res && res.data) {
          setFormData({ ...emptyForm });
          setFormKey(generateDateKeyString());
          addToastMessage.success(i18n('contactUs.sent'));
        } else {
          showError();
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        showError();
      }
    }
  }, [
    i18n,
    formData,
    showError,
    setFormKey,
    canSubmitForm,
    requestMessage,
    addToastMessage,
    transformDataBeforeSend,
  ]);
  
  return (
    <Loading
      key={formKey}
      isLoading={loading}
    >
      <div className="contact-us-from-section">
        <div className="contact-us-form-wrapper pad-20">
          <Typography variant="h5">
            {title}
          </Typography>
          {subTitle && (
            <Typography variant="h6" color="textSecondary">
              {subTitle}
            </Typography>
          )}
          
          {fields.map(field => (
            <FormRow
              {...field}
              i18n={i18n}
              key={field.name}
              onChange={handleFormChange}
              value={formData[field.name]}
            />
          ))}
          
          <DropZone
            className="remove-outline"
            onFileUpload={file => handleFormChange({ file })}
          >
            <div className="flex-row no-grow align-center pad-top-15 pad-bottom-15 pointer attach-file-row">
              <AttachFileIcon
                className="attach-file-icon"
              />
              
              <b>
                {
                  formData.file
                    ? (
                      <div className="flex-row no-grow align-center">
                        {formData.file.name}
                        <Icon
                          hoverColor="red"
                          onClick={event => {
                            event.stopPropagation();
                            handleFormChange({ file: null });
                          }}
                          className="mrg-sides-10"
                        >
                          <CloseIcon/>
                        </Icon>
                      </div>
                    )
                    : (
                      <span className="mrg-sides-15">
                        {i18n('attachFile')}
                      </span>
                    )
                }
              </b>
            </div>
          </DropZone>
        </div>
        
        <div className="flex-row justify-end align-center wrap">
          <Button
            variant="ghost-blue"
            className="mrg-top-15"
            onClick={handleFormSubmit}
            disabled={loading || !validateForm(formData)}
          >
            {submitButtonText}
          </Button>
        </div>
      </div>
    </Loading>
  );
}

ContactForm.defaultProps = {
  fields: [],
  validateForm: () => true,
  canSubmitForm: () => true,
  transformDataBeforeSend: d => d,
};

ContactForm.propTypes = {
  subTitle: PropTypes.string,
  validateForm: PropTypes.func,
  canSubmitForm: PropTypes.func,
  title: PropTypes.string.isRequired,
  transformDataBeforeSend: PropTypes.func,
  submitButtonText: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({})),
};

export default withI18n(withToastActions(ContactForm));
