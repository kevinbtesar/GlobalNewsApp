import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import { List, MD3Colors, Switch, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import DeviceInfo from 'react-native-device-info';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import { initializeShare } from '../../utils/Share';

const Settings = (props) => {
    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const userData = useSelector(getUserDataSelector);
    const [isNotificationSwitchOn, setNotificationSwitch] = useState(!getNotificationsSetting());
    const [isDarkModeSwitchOn, setIsDarkModeSwitch] = useState(!getDarkModeSetting());
    const reportBug = () => {
        console.log("TODO: MAKE REPORTING SYSTEM")
    };
    const [ranNotificationOnceFlag, setRanNotificationOnceFlag] = useState(false);
    const [ranDarkModeOnceFlag, setRanDarkModeOnceFlag] = useState(false);

    const onToggleNotificationSwitch = async () => {
        let mNotificationSwitchStatus = !isNotificationSwitchOn

        setNotificationSwitch(mNotificationSwitchStatus)

        try {
            await AsyncStorage.setItem('@notificationsSetting', mNotificationSwitchStatus ? "true" : "false")
        } catch (e) {
            setNotificationSwitch(false)
        }
    };

    const onToggleDarkModeSwitch = async () => {
        setIsDarkModeSwitch(!isDarkModeSwitchOn)
        try {
            await AsyncStorage.setItem('@darkModeSetting', !isDarkModeSwitchOn ? "true" : "false")
        } catch (e) {
            setIsDarkModeSwitch(false)
        }
    };


    async function getNotificationsSetting() {
        try {
            const notificationsSettingValue = await eval(AsyncStorage.getItem('@notificationsSetting')) ?? "true"
            let notificationBool = !!notificationsSettingValue

            if (!ranNotificationOnceFlag) {
                setNotificationSwitch(notificationBool)
                setRanNotificationOnceFlag(true)
            }

            return notificationBool

        } catch (e) {
            if (!ranNotificationOnceFlag) {
                setNotificationSwitch(false)
                setRanNotificationOnceFlag(true)
            }
            return false;
        }

    }


    async function getDarkModeSetting() {
        try {
            let darkModeBool = await AsyncStorage.getItem('@darkModeSetting') ?? "false"
            darkModeBool = eval(darkModeBool)
            if (!ranDarkModeOnceFlag) {
                setIsDarkModeSwitch(darkModeBool)
                setRanDarkModeOnceFlag(true)

            }

            return darkModeBool
        } catch (e) {
            if (!ranDarkModeOnceFlag) {
                setIsDarkModeSwitch(false)
                setRanDarkModeOnceFlag(true)
            }
            return false
        }
    }


    return (

        <ScrollView >

            <List.Section>
                <List.Subheader>Account</List.Subheader>
                {isUserConnected ?

                    <List.Item
                        title={userData.name}
                        description="Sign Out"
                        onPress={() => { dispatch(loginModalVisible(true)) }}
                        left={() => {
                            userData.image &&
                            <Image style={{ width: 30, height: 30, borderRadius: 35 }}
                                source={{ uri: userData.image, cache: "force-cache" }} />
                        }
                        }
                    />
                    :
                    <Button mode="contained" style={styles.navigateButton} onPress={() => { dispatch(loginModalVisible(true)) }}>
                        Sign In
                    </Button>

                }
            </List.Section>


            <List.Section>

                <List.Item

                    title="Notifications"
                    description="Allow one notification every other day"
                    left={() => <List.Icon color={MD3Colors.tertiary70} icon="bell-outline" />}
                    right={() => <Switch value={isNotificationSwitchOn} onValueChange={onToggleNotificationSwitch} />}
                />
            </List.Section>


            <List.Section>
                <List.Subheader>Theme</List.Subheader>
                <List.Item
                    title="Dark Mode"
                    left={() => <List.Icon color={MD3Colors.tertiary70} icon="lightbulb-on-outline" />}
                    right={() => <Switch value={isDarkModeSwitchOn} onValueChange={onToggleDarkModeSwitch} />}
                />
            </List.Section>


            <List.Section>
                <List.Subheader>Reach Out</List.Subheader>
                <List.Item
                    title={"Share " + DeviceInfo.getApplicationName()}
                    left={() => <List.Icon color={MD3Colors.tertiary70} icon="share-variant" />}
                    onPress={() => initializeShare(DeviceInfo.getApplicationName(), "TODO: Google or Apple url")}
                />
                <List.Item
                    title={"Rate " + DeviceInfo.getApplicationName()}
                    left={() => <List.Icon color={MD3Colors.tertiary70} icon="star" />}
                />
                <List.Item
                    title="Report Bug"
                    left={() => <List.Icon color={MD3Colors.tertiary70} icon="bug-outline" />}
                    onPress={() => reportBug()}
                />
            </List.Section>

            <List.Section>

                <List.Item title="" description={`v ${DeviceInfo.getVersion()}.${DeviceInfo.getBuildNumber()}`} />

            </List.Section>

        </ScrollView>

    )
};

const styles = StyleSheet.create({
    toolBarLine: {
        backgroundColor: Colors.yellow,
        paddingTop: 10,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    toolBarButton: {
        flex: 0.42,
        borderColor: Colors.black_opacity,
        backgroundColor: Colors.off_white,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderRadius: 4,
        paddingVertical: 5,
    },
    toolBarTextContainer: {
        flex: 0.42,
        paddingVertical: 5,
    },
    toolBarText: {
        fontSize: 16,
        fontFamily: Fonts.KBWriterThin,
        textAlign: 'center'
    },
    navigateButton: {
        marginTop: 20,
        alignSelf: 'center',
        width: '50%',
        borderColor: Colors.black_opacity,
        backgroundColor: Colors.yellow,
        borderWidth: 1,
        borderBottomWidth: 4,
        borderRightWidth: 3,
        borderRadius: 4,
        padding: 7,
    },
    navigateButtonText: {
        fontSize: 20,
        textAlign: 'center',
        color: Colors.white
    },
});

export default Settings