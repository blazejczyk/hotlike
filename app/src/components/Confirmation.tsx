import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Card, Text, Button, Icon } from '@ui-kitten/components';
import useStateContext from '../hooks/contexts/useStateContext';
import useDispatchContext from '../hooks/contexts/useDispatchContext';

export type TConfirmation = {
  message: string;
  onConfirm: () => void;
};

export default function Confirmation(): JSX.Element | null {
  const { confirmation } = useStateContext();
  const { setConfirmation } = useDispatchContext();

  const renderYesButtonIcon = useCallback(() => <Icon name="checkmark-circle-outline" fill="white" style={styles.buttonIcon} />, []);
  const renderNoButtonIcon = useCallback(() => <Icon name="slash-outline" fill="white" style={styles.buttonIcon} />, []);

  const handleYes = useCallback(() => {
    confirmation?.onConfirm();
    setConfirmation(null);
  }, [confirmation, setConfirmation]);

  const handleNo = useCallback(() => setConfirmation(null), [setConfirmation]);

  return confirmation && (
    <Modal visible={true} backdropStyle={styles.modal}>
      <Card style={styles.card}>
        <Text style={styles.message}>{confirmation.message || 'Are you sure?'}</Text>
        <View style={styles.buttons}>
          <Button
            status="success"
            style={styles.button}
            accessoryLeft={renderYesButtonIcon}
            onPress={handleYes}
          >
            YES
          </Button>
          <Button
            status="danger"
            style={styles.button}
            accessoryLeft={renderNoButtonIcon}
            onPress={handleNo}
          >
            NO
          </Button>
        </View>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    margin: 10,
    padding: 20,
  },
  message: {
    textAlign: 'center'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 15
  },
  button: {
    width: 100,
  },
  buttonIcon: {
    width: 18,
    height: 18,
  },
});
