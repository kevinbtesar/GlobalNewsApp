/**
 * @format
 * @flow
 */
import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, IconButton } from "react-native";
import { Card, Headline, Caption, TouchableRipple, Menu } from 'react-native-paper';
import moment from 'moment';
import Fonts from '../../utils/Fonts';
import Colors from '../../utils/Colors';
import { FavoriteIcon } from '..';
import { OverflowMenu } from '..';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';

const noImageAvailable = 'https://www.bengi.nl/wp-content/uploads/2014/10/no-image-available1.png'

const NewsCard = (props) => {

    const { article, navigation } = props
    const { title, /*thumbnail*/image, domain, created_utc, } = article
    const [menuVisible, setMenuVisible] = useState(null)
    const handleMenuShow = (showing) => {
        if (showing) {
            menuVisible = false
        } else {
            menuVisible = true
        }
    }
    /**
     * Share block
     * ref: https://github.com/react-native-share/react-native-share
     */
    const [setResult] = useState < string > ('');
    /**
     * This functions share a image passed using the
     * url param
     */
    const shareEmailImage = async () => {
        const shareOptions = {
            title: 'Share file',
            email: 'email@example.com',
            social: Share.Social.EMAIL,
            failOnCancel: false,
            urls: ['https://avatars.githubusercontent.com/u/54149309?s=40&v=4'],
        };

        try {
            const ShareResponse = await Share.open(shareOptions);
            console.log('Result =>', ShareResponse);
            setResult(JSON.stringify(ShareResponse, null, 2));
        } catch (error) {
            console.log('Error =>', error);
            setResult('error: '.concat(getErrorString(error)));
        }
    };
    function getErrorString(error, defaultValue) {
        let e = defaultValue || 'Something went wrong. Please try again';
        if (typeof error === 'string') {
            e = error;
        } else if (error && error.message) {
            e = error.message;
        } else if (error && error.props) {
            e = error.props;
        }
        return e;
    }


    const myIcon = (<MaterialCommunityIcons name="dots-vertical" size={28} />)

    if (image) {
        return (
            <Card style={styles.cardContainer}>
                <TouchableRipple
                    onPress={() => navigation.navigate('Article', { title, ...props })}
                    rippleColor={Colors.black_opacity}
                >
                    <>
                        <Image source={{ uri: image || noImageAvailable, cache: "force-cache" }} opacity={1.0} style={styles.image} />

                        <Card.Content>
                            <Headline style={styles.title} numberOfLines={3}>{title}</Headline>
                            <View style={styles.sourceAndDate}>
                                <Caption >{moment(moment.unix(created_utc)).format("MM.DD.YYYY")}</Caption>
                                <Caption numberOfLines={1} style={styles.sourceText}>{domain}</Caption>
                            </View>

                            <View style={styles.userActionRow}>
                                <View style={{ flexDirection: "row", flexWrap: "wrap" }} >

                                    <FavoriteIcon style={{ paddingRight: 5 }} article={article} color={Colors.dark_grey} />

                                    <TouchableOpacity

                                        onPress={shareEmailImage}>
                                        <AntDesign name="sharealt" size={28} />

                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{ justifyContent: "flex-end" }} >
                                    <OverflowMenu
                                        customButton={myIcon}

                                        destructiveIndex={1}
                                        options={["Block", "Report", "Cancel"]}
                                    //  actions={[blockSource, reportArticle]}
                                    />
                                </View>

                            </View>
                        </Card.Content>
                    </>
                </TouchableRipple>
            </Card>
        )
    }
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: Colors.light_green,
        alignSelf: 'center',
        borderRadius: 8,
        marginBottom: 16,
        width: '90%'
    },
    title: {
        fontSize: 18,
        lineHeight: 22,
        paddingTop: 8,
        fontWeight: '500',
        paddingBottom: 3,
        width: '90%',
        fontFamily: Fonts.OptimusBold
    },
    userActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        flexWrap: "wrap"
    },
    sourceAndDate: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    sourceText: {
        width: '50%'
    },
    image: {
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
});

export default NewsCard