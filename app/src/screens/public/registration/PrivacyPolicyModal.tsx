import { StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';

import ArticleModal from './ArticleModal';
import Paragraph from './Paragraph';
import Case from './Case';

type TPrivacyPolicyModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function PrivacyPolicyModal({ visible, onClose }: TPrivacyPolicyModalProps): JSX.Element {
  return (
    <ArticleModal title="Privacy policy" visible={visible} onClose={onClose}>
      <Paragraph header="Introduction.">
        This privacy policy aims to explain what personal data we collect, how we use it, and what rights you have
        concerning the processing of your data. We value your privacy and take all necessary measures to protect it.
      </Paragraph>
      <Paragraph header="About us.">
        HotLike is a dating mobile application designed for Android and iOS operating systems. Currently this app is a
        hobby project of a private person. The owner of the application is NTI Eryk Blazejczyk representing the sole
        proprietorship in Poland.
      </Paragraph>
      <Paragraph header="Types of personal data collected.">
        <Case title="Identification data.">
          When you create an account in the app, we collect your basic identification data, such as: name, gender,
          date of birth, email address and password.
        </Case>
        <Case title="Profile data.">
          In order to create your profile, we will ask you to provide more detailed information about you, such as:
          appearance, basic bio info, interests, preferences. You may also upload selected photos from your device.
        </Case>
        <Case title="Activity data.">
          We collect information about your activity within the app, such as messages sent and received, interactions
          with other users and other behaviours.
        </Case>
        <Case title="Location data.">
          If you grant permission, we may collect information about your location to provide personalized services.
        </Case>
        <Case title="Device data.">
          We record information about your device, such as: identification of the device, operating system version,
          log-in dates and times.
        </Case>
      </Paragraph>
      <Paragraph header="Purpose of data collection.">
        <Case title="Providing services.">
          We use the collected data to provide services and features of our app, such as matching, interaction and
          communication with other users and displaying relevant content. Other users will only see as much
          information about you as they need to know and nothing more. Especially they will never see your date of
          birth.
        </Case>
        <Case title="Geolocation.">
          The app may collect your location data using GPS, cellular networks, or other technologies to provide
          personalized services and features based on your location. Other users will not be able to see your exact
          location.
        </Case>
        <Case title="Notifications.">
          Notification data is used to send you push notifications about activities within the app, such as matching
          results or new messages from other users.
        </Case>
        <Case title="Access to photos.">
          When you grant permission to access photos, it enables convenient use of features related to images within
          the app.
        </Case>
        <Case title="Improving the app.">
          We analyze data to understand how our users use the app and how we can improve it, such as optimizing
          features and customizing the interface.
        </Case>
      </Paragraph>
      <Paragraph header="Sharing personal data.">
        <Case hideBullet>
          We do not sell or share your personal data with third parties without your consent, except in the following
          cases:
        </Case>
        <Case>
          When required by law or at the request of law enforcement agencies.
        </Case>
        <Case>
          When cooperating with trusted entities that process data on our behalf (e.g. cloud service providers,
          technical support companies).
        </Case>
      </Paragraph>
      <Paragraph header="Data security.">
        We take measures to secure your personal data against unauthorized access, loss, alteration, or damage. We use
        appropriate technical and organizational safeguards to protect your data.
      </Paragraph>
      <Paragraph header="User rights.">
        <Case title="Access and correction.">
          You have the right to access your personal data and correct it if it is outdated or inaccurate.
        </Case>
        <Case title="Deletion.">
          You can request the deletion of your personal data from our database at any time, unless it conflicts with
          applicable laws or our legitimate interests.
        </Case>
        <Case title="Withdrawal of consent.">
          If we process your data based on your consent, you can withdraw it at any time.
        </Case>
      </Paragraph>
      <Paragraph header="Cookies and tracking techniques.">
        Our app may use cookies and other tracking technologies to analyze traffic, personalize content, and provide
        personalized services.
      </Paragraph>
      <Paragraph header="Changes to the privacy policy.">
        We may periodically update our privacy policy. All changes will be posted in this section, and the "Last update"
        date at the bottom of the document will be modified accordingly.
      </Paragraph>
      <Paragraph header="Contact.">
        If you have any questions, concerns, or requests regarding your personal data, please contact us at: hotlike@hotlike.app.
      </Paragraph>
      <Text style={styles.lastUpdate}>
        Last update: August 1st, 2023.
      </Text>
    </ArticleModal>
  );
}

const styles = StyleSheet.create({
  lastUpdate: {
    marginBottom: 10,
  },
});
