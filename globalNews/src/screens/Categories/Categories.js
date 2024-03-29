import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { NewsCategoryCard, LoginModal } from '../../components';
// import { NewsCategoriesData } from '../../data';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { isUserConnectedSelector } from '../../store/userStore/userStore.selectors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import posed from 'react-native-pose'
import LinearGradient from 'react-native-linear-gradient';

const PosedComponent = posed.View({
    open: { y: 0, staggerChildren: 125 },
    closed: { y: 0, staggerChildren: 125 },
});

const PosedItem = posed.View({
    open: { y: 0, opacity: 1 },
    closed: { y: 30, opacity: 0 },
});


const Categories = (props) => {
    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const [poseOpen, setPoseOpen] = useState(false)

    useEffect(() => {
        setPoseOpen(true)
    }, [])

    const onNavigateToFavorites = () => {
        if (isUserConnected) {
            props.navigation.navigate('Favorites')
        } else {
            dispatch(loginModalVisible(true))
        }
    }

    const renderCategoryItem = ({ item, index }) => (
        <PosedItem key={index}>
            <NewsCategoryCard {...item} {...props} />
        </PosedItem>
    )

    return (
        <>
            <LinearGradient start={{ x: 1, y: 1 }} end={{ x: 1, y: .7 }} colors={[Colors.white, Colors.yellow]} style={styles.toolBarLine}>
                <TouchableOpacity style={styles.toolBarButton} onPress={onNavigateToFavorites}>
                    <Text style={styles.toolBarText}>{`Your favorites list ❤️`}{isUserConnected}</Text>
                </TouchableOpacity>
            </LinearGradient>
            <PosedComponent pose={poseOpen ? 'open' : 'closed'}>
                <FlatList
                    // data={NewsCategoriesData}
                    keyExtractor={(item, index) => item.category}
                    renderItem={renderCategoryItem}

                />
            </PosedComponent>

            <LoginModal message={'To save an article to favorites you need to login'} />

        </>
    )
}

const styles = StyleSheet.create({
    toolBarLine: {
        backgroundColor: Colors.yellow,
        paddingTop: 10,
        paddingBottom: 8,
        borderBottomWidth: .3,
        borderBottomColor: Colors.grey_green,
        flex: .5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    toolBarButton: {
        borderColor: Colors.black_opacity,
        backgroundColor: Colors.off_white,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderRadius: 4,
        padding: 7,
    },
    toolBarText: {
        fontSize: 16,
        fontFamily: Fonts.KBWriterThin,
        textAlign: 'center'
    },
});

export default Categories