import ArticleModal from './ArticleModal';
import Paragraph from './Paragraph';
import Case from './Case';

type TTermsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function TermsModal({ visible, onClose }: TTermsModalProps): JSX.Element {
  return (
    <ArticleModal title="Terms of use" visible={visible} onClose={onClose}>
      <Paragraph header="General provisions.">
        <Case>
          This terms of use defines the rules for using the HotLike application (hereinafter referred to as the
          "Application") and the rights and obligations of the users.
        </Case>
        <Case>
          By using the Application, the user accepts the terms of this terms of use and the privacy policy of the
          application.
        </Case>
        <Case>
          The owner and administrator of the Application is NTI Eryk Blazejczyk representing the sole proprietorship
          in Poland.
        </Case>
      </Paragraph>
      <Paragraph header="Acceptance of terms.">
        <Case>
          The Application provides services related to instant dating, match-making, making new friendships,
          communication between users, photo sharing.
        </Case>
        <Case>
          The owner of the Application reserves the right to make changes in the scope of services and functionalities
          provided by the Application.
        </Case>
      </Paragraph>
      <Paragraph header="Conditions of use.">
        <Case>
          The user must be at least 18 years old in order to use the Application.
        </Case>
        <Case>
          The user may use the Application in accordance with the terms defined in this terms of use and in compliance
          with applicable law.
        </Case>
        <Case>
          The user shall not use the Application in a manner that violates the rights of others, harms the Application
          or its users, or compromises the security of the Application and its data.
        </Case>
        <Case>
          The user agrees to comply with all regulations related to privacy, personal data, and intellectual property
          rights, especially regarding photos and content shared in the Application.
        </Case>
        <Case>
          It is prohibited to distribute illegal, offensive, vulgar, or otherwise inappropriate content within the
          Application.
        </Case>
      </Paragraph>
      <Paragraph header="Account registration.">
        <Case>
          Functionalities of the Application require user account registration.
        </Case>
        <Case>
          The user is responsible for maintaining the confidentiality of login data and must not share it with third
          parties.
        </Case>
        <Case>
          The user must provide true, current, and complete information during the registration process.
        </Case>
        <Case>
          The user is responsible for all actions taken through their account.
        </Case>
      </Paragraph>
      <Paragraph header="User content.">
        <Case>
          The user is responsible for the content shared within the Application, such as photos, messages, etc.
        </Case>
        <Case>
          The user guarantees that they have all the necessary rights to share the content and that it does not
          violate the rights of others, including copyrights, privacy, and reputation rights.
        </Case>
      </Paragraph>
      <Paragraph header="Liability.">
        <Case>
          The owner of the Application is not responsible for user-generated content.
        </Case>
        <Case>
          The owner of the Application is not liable for disruptions in the functioning of the Application resulting
          from hardware or software failures or internet network issues.
        </Case>
        <Case>
          The owner of the Application is not liable for damages resulting from improper use of the Application by
          users.
        </Case>
      </Paragraph>
      <Paragraph header="Changes in the terms of use.">
        <Case>
          The owner of the Application reserves the right to make changes to this terms of use.
        </Case>
        <Case>
          Any changes to the terms of use will be published within the Application and its website and will become
          effective from the date of publication.
        </Case>
      </Paragraph>
    </ArticleModal>
  );
}
