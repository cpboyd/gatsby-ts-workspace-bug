const fs = require(`fs`);
const path = require(`path`);
const mkdirp = require(`mkdirp`);
const crypto = require(`crypto`);
const Debug = require(`debug`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const { urlResolve } = require(`gatsby-core-utils`);

const debug = Debug(`gatsby-theme-youtube`);
const withDefaults = require(`./utils/default-options`);

// Ensure that content directories exist at site-level
exports.onPreBootstrap = ({ store }, themeOptions) => {
  const { program } = store.getState();
  const { contentPath, assetPath } = withDefaults(themeOptions);

  const dirs = [
    path.join(program.directory, contentPath),
    path.join(program.directory, assetPath),
  ];

  dirs.forEach(dir => {
    debug(`Initializing ${dir} directory`);
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);
    }
  });
};

const mdxResolverPassthrough = fieldName => async (
  source,
  args,
  context,
  info
) => {
  const type = info.schema.getType(`Mdx`);
  const mdxNode = context.nodeModel.getNodeById({
    id: source.parent,
  });
  const resolver = type.getFields()[fieldName].resolve;
  const result = await resolver(mdxNode, args, context, {
    fieldName,
  });
  return result;
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  createTypes(`interface YoutubePost @nodeInterface {
      id: ID!
      youtubeId: String!
      title: String!
      body: String!
      slug: String!
      date: Date! @dateformat
      excerpt: String!
  }`);

  createTypes(
    schema.buildObjectType({
      name: `MdxYoutubePost`,
      fields: {
        id: { type: `ID!` },
        youtubeId: { type: `String!` },
        title: { type: `String!` },
        slug: { type: `String!` },
        date: { type: `Date!`, extensions: { dateformat: {} } },
        excerpt: {
          type: `String!`,
          args: {
            pruneLength: {
              type: `Int`,
              defaultValue: 140,
            },
          },
          resolve: mdxResolverPassthrough(`excerpt`),
        },
        body: {
          type: `String!`,
          resolve: mdxResolverPassthrough(`body`),
        },
      },
      interfaces: [`Node`, `YoutubePost`],
    })
  );
};

// Create fields for post slugs and source
// This will change with schema customization with work
exports.onCreateNode = async (
  { node, actions, getNode, createNodeId },
  themeOptions
) => {
  const { createNode, createParentChildLink } = actions;
  const { contentPath, basePath } = withDefaults(themeOptions);

  // console.log('onCreateNode', node);

  // Make sure it's an MDX node
  if (node.internal.type !== `Mdx`) {
    return;
  }

  // Create source field (according to contentPath)
  const fileNode = getNode(node.parent);
  const source = fileNode.sourceInstanceName;

  if (node.internal.type === `Mdx` && source === contentPath) {
    let slug;
    if (node.frontmatter.slug) {
      if (path.isAbsolute(node.frontmatter.slug)) {
        // absolute paths take precedence
        slug = node.frontmatter.slug;
      } else {
        // otherwise a relative slug gets turned into a sub path
        slug = urlResolve(basePath, node.frontmatter.slug);
      }
    } else {
      // otherwise use the filepath function from gatsby-source-filesystem
      const filePath = createFilePath({
        node: fileNode,
        getNode,
        basePath: contentPath,
      });

      slug = urlResolve(basePath, filePath);
    }
    // normalize use of trailing slash
    slug = slug.replace(/\/*$/, `/`);
    const fieldData = {
      youtubeId: node.frontmatter.id,
      title: node.frontmatter.title,
      slug,
      date: node.frontmatter.date,
    };

    const mdxYoutubePostId = createNodeId(`${node.id} >>> MdxYoutubePost`);
    await createNode({
      ...fieldData,
      // Required fields.
      id: mdxYoutubePostId,
      parent: node.id,
      children: [],
      internal: {
        type: `MdxYoutubePost`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(fieldData))
          .digest(`hex`),
        content: JSON.stringify(fieldData),
        description: `Mdx implementation of the YoutubePost interface`,
      },
    });
    createParentChildLink({ parent: node, child: getNode(mdxYoutubePostId) });
  }
};

// These templates are simply data-fetching wrappers that import components
const PostTemplate = require.resolve(`./src/templates/youtube-query.tsx`);

exports.createPages = async ({ graphql, actions, reporter }, themeOptions) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      all: allYoutubePost(
        sort: { fields: [date, title], order: DESC }
        limit: 2000
      ) {
        nodes {
          id
          slug
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic(result.errors);
  }

  // Create Posts and Post pages.
  const {
    all: { nodes: posts },
  } = result.data;

  // Create a page for each Post
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1];
    const next = index === 0 ? null : posts[index - 1];
    const { id, slug } = post;
    createPage({
      path: slug,
      component: PostTemplate,
      context: {
        id,
        previousId: previous ? previous.id : undefined,
        nextId: next ? next.id : undefined,
      },
    });
  });
};
