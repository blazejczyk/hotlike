/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import Article, { Importance } from '../components/Article';
import Paragraph from '../components/Paragraph';
import useTitle from '../hooks/useTitle';

function Partnership() {
  useTitle('Partnership');

  return (
    <Article title="Would you like to be our business partner?" contentCss={styles}>
      <Paragraph>
        If you represent a company or a place helping to meet people together (e.g.: coffee shop, restaurant, club, pub or
        actually any kind of entertainment), <Importance>HotLike</Importance> may be an interesting option for you to
        gain some new clients very spontaneously.
        <div className="partnership-container">
          <img src="/images/partnership.png" className="partnership" />
        </div>
      </Paragraph>
      <Paragraph>
        People using our app usually meet in such places so it's obvious they can be a good target for your business.
        They're dating while you're making profits. Win-win 😎. Also if they like your services, there's always a
        chance they'll even come back.
      </Paragraph>
      <Paragraph>
        If it sounds interesting to you, you can contact us by sending an email to <a href="mailto:hotlike@hotlike.app">hotlike@hotlike.app</a>.
        Please attach an information about the business type and/or activities that your business represents.
        Tell us something more about your business and what you can offer to our users.
      </Paragraph>
    </Article>
  );
}

const styles = css`
  .partnership-container {
    text-align: center;
    padding-top: 10px;
  }
  .partnership {
    width: 100%;
    max-width: 400px;
  }
`;

export default Partnership;
