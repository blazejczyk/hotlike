/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import Article, { Importance } from '../components/Article';
import Paragraph from '../components/Paragraph';
import List, { ListItem } from '../components/List';
import useTitle from '../hooks/useTitle';

function AccountDeletion() {
  useTitle('Account deletion.');

  return (
    <Article title="How to delete an account?" contentCss={styles}>
      <Paragraph>
        You can always request to delete your account and all related data from our database. This can be done easily
        through the application interface. Below you'll find a step-by-step guide.
      </Paragraph>
      <Paragraph>
        <List>
          <ListItem>
            Go to your profile screen (tap on the "head with heart" icon).
            <div className="screenshot-container">
              <img src="/images/deletion1.jpg" className="screenshot" />
            </div>
          </ListItem>
          <ListItem>
            Choose "Settings" tab and scroll to the bottom of the screen. You should see "Account section" containing
            "Delete account" button.
            <div className="screenshot-container">
              <img src="/images/deletion2.jpg" className="screenshot" />
            </div>
          </ListItem>
          <ListItem>
            Tap the "Delete account" button and confirm that you want to delete your account. Please
            note <Importance>this action cannot be undone</Importance>. If you delete your account and later
            you'll wish to use the app again, you'll need to create a new account.
            <div className="screenshot-container">
              <img src="/images/deletion3.jpg" className="screenshot" />
            </div>
          </ListItem>
          <ListItem>
            You'll be redirected to the login screen. No additional action is required. Your account will be removed
            then. You can safely delete the application as well.
          </ListItem>
        </List>
      </Paragraph>
    </Article>
  );
}

const styles = css`
  .screenshot-container {
    text-align: center;
    padding: 8px 0 12px 0;
  }
  .screenshot {
    width: 100%;
    max-width: 320px;
    border: 1px solid #2E3A59;
    border-radius: 6px;
  }
`;

export default AccountDeletion;
