import { graphql } from 'gatsby';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mdxFragments from '../../utils/graphql';
import PostPage from '../components/video';

export default PostPage;

export const query = graphql`
  query PostPageQuery(
    $id: String!
    $previousId: String
    $nextId: String
  ) {
    post: youtubePost(id: { eq: $id }) {
      ...YtFull
    }
    all: allYoutubePost(
      sort: { fields: date, order: DESC }
    ) {
      nodes {
        ...YtBase
      }
    }
    previous: youtubePost(id: { eq: $previousId }) {
      ...YtBase
    }
    next: youtubePost(id: { eq: $nextId }) {
      ...YtBase
    }
  }
`;
