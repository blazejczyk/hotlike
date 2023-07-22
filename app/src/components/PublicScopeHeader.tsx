import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';

import SvgIcon, { TGeneralIconName } from './SvgIcon';

type TStepHeaderProps = {
  iconName: TGeneralIconName;
  title: string | JSX.Element;
  description: string | JSX.Element;
};

export default function PublicScopeHeader({ iconName, title, description }: TStepHeaderProps): JSX.Element {
  return (
    <View>
      <View style={styles.iconContainer}>
        <SvgIcon scope="general" name={iconName} width={100} height={100} />
      </View>
      <View style={styles.info}>
        <Text category="h4" style={styles.infoTitle}>{title}</Text>
        <Text category="h5" style={styles.infoDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
  info: {
    alignItems: 'center',
    marginVertical: 10,
  },
  infoTitle: {
    fontWeight: 'normal',
    alignItems: 'center',
    textAlign: 'center',
  },
  infoDescription: {
    padding: 0,
    paddingTop: 3,
    fontWeight: 'normal',
    textAlign: 'center',
  },
});
