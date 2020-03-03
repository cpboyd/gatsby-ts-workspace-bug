import React from 'react';

import { NavigatorType, getNavigatorTitle } from './nav';

interface LayoutProps {
  children: React.ReactNode[] | React.ReactNode;
  pageContext: { frontmatter?: any; tag?: string };
  data?: { post?: { slug: string }; all?: { nodes: any[] } };
  location: any;
  path: string;
  uri: string; // no trailing slash
}

function Layout(props: LayoutProps): JSX.Element {
  const {
    path,
    children,
  } = props;

  const isIndex = path === '/';

  const title = getNavigatorTitle('drag-brunch' as NavigatorType);

  return (
    <div>
      <h2>{title}</h2>

      {isIndex ? children : <article>{children}</article>}
    </div>
  );
}

export default Layout;
