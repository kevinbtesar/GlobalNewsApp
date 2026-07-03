import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Surface, useTheme } from 'react-native-paper';

import { removeAllNotifications } from '../../store/newsStore/newsStore.actions';
import { notificationsSelector } from '../../store/newsStore/newsStore.selectors';
import { NewsCardList, NoResults } from '../../components';
import Colors from '../../utils/Colors';

const Notifications = (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const notifications = useSelector(notificationsSelector);

  const onClickDeleteAll = React.useCallback(() => {
    dispatch(removeAllNotifications());
  }, [dispatch]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.heroCard, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.heroAccent, { backgroundColor: theme.colors.primary }]} />
        <View style={styles.heroCopy}>
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
            Alerts
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            {notifications.length
              ? `${notifications.length} notifications are waiting for you.`
              : 'You are all caught up for now.'}
          </Text>
        </View>

        <Button
          mode="outlined"
          icon="delete-sweep"
          style={styles.heroAction}
          onPress={onClickDeleteAll}
          disabled={!notifications.length}
        >
          Clear all
        </Button>
      </Surface>

      {notifications.length > 0 ? (
        <View style={styles.feedShell}>
          <NewsCardList notifications={notifications} navigation={props.navigation} />
        </View>
      ) : (
        <View style={styles.emptyWrap}>
          <NoResults text="You have no new notifications" fontSize={24} color={theme.colors.text} />
          <Button mode="contained" icon="home" onPress={() => props.navigation.navigate('Home')}>
            Go to Home
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 14,
  },
  heroCard: {
    borderRadius: 28,
    padding: 18,
    overflow: 'hidden',
    gap: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  heroAccent: {
    position: 'absolute',
    top: 0,
    right: -20,
    width: 92,
    height: 92,
    borderRadius: 999,
    opacity: 0.18,
  },
  heroCopy: {
    gap: 8,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  heroAction: {
    alignSelf: 'flex-start',
    borderRadius: 16,
  },
  feedShell: {
    flex: 1,
  },
  emptyWrap: {
    flex: 1,
    gap: 12,
  },
});

export default Notifications;
