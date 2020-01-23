import React from 'react';
import {
  FETCH_DOCUMENT,
} from '_graphql/actions';
import Typography from '@material-ui/core/Typography';
import { useQuery } from '@apollo/react-hooks';

import { withI18n } from 'localization/helpers';

import Loading from 'components/Loading';
import SEO from 'components/SEO';

import './styles.sass';

function Terms(props) {
  // documents are an array of all documents
  // we will filter and get only terms document
  // the response will be documentList array and the first item is the term's data
  const { data: { documents = [] } = {}, loading } = useQuery(FETCH_DOCUMENT, {
    variables: {
      name: 'terms',
    },
  });

  const {
    i18n,
  } = props;

  const termData = documents[0] || {};

  return (
    <Loading isLoading={loading}>
      <SEO
        titleTranslationId="termsAndPrivacyPolicy"
      />

      <Typography
        variant="h5"
        color="primary"
        className="mrg-15 text-center"
      >
        {i18n('termsAndPrivacyPolicy')}
      </Typography>
      <div
        className="pad-20 keep-words terms-section-wrapper"
        dangerouslySetInnerHTML={{ __html: termData.content }}
      />
    </Loading>
  );
}

Terms.defaultProps = {};

Terms.propTypes = {};

export default withI18n(Terms);
