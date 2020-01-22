import { graphql } from 'gatsby';

export const allImageFilesMax1900 = graphql`
  fragment allImageFilesMax1900 on  FileConnection {
    nodes {
      id
      childImageSharp {
        fluid(maxWidth: 1900, quality: 90, traceSVG: { optTolerance: 1.5 }) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;

export const allImageFilesMax400 = graphql`
  fragment allImageFilesMax400 on  FileConnection {
    nodes {
      id
      name
      childImageSharp {
        fluid(maxWidth: 400, quality: 90, traceSVG: { optTolerance: 1.5 }) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;

export const allImageFilesMax600 = graphql`
  fragment allImageFilesMax600 on  FileConnection {
    nodes {
      id
      name
      childImageSharp {
        fluid(maxWidth: 600, quality: 90, traceSVG: { optTolerance: 1.5 }) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
