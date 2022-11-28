import React from 'react'
import { StyleSheet, View, Text, Image} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { isUserConnectedSelector,getUserDataSelector } from '../../store/userStore/userStore.selectors';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';




const Settings = (props) => {

    const isUserConnected = useSelector(isUserConnectedSelector);
    const userData = useSelector(getUserDataSelector);

    return (
        isUserConnected ?

                <View style={styles.container}>
                    <View
                        style={styles.rightSideProfileContainer}>
                        <View
                            style={{alignItems: 'center',}}>

                            <Image
                                style={{ width: 30, height: 30, borderRadius: 35 }}
                                source={{ uri: userData.image, cache: "force-cache" }}
                            />
                            <Text style={styles.text}>{userData.name}</Text>
                        </View>
                    </View>

                </View>
                :
                <>
                </>
        
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