import { graphql } from 'gatsby';

export const mdxYtBase = graphql`
  fragment YtBase on MdxYoutubePost {
    id
    excerpt
    slug
    title
    date(formatString: "MMMM DD, YYYY")
  }
`;

export const mdxYtFull = graphql`
  fragment YtFull on MdxYoutubePost {
    ...YtBase
    youtubeId
    body
  }
`;
