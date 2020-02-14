import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
import ContactUsForm from 'sections/ContactUsForm';

import { withToastActions } from 'containers/ToastMessages';

import { withI18n } from 'localization/helpers';
import withUser from 'hoc/withUser';

// import './styles.sass';

const fields = [
  {
    labelFor: 'contactUs.message',
    name: 'message',
    inputProps: {
      required: true,
      multiline: true,
      rows: 5,
    },
  },
];

function ScoresContactForm(props) {
  const {
    i18n,
    user,
    userShouldBeLoggedIn,
  } = props;
  
  const validateForm = useCallback(data => {
    return !!data.message && !!data.message.trim();
  }, []);
  
  const handleDataTransform = useCallback(data => {
    return {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      message: `REQUEST_SCORE - ${data.message}`,
    };
  }, [user]);
  
  return (
    <div>
      <ContactUsForm
        fields={fields}
        validateForm={validateForm}
        canSubmitForm={userShouldBeLoggedIn}
        title={i18n('scores.orderFormTitle')}
        submitButtonText={i18n('sendButtonText')}
        subTitle={i18n('scores.orderFormSubTitle')}
        transformDataBeforeSend={handleDataTransform}
      />
    </div>
  );
}

ScoresContactForm.defaultProps = {};

ScoresContactForm.propTypes = {};

export default withUser(
  withI18n(
    withToastActions(
      ScoresContactForm
    )
  )
);
