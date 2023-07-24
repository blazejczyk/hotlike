import { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider, Icon, Text, TopNavigation, TopNavigationAction, useTheme } from '@ui-kitten/components';

import SvgIcon from './SvgIcon';
import { Gender } from '../services/enums';

type TUserHeaderProps = {
  name: string;
  gender: Gender;
  age: number;
  onBack?: () => void;
  backIconName?: string;
  divided?: boolean;
};

export default function UserHeader({ name, gender, age, onBack, backIconName, divided }: TUserHeaderProps): JSX.Element {
  const theme = useTheme();

  const renderTitle = useCallback(() => (
    <View style={styles.title}>
      <Text category="h6">{name}, {age}</Text>
      <SvgIcon scope="genders" name={gender} width="20" height="20" />
    </View>
  ), [name, age, gender]);

  const renderBackAction = useMemo(() => (
    onBack
      ? (() => (
        <TopNavigationAction
          icon={() => <Icon name={backIconName || 'arrow-back-outline'} fill={theme['color-basic-700']} style={styles.backButtonIcon} />}
          onPress={onBack}
        />
      ))
      : undefined
  ), [theme, backIconName, onBack]);

  return (
    <>
      <TopNavigation
        title={renderTitle}
        accessoryLeft={renderBackAction}
        alignment="center"
      />
      {divided && <Divider />}
    </>
  );
}

const styles = StyleSheet.create({
  backButtonIcon: {
    width: 24,
    height: 24,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
