import React from 'react';

import { MDXRenderer } from 'gatsby-plugin-mdx';
import { useFacebookParse } from '../../hooks';

export interface PageProps {
  children?: React.ReactNode[] | React.ReactNode;
  path: string;
  data: { post: any; all: { nodes: any[] } };
}

function Page(props: PageProps): JSX.Element {
  const { data } = props;
  const { post } = data || {};
  const { body, title, youtubeId } = post || {};

  const elementRef = useFacebookParse('');

  return (
    <article>
      <iframe
        title={title}
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <MDXRenderer>{body}</MDXRenderer>
      <div ref={elementRef} />
    </article>
  );
}

export default React.memo(Page);
