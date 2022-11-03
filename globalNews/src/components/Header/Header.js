import React from 'react'
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';
import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../utils/Colors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = (props) => {
    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const userData = useSelector(getUserDataSelector);
    const { navigation } = props;

    if (props.side == 'right') {
        return (
            isUserConnected ?
                // <View style={styles.rightSideContainer}>
                //     <Image
                //         style={{ width: 30, height: 30, borderRadius: 35 }}
                //         source={{ uri: userData.image, cache: "force-cache" }}
                //     />
                //     <Text style={styles.text}>{userData.name}</Text>
                // </View> :

                <View style={styles.rightSideContainer}>
                    <TouchableOpacity style={styles.leftSideContainer} onPress={() => dispatch(loginModalVisible(true))}>
                        <MaterialCommunityIcons name="logout" color={Colors.white} size={25} />
                        <Text style={styles.text}>{'Logout'}</Text>
                    </TouchableOpacity>
                </View>
                :
                (
                    <View style={styles.rightSideContainer}>
                        <TouchableOpacity style={styles.rightSideContainer} onPress={() => dispatch(loginModalVisible(true))}>
                            <MaterialCommunityIcons name="login" color={Colors.white} size={25} />
                            <Text style={styles.text}>{'Login'}</Text>
                        </TouchableOpacity>
                    </View>
                )
        )
    } else {
        // if (!isUserConnected) {
        // return <View />
        // }
        return (
            // <TouchableOpacity style={styles.leftSideContainer} onPress={() => dispatch(loginModalVisible(true))}>
            //     <MaterialCommunityIcons name="logout" color={Colors.white} size={25} />
            //     <Text style={styles.text}>{'Logout'}</Text>
            // </TouchableOpacity>

            <Icon
                style={{ paddingLeft: 10 }}
                onPress={() => navigation.toggleDrawer()}
                name="md-menu"
                size={30}
            />
        )
    }
}



const styles = StyleSheet.create({
    rightSideContainer: {
        alignItems: 'center',
        paddingRight: 13
    },
    leftSideContainer: {
        alignItems: 'center',
        paddingLeft: 13
    },
    text: {
        color: Colors.white,
        fontSize: 12,
    }
});

export default Header