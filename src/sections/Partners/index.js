import React from 'react';

import SectionTitle from 'components/SectionTitle';
import Img from 'components/Img';

import { withI18n } from 'localization/helpers';

import AgbuLogo from 'static/images/partners/agbu.png';
import AvetisAssociationLogo from 'static/images/partners/avetisAssociation.png';
import KomitasInstituteLogo from 'static/images/partners/komitasInstitute.png';
import ConservatoryLogo from 'static/images/partners/conservatory.png';
import AnpoLogo from 'static/images/partners/anpo.png';
import HoverChoirLogo from 'static/images/partners/hoverChoir.png';
import QuartertoneLogo from 'static/images/partners/quartertone.png';
import AssonanceLogo from 'static/images/partners/assonance.jpg';
import YerevanStringQuartetLogo from 'static/images/partners/yerevanStringQuartet.png';

import './styles.sass';

// logoName is the partner logo file name without extension
const logos = [
  {
    logo: AgbuLogo,
    logoName: 'agbu',
    website: 'https://agbu.org',
    title: 'AGBU',
  },
  {
    logo: AvetisAssociationLogo,
    logoName: 'avetisAssociation',
    website: ' http://www.avetis.ch',
    title: 'Avetis Association',
  },
  {
    logo: KomitasInstituteLogo,
    logoName: 'komitasInstitute',
    website: 'https://www.gomidas.org',
    title: 'Komitas Museum-Institute',
  },
  {
    logo: ConservatoryLogo,
    logoName: 'conservatory',
    website: 'https://conservatory.am',
    title: 'Yerevan Komitas State Conservatory',
  },
  {
    logo: AnpoLogo,
    logoName: 'anpo',
    website: 'https://apo.am',
    title: 'Armenian National Philharmonic Orchestra',
  },
  {
    logo: HoverChoirLogo,
    logoName: 'hoverChoir',
    website: 'http://hoverchoir.org',
    title: 'Hover Choir',
  },
  {
    logo: QuartertoneLogo,
    logoName: 'quartertone',
    website: 'https://www.quartertone.org',
    title: 'Quarter Tone',
  },
  {
    logo: AssonanceLogo,
    logoName: 'assonance',
    website: 'https://www.facebook.com/ensembleassonance',
    title: 'Assonance Ensemble',
  },
  {
    logo: YerevanStringQuartetLogo,
    logoName: 'yerevanStringQuartet',
    website: 'https://www.facebook.com/Yerevanquartet/',
    title: '"Yerevan" String Quartet',
  },
];

function HomePartnersSection(props) {
  const { i18n } = props;

  return (
    <div className="home-partners-section-wrapper">
      <SectionTitle
        type="normal"
        position="right"
        blockWidth="70%"
        title={i18n('ourPartners')}
      />

      <div className="flex-row wrap justify-center pad-20 partners-logo-wrapper">
        {logos.map(logo => (
          <a
            target="_blank"
            key={logo.website}
            href={logo.website}
            title={logo.title}
            rel="noopener noreferrer"
            className="partner-logo"
          >
            <Img
              src={logo.logo}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

HomePartnersSection.defaultProps = {};

HomePartnersSection.propTypes = {};

export default withI18n(HomePartnersSection);
