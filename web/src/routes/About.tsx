import Article, { Importance } from '../components/Article';
import Paragraph from '../components/Paragraph';
import useTitle from '../hooks/useTitle';

function About() {
  useTitle('About');

  return (
    <Article title="About the app and how it actually works.">
      <Paragraph>
        <Importance>HotLike</Importance> is an instant-dating mobile application available for Android and iOS systems.
        It allows you to match with like-minded people around you in places you both enjoy.
      </Paragraph>
      <Paragraph>
        Forget about time-consuming swiping and repetitive boring chats leading nowhere. Stop wasting your time. Get
        outside and start meeting new people doing what you usually like doing. Immediately.
      </Paragraph>
      <Paragraph>
        Okay, but <Importance>how is it possible</Importance>? Well, it's pretty easy. Install the app, add some photos,
        complete your profile. That's an obvious part 😄.
      </Paragraph>
      <Paragraph>
        The fundamental thing of the app is the <Importance>map</Importance> screen. If there are active people also
        using the app, on this map you're going to see zones (red circles) where you can find some people ready to meet
        you. If you're lucky to be in such a zone, you should be able to ask some people out. If you're not, just go
        there 😛.
      </Paragraph>
      <Paragraph>
        The app will show you date ideas. For example it'll suggest you to meet someone in the near coffee shop. The
        only thing you need to do is to <Importance>ask someone out</Importance>. After you do this, the invited person
        has 90 seconds to accept your invitation. If it happens, you'll see the walking path to this coffee shop where
        you're going to meet together. Have fun! 🥂
      </Paragraph>
      <Paragraph>
        Psst! Remember that the same thing can be done by other people around you. They can ask you out as well!
      </Paragraph>
    </Article>
  );
}

export default About;
