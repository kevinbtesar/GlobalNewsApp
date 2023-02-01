import React, { useState } from 'react';
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk-next';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';

import { Loader } from '..';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import { loginModalVisible, loginUser, logoutUser } from '../../store/userStore/userStore.actions';
import { addNewsToFavorites, removeAllFavorites } from '../../store/newsStore/newsStore.actions';
import { isLoginModalVisibleSelector, isUserConnectedSelector } from '../../store/userStore/userStore.selectors';
import { TEXT_STRINGS } from '../../data/Enums';
import { userAuth } from '../../utils/Api';
import { KEYS } from '../../data/Enums';


const LoginModal = (props) => {
    const dispatch = useDispatch();
    const isModalVisible = useSelector(isLoginModalVisibleSelector);
    const isUserConnected = useSelector(isUserConnectedSelector);
    const [loginState, setLoginState] = useState(null)

    const onCloseModal = () => {
        dispatch(loginModalVisible(false))
        setTimeout(() => {
            setLoginState(null)
        }, 1000)
    }

    const onLogout = () => {
        dispatch(logoutUser())
        dispatch(loginModalVisible(false))
    }


    const facebookButton = async () => {
        setLoginState('loading')

        try {
            const result = await LoginManager.logInWithPermissions([
                'public_profile',
            ]);
            if (result.isCancelled) {
                setLoginState(null)
            } else {
                try {
                    const data = await AccessToken.getCurrentAccessToken();

                    const responseInfoCallback = async (error, res) => {
                        if (error) {
                            setLoginState('An error occurred, please try again later 😔')
                            throw new Error("facebookButton ERROR: " + JSON.stringify(error));

                        } else {
                            try {
                            
                                const login = await userAuth({ email: res.email, userAuth: 'true', name: res.name, deviceId: DeviceInfo.getDeviceId(), appId: DeviceInfo.getBundleId()});
                                // console.log("res", JSON.stringify(res))
                                console.log("login", JSON.stringify(login))

                                if (login.success) {

                                    OneSignal.setExternalUserId(login.user.id.toString());
                                    OneSignal.setEmail(login.user.email);

                                    dispatch(loginUser({ accessToken: login.accessToken, name: res.name, image: res.picture.data.url }))

                                    if (login.favorites.length > 0) {
                                        dispatch(removeAllFavorites());

                                        Object.entries(login.favorites).forEach(([k, v], i) => {
                                            console.log("HERE login.favorites[i].article_data: " + JSON.stringify(login.favorites[i].article_data))
                                            dispatch(addNewsToFavorites(login.favorites[i].article_data));
                                        });
               
                                    }

                                    setLoginState("You've logged in successfully! 👏")

                                } else {
                                    throw new Error("facebookButton 0 ERROR: " + JSON.stringify(login.error));
                                }
                            
                            } catch (err) {
                                throw new Error("facebookButton 1 ERROR: " + JSON.stringify(err));
                            }
                        }
                    };

                    const infoRequest = new GraphRequest(
                        '/me',
                        {
                            accessToken: data.accessToken,
                            parameters: {
                                fields: {
                                    string: 'email,name,picture',
                                },
                            },
                        },
                        responseInfoCallback,
                    );
                    new GraphRequestManager().addRequest(infoRequest).start();

                } catch (err) {
                    throw new Error("facebookButton 2 ERROR: " + JSON.stringify(err));
                }
            }

        } catch (err) {
            setLoginState('An error occurred, please try again later 😔')
            console.log('[Facebook Error]' + err);
        }
    };



    const googleButton = async () => {
        GoogleSignin.configure({
            androidClientId: KEYS.GOOGLE_SIGN_IN_ANDROID_CLIENT_ID,
            iosClientId: KEYS.GOOGLE_SIGN_IN_IOS_CLIENT_ID,
        })

        setLoginState('loading')

        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn();

            try {
                const login = await userAuth({ email: userInfo.user.email, userAuth: 'true', name: userInfo.user.name, deviceId: DeviceInfo.getDeviceId(), appId: DeviceInfo.getBundleId() });
                
                // console.log(login);

                if (login.success) 
                {
                    // OneSignal.setExternalUserId(login.user.id.toString());
                    OneSignal.setEmail(login.user.email);
                    
                    dispatch(loginUser({ accessToken: login.accessToken, name: userInfo.user.name, image: userInfo.user.photo }))

                    if (login.favorites.length > 0) {
                        dispatch(removeAllFavorites());

                        Object.entries(login.favorites).forEach(([k, v], i) => {
                            dispatch(addNewsToFavorites(login.favorites[i]));
                        });
                    }

                    setLoginState("You've logged in successfully! 👏")

                } else {
                    setLoginState('An error occurred, please try again later 😔')
                    throw new Error("googleButton()0 -> Api.rtdServerLoginWithGrant ERROR: " + JSON.stringify(login.error));
                }

            } catch (err) {
                setLoginState('An error occurred, please try again later 😔')
                console.log('googleButton1 Error: ' + JSON.stringify(err))
            }

        } catch (err) {
            setLoginState('An error occurred, please try again later 😔')
            console.log('googleButton2 Error: ' + JSON.stringify(err))
        }
    }


    // const loginManualButton = async () => 
    // {
    //     setLoginState('loading')
    //     try {
    //         const login = await Api.userAuth({ email: this.email, password: this.password, userAuth: 'false' });
    //         if (login.success) {
    //             dispatch(loginUser({ accessToken: login.api_token, name: login.user.name, image: '', }))
    //    if(login.favorites.length>0)
    //    {
    //         Object.entries(login.favorites).forEach(([k, v], i) =>
    //         {
    //             dispatch(addNewsToFavorites(login.favorites[i]));
    //         });
    //    }

    //             setLoginState("You've logged in successfully! 👏")
    //         } else {
    //             throw new Error(login);
    //         }
    //     } catch (err) {
    //         console.log('loginManualButton Error: ' + JSON.stringify(err))
    //     }

    // }

    const ModalContent = () => {
        if (isUserConnected && !loginState) {
            return (
                <>
                    <View style={styles.modalHolderHeader}>
                        <Text style={styles.modalHeaderTitle}>{'Do you want to log out?'}</Text>
                    </View>
                    <View style={styles.logoutContainer}>
                        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                            <Text style={styles.logoutButtonText}>{'Yes'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutButton} onPress={onCloseModal}>
                            <Text style={styles.logoutButtonText}>{'No'}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )
        } else {
            return (
                <>
                    <View style={styles.modalHolderHeader}>
                        <Text style={styles.modalHeaderTitle}>{props.message}</Text>
                    </View>

                    {!loginState ?
                        <View>
                            <TouchableOpacity style={styles.facebookLoginButton} onPress={() => facebookButton()}>
                                <Text style={styles.facebookLoginButtonText}>{'Login with Facebook'}</Text>
                            </TouchableOpacity>

                            <GoogleSigninButton
                                style={styles.googleSigninButton}
                                size={GoogleSigninButton.Size.Wide}
                                color={GoogleSigninButton.Color.Dark}
                                title={'Sign in with Google'} onPress={() => googleButton()}
                            />

                            {/* <Text style={styles.modalHolderHeader}>{TEXT_STRINGS.LOGIN_MANUALLY}</Text> */}

                            {/* <TextInput
                                style={styles.input}
                                placeholder="Email"
                                onChangeText={(text) => this.email = text}
                                value="test5@test.com"
                            />
                            <TextInput
                                style={styles.input}
                                secureTextEntry={true}
                                placeholder="Password"
                                onChangeText={(text) => this.password = text}
                                value="326tesar"
                            />
                            <Button
                                title='Login/Register'
                                onPress={loginManualButton}
                            /> */}
                        </View>
                        :
                        loginState == 'loading' ? <View style={styles.loginStateText}><Loader /></View> : <Text style={styles.loginStateText}>{loginState}</Text>
                    }
                </>
            )
        }
    }

    return (
        <Modal
            isVisible={isModalVisible}
            onRequestClose={onCloseModal}
            onBackdropPress={onCloseModal}
        >
            <View style={styles.modalHolder}>
                <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={onCloseModal}>
                    <Text style={styles.modalCloseIcon}>𝖷</Text>
                </TouchableOpacity>
                <ModalContent />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalHolder: {
        backgroundColor: Colors.off_white,
        borderRadius: 5,
        overflow: 'hidden',
        paddingTop: 10,
    },
    modalHolderHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginTop: '5%'
    },
    modalHeaderTitle: {
        fontWeight: '500',
        color: Colors.black,
        fontSize: 20,
        lineHeight: 26,
        fontFamily: Fonts.KBWriter,
    },
    modalCloseButton: {
        position: 'absolute',
        alignItems: 'center',
        borderRadius: 4,
        top: 2,
        left: 0,
        width: 42,
        height: 42,
        backgroundColor: Colors.off_white,
        zIndex: 0
    },
    modalCloseIcon: {
        color: Colors.grey_green,
        fontSize: 24
    },
    facebookLoginButton: {
        backgroundColor: '#4267B2',
        borderRadius: 4,
        margin: 5,
        marginTop: 25,
        width: 220,
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 10,

        alignSelf: 'center'
    },
    googleSigninButton: {
        alignSelf: 'center',
        borderRadius: 4,
        height: 50,
        width: 230,
        marginBottom: 25,
    },
    facebookLoginButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center'
    },
    loginStateText: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 10,
        marginVertical: '12%'
    },
    logoutContainer: {
        flexDirection: 'row',
        paddingVertical: 25,
        borderBottomColor: Colors.grey_green,
        justifyContent: 'space-around',
    },
    logoutButton: {
        borderColor: Colors.black_opacity,
        backgroundColor: Colors.black_opacity,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderRadius: 4,
        padding: 8,
    },
    logoutButtonText: {
        fontSize: 20,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default LoginModal;