import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import { List, MD3Colors, Switch, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OneSignal from 'react-native-onesignal';

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
    const [ranOnceFlag, setRanOnceFlag] = useState(false);

    // const [isNotificationSwitchOn, setIsNotificationSwitchOn] = useState(false);
    // const [isDarkModeSwitchOn, setIsDarkModeSwitchOn] = useState(false);
    // const onToggleNotificationSwitch = () => setIsNotificationSwitchOn(!isNotificationSwitchOn);
    // const onToggleDarkModeSwitch = () => setIsDarkModeSwitchOn(!isDarkModeSwitchOn);

    const onToggleNotificationSwitch = async (desiredSetting) => {

        setNotificationSwitch(desiredSetting) // set the toggle switch to the desired setting

        if (desiredSetting) {
            try {
                const state = await OneSignal.getDeviceState();
                
                if (!state.hasNotificationPermission) 
                {
                    OneSignal.promptForPushNotificationsWithUserResponse(true, response => 
                    {
                        if (response)
                        {
                            // notifications permission was set to On
                            OneSignal.disablePush(false);
                            AsyncStorage.setItem('@notificationsSetting', "true")
                            
                        } else {
                            setNotificationSwitch(false) // denied permission so set toggle back to Off
                            AsyncStorage.setItem('@notificationsSetting', "false")
                        }
                    });
                } else {
                    OneSignal.disablePush(false);
                    await AsyncStorage.setItem('@notificationsSetting', "true")
                }
            } catch (e) {
                setNotificationSwitch(false)  // there was an issue with Async or OneSignal, so set toggle back to Off
            }

        } else {
            OneSignal.disablePush(true);
            await AsyncStorage.setItem('@notificationsSetting', "false")
        }
    };

    async function getNotificationsSetting() {
        try {
            const value = await AsyncStorage.getItem('@notificationsSetting')
            const state = await OneSignal.getDeviceState();

            /**
             * ranOnceFlag is used to set the notifications switch to the proper setting on init. 
             * without it, setNotificationSwitch() is ran with every toggle, which looks odd
             **/ 
            if(!ranOnceFlag){ 
                setRanOnceFlag(true);
                setNotificationSwitch(value == "true" && state.hasNotificationPermission ? true : false)
            }
 
            return (value == "true" && state.hasNotificationPermission ? true : false)

        } catch (e) {
            setNotificationSwitch(false);
            return false;
        }

    }


    
    const onToggleDarkModeSwitch = async (value) => {
        setIsDarkModeSwitch(value)
        try {
            const setValue = (value && value == true) ? "true" : "false"
            await AsyncStorage.setItem('@darkModeSetting', setValue)
        } catch (e) {
            // saving error
        }
    };

    async function getDarkModeSetting() {
        try {
            const value = await AsyncStorage.getItem('@darkModeSetting')
            setIsDarkModeSwitch(value == "true" ? true : false)
            return value
        } catch (e) {
            setIsDarkModeSwitch(false)
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
                    right={() => <Switch value={isNotificationSwitchOn} onValueChange={(value) => onToggleNotificationSwitch(value)} />}
                />
            </List.Section>


            <List.Section>
                <List.Subheader>Theme</List.Subheader>
                <List.Item
                    title="Dark Mode"
                    left={() => <List.Icon color={MD3Colors.tertiary70} icon="lightbulb-on-outline" />}
                    right={() => <Switch value={isDarkModeSwitchOn} onValueChange={(value) => onToggleDarkModeSwitch(value)} />}
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
                // onPress={() => initializeShare(DeviceInfo.getApplicationName(), "TODO: Google or Apple url")}
                />
                <List.Item
                    title="Report Bug"
                    left={() => <List.Icon color={MD3Colors.tertiary70} icon="bug-outline" />}
                    onPress={() => reportBug()}
                />
            </List.Section>

            <List.Section>

                <List.Item title="Version Code" description={DeviceInfo.getVersion()} />
                <List.Item title="Build Number" description={DeviceInfo.getBuildNumber()} />

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