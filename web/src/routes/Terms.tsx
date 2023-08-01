import Article from '../components/Article';
import Paragraph from '../components/Paragraph';
import List, { ListItem } from '../components/List';
import useTitle from '../hooks/useTitle';

function Terms() {
  useTitle('Terms');

  return (
    <Article title="Terms of use.">
      <Paragraph header="General provisions.">
        <List>
          <ListItem>
            This terms of use defines the rules for using the HotLike application (hereinafter referred to as the
            "Application") and the rights and obligations of the users.
          </ListItem>
          <ListItem>
            By using the Application, the user accepts the terms of this terms of use and the privacy policy of the
            application.
          </ListItem>
          <ListItem>
            The owner and administrator of the Application is NTI Eryk Blazejczyk representing the sole proprietorship
            in Poland.
          </ListItem>
        </List>
      </Paragraph>
      <Paragraph header="Acceptance of terms.">
        <List>
          <ListItem>
            The Application provides services related to instant dating, match-making, making new friendships,
            communication between users, photo sharing.
          </ListItem>
          <ListItem>
            The owner of the Application reserves the right to make changes in the scope of services and functionalities
            provided by the Application.
          </ListItem>
        </List>
      </Paragraph>
      <Paragraph header="Conditions of use.">
        <List>
          <ListItem>
            The user must be at least 18 years old in order to use the Application.
          </ListItem>
          <ListItem>
            The user may use the Application in accordance with the terms defined in this terms of use and in compliance
            with applicable law.
          </ListItem>
          <ListItem>
            The user shall not use the Application in a manner that violates the rights of others, harms the Application
            or its users, or compromises the security of the Application and its data.
          </ListItem>
          <ListItem>
            The user agrees to comply with all regulations related to privacy, personal data, and intellectual property
            rights, especially regarding photos and content shared in the Application.
          </ListItem>
          <ListItem>
            It is prohibited to distribute illegal, offensive, vulgar, or otherwise inappropriate content within the
            Application.
          </ListItem>
        </List>
      </Paragraph>
      <Paragraph header="Account registration.">
        <List>
          <ListItem>
            Functionalities of the Application require user account registration.
          </ListItem>
          <ListItem>
            The user is responsible for maintaining the confidentiality of login data and must not share it with third
            parties.
          </ListItem>
          <ListItem>
            The user must provide true, current, and complete information during the registration process.
          </ListItem>
          <ListItem>
            The user is responsible for all actions taken through their account.
          </ListItem>
        </List>
      </Paragraph>
      <Paragraph header="User content.">
        <List>
          <ListItem>
            The user is responsible for the content shared within the Application, such as photos, messages, etc.
          </ListItem>
          <ListItem>
            The user guarantees that they have all the necessary rights to share the content and that it does not
            violate the rights of others, including copyrights, privacy, and reputation rights.
          </ListItem>
        </List>
      </Paragraph>
      <Paragraph header="Liability.">
        <List>
          <ListItem>
            The owner of the Application is not responsible for user-generated content.
          </ListItem>
          <ListItem>
            The owner of the Application is not liable for disruptions in the functioning of the Application resulting
            from hardware or software failures or internet network issues.
          </ListItem>
          <ListItem>
            The owner of the Application is not liable for damages resulting from improper use of the Application by
            users.
          </ListItem>
        </List>
      </Paragraph>
      <Paragraph header="Changes in the terms of use.">
        <List>
          <ListItem>
            The owner of the Application reserves the right to make changes to this terms of use.
          </ListItem>
          <ListItem>
            Any changes to the terms of use will be published within the Application and its website and will become
            effective from the date of publication.
          </ListItem>
        </List>
      </Paragraph>
    </Article>
  );
}

export default Terms;
