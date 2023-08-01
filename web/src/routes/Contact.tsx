import Article from '../components/Article';
import Paragraph from '../components/Paragraph';
import useTitle from '../hooks/useTitle';

function Contact() {
  useTitle('Contact');

  return (
    <Article title="Any questions or need help? Contact us.">
      <Paragraph>
        We are available to answer your questions via our general email address: <a href="mailto:hotlike@hotlike.app">hotlike@hotlike.app</a>.
      </Paragraph>
      <Paragraph>
        We will be glad to help :).
      </Paragraph>
    </Article>
  );
}

export default Contact;
