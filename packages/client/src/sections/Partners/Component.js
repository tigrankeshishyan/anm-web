import React from 'react';

import SectionTitle from 'components/SectionTitle';
import Img from 'components/Img';

import { withI18n } from 'localization/helpers';

import AgbuLogo from 'images/partners/agbu.png';
import AvetisAssociationLogo from 'images/partners/avetisAssociation.png';
import KomitasInstituteLogo from 'images/partners/komitasInstitute.png';
import ConservatoryLogo from 'images/partners/conservatory.png';
import AnpoLogo from 'images/partners/anpo.png';
import HoverChoirLogo from 'images/partners/hoverChoir.png';
import QuartertoneLogo from 'images/partners/quartertone.png';
import AssonanceLogo from 'images/partners/assonance.jpg';
import YerevanStringQuartetLogo from 'images/partners/yerevanStringQuartet.png';
import KhachatryanHomeMuseumLogo from 'images/partners/khachatryanHomeMuseum.png';

import './styles.sass';

// logoName is the partner logo file name without extension
const logos = [
  {
    logo: AgbuLogo,
    website: 'https://agbu.org',
    title: 'AGBU',
  },
  {
    logo: AvetisAssociationLogo,
    website: ' http://www.avetis.ch',
    title: 'Avetis Association',
  },
  {
    logo: KomitasInstituteLogo,
    website: 'https://www.gomidas.org',
    title: 'Komitas Museum-Institute',
  },
  {
    logo: ConservatoryLogo,
    website: 'http://www.khachaturian.am/eng/museum.htm',
    title: 'Aram Khachatryan Home Museum',
  },
  {
    logo: KhachatryanHomeMuseumLogo,
    website: 'https://conservatory.am',
    title: 'Yerevan Komitas State Conservatory',
  },
  {
    logo: AnpoLogo,
    website: 'https://apo.am',
    title: 'Armenian National Philharmonic Orchestra',
  },
  {
    logo: HoverChoirLogo,
    website: 'http://hoverchoir.org',
    title: 'Hover Choir',
  },
  {
    logo: QuartertoneLogo,
    website: 'https://www.quartertone.org',
    title: 'Quarter Tone',
  },
  {
    logo: AssonanceLogo,
    website: 'https://www.facebook.com/ensembleassonance',
    title: 'Assonance Ensemble',
  },
  {
    logo: YerevanStringQuartetLogo,
    website: 'https://www.facebook.com/Yerevanquartet/',
    title: '"Yerevan" String Quartet',
  },
];

function HomePartnersSection(props) {
  const { i18n } = props;

  return (
    <div className="partners-section-wrapper">
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
              alt={logo.title}
              src={logo.logo}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export default withI18n(HomePartnersSection);
