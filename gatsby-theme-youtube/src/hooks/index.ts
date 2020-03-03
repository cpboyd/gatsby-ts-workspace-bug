import { useCallback } from 'react';

type CallbackFn = (node: any) => void;
export const useFacebookParse = (appId: string): CallbackFn => {
  return useCallback(node => {
    if (node !== null) {
      window.fbAsyncInit = function(): void {
        if (!FB) {
          return;
        }
        FB.init({
          appId,
          autoLogAppEvents: true,
          // cookie: true, // enable cookies to allow the server to access the session
          xfbml: true, // parse social plugins on this page
          version: `v3.2`,
        });

        FB.XFBML.parse(node);
      }.bind(this);

      // Load the SDK asynchronously
      (function(d, s, id): void {
        if (d.getElementById(id)) {
          // TODO: Determine why using element doesn't work:
          // console.log('fb-sdk', node);
          FB && FB.XFBML.parse(node.parentNode);
          return;
        }
        const js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.async = true;
        js.defer = true;
        js.crossOrigin = `anonymous`;
        js.src = `https://connect.facebook.net/en_US/sdk.js`;

        const fjs = d.getElementsByTagName(s)[0];
        fjs.parentNode.insertBefore(js, fjs);
      })(document, `script`, `facebook-jssdk`);
    }
  }, []);
};
