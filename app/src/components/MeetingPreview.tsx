import { useMemo, useRef } from 'react';
import { ImageProps, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text, useTheme } from '@ui-kitten/components';
import { TextElement } from '@ui-kitten/components/ui/text/text.component';

import Photo from './Photo';
import SvgIcon from './SvgIcon';
import { TMeeting } from '../repos/meetings';
import useReadyLayout from '../hooks/useReadyLayout';

type TMeetingPreviewProps = {
  meeting: TMeeting;
  iconName: string;
  headerText: TextElement;
  footerText: TextElement;
  onPress: () => void;
  animatedIcon?: boolean;
};

export default function MeetingPreview({ meeting, iconName, headerText, footerText, onPress, animatedIcon }: TMeetingPreviewProps): JSX.Element {
  const theme = useTheme();
  const iconRef = useRef<Icon<Partial<ImageProps>>>(null);
  const iconAnimationConfig = useMemo(() => ({ cycles: Infinity, useNativeDriver: false }), []);

  const handleLayout = useReadyLayout(() => {
    const icon = iconRef.current;
    if (!animatedIcon || !icon) {
      return;
    }
    icon.startAnimation();
    return () => {
      icon.stopAnimation();
    };
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Icon
          ref={iconRef}
          name={iconName}
          fill={theme['color-danger-default']}
          style={styles.icon}
          animation="pulse"
          animationConfig={iconAnimationConfig}
          onLayout={handleLayout}
        />
        <Text category="h6" style={styles.headerText}>
          {headerText}
        </Text>
      </View>
      <View style={styles.content}>
        <Photo url={meeting.user.photos[0].thumbnailUrl} style={styles.photo} />
        <View>
          <Text>Meet her at:</Text>
          <View style={styles.place}>
            <SvgIcon scope="activities" name={meeting.place.activity} width="20" height="20" />
            <Text style={styles.placeName}>{meeting.place.name}</Text>
          </View>
          <Text category="s2">
            {footerText}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'normal',
  },
  icon: {
    width: 25,
    height: 25,
  },
  content: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photo: {
    width: 60,
    height: 60,
  },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  placeName: {
    fontWeight: 'bold',
  },
});
