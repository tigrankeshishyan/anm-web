import React, { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Typography from '@material-ui/core/Typography';

import { withI18n } from 'localization/helpers';

import Button from 'components/Button';
import Loading from 'components/Loading';

import { withToastActions } from 'containers/ToastMessages';

import { isEmail } from 'helpers';

import {
  CREATE_SUBSCRIPTION_CONTACT,
} from '_graphql/actions';

import './styles.sass';

function SubscriptionForm(props) {
  const [email, setEmail] = useState('');
  const [addContact, { loading }] = useMutation(CREATE_SUBSCRIPTION_CONTACT);

  const {
    i18n,
    addToastMessage,
  } = props;

  const handleFormSubmit = useCallback(async event => {
    event && event.preventDefault();

    const response = await addContact({
      variables: {
        email,
      },
    });

    if (response && response.data.addContact) {
      setEmail('');
      addToastMessage.success(i18n('footer.subscribeSuccessText'));
    } else {
      addToastMessage.error(i18n('somethingWrong'));
    }
  }, [email]);

  const handleInputChange = useCallback(event => {
    setEmail(event.target.value);
  }, []);

  return (
    <Loading
      isLoading={loading}
      className="subscription-form-wrapper pad-15"
    >
      <form
        id="sib-form"
        method="POST"
        onSubmit={handleFormSubmit}
        className="subscription-form flex-column"
      >
        <Typography
          className="subscribe-text"
        >
          {i18n('footer.subscribeNews')}
        </Typography>
        <div className="input-wrapper">
          <input
            required
            type="email"
            value={email}
            name="anm-email"
            disabled={loading}
            placeholder={i18n('email')}
            onChange={handleInputChange}
            className="subscription-input"
          />

          <Button
            variant="secondary"
            className="subscription-button"
            disabled={!email.trim() || !isEmail(email) || loading}
          >
            {i18n('footer.subscribe')}
          </Button>
        </div>
      </form>
    </Loading>
  );
}

SubscriptionForm.defaultProps = {};

SubscriptionForm.propTypes = {};

export default withI18n(withToastActions(SubscriptionForm));
