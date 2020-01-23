import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';

import Typography from '@material-ui/core/Typography';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import {
  TextField,
} from 'components/Form';

import Button from 'components/Button';
import Loading from 'components/Loading';
import DropZone from 'components/DropZone';
import ReCaptcha from 'components/ReCaptcha';

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
  const [isRecaptchaConfirmed, setReCaptchaStatus] = useState(false);
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
    if (isRecaptchaConfirmed && canSubmitForm(formData)) {
      try {
        const res = await requestMessage({
          variables: transformDataBeforeSend(formData),
        });

        if (res && res.data && res.data.createContactMessage) {
          setFormData({ ...emptyForm });
          setFormKey(generateDateKeyString());
          setReCaptchaStatus(false);
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
    setReCaptchaStatus,
    isRecaptchaConfirmed,
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
            <Typography variant="h6">
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
            onFileUpload={file => handleFormChange({ target: { name: 'file', value: file } })}
          >
            <div className="flex-row align-center pad-top-15 pad-bottom-15 pointer attach-file-row">
              <AttachFileIcon
                className="attach-file-icon"
              />

              <b>
                {
                  formData.file
                    ? formData.file.name
                    :(
                      <span className="mrg-sides-15">
                        {i18n('attachFile')}
                      </span>
                    )
                }
              </b>
            </div>
          </DropZone>
        </div>

        <div className="flex-row justify-between wrap">
          <ReCaptcha
            className="mrg-top-15"
            onChange={res => setReCaptchaStatus(!!res)}
          />

          <Button
            variant="ghost-blue"
            className="mrg-top-15"
            onClick={handleFormSubmit}
            disabled={loading || !isRecaptchaConfirmed || !validateForm(formData)}
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
