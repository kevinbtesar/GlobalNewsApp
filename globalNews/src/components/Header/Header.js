import React from 'react'
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';
import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../utils/Colors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
// import Icon from 'react-native-vector-icons/Ionicons';

const Header = (props) => {
    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const userData = useSelector(getUserDataSelector);
    const { navigation } = props;

    if (props.side == 'right') {
        return (
            isUserConnected ?

                <View style={styles.container}>
                    <View
                        style={styles.rightSideProfileContainer}>
                        <View
                            style={{alignItems: 'center',}}>

                            <Image
                                style={{ width: 40, height: 40, borderRadius: 35 }}
                                source={{ uri: userData.image, cache: "force-cache" }}
                            />
                            {/* <Feather name="search" color={Colors.white} size={29} />
                            <Text style={styles.text}>Search</Text> */}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.leftSideContainer} onPress={() => dispatch(loginModalVisible(true))}>
                        <MaterialCommunityIcons name="logout" color={Colors.white} size={20} />
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

        return (
            <>
            </>
            // <Icon
            //     style={{ paddingLeft: 10 }}
            //     onPress={() => navigation.toggleDrawer()}
            //     name="md-menu"
            //     size={30}
            // />
        )
    }
}



const styles = StyleSheet.create({
    rightSideProfileContainer: {
        alignItems: 'flex-end',
        paddingRight: 1,
        flex: 1,
        fontSize: 12,

    },
    rightSideContainer: {
        alignItems: 'center',
        paddingRight: 13
    },
    container: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    leftSideContainer: {
        alignItems: 'center',
        paddingLeft: 10,
        fontSize: 12,
        alignSelf: "flex-start"
    },
    text: {
        color: Colors.white,
        height:20,
    }
});

export default Header