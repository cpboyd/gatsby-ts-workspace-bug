const withDefaults = require(`./utils/default-options`);

module.exports = themeOptions => {
  const options = withDefaults(themeOptions);
  const { mdx = true } = themeOptions;
  const contentName = options.contentPath || `content/posts`;

  return {
    plugins: [
      mdx && {
        resolve: `gatsby-plugin-mdx`,
        options: {
          extensions: [`.mdx`, `.md`],
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          path: contentName,
          name: contentName,
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          path: options.assetPath || `content/assets`,
          name: options.assetPath || `content/assets`,
        },
      },
      `gatsby-transformer-sharp`,
      `gatsby-plugin-sharp`,
      // Add typescript stack into webpack
      `gatsby-plugin-typescript`,
      {
        resolve: `gatsby-plugin-layout`,
        options: {
          component: require.resolve(
            `${__dirname}/src/components/layout/index.tsx`
          ),
        },
      },
    ].filter(Boolean),
  };
};
