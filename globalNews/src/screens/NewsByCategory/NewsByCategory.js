import React, { Component } from 'react'
import { StyleSheet, /*FlatList, View, TouchableOpacity, Text,*/ } from "react-native";
import { connect, mapStateToProps } from 'react-redux';
// import Modal from 'react-native-modal';

import { Loader, NewsCardList, Login } from '../../components';
// import { NEWS_PICKER_TYPE } from '../../utils/Enums';
import Colors from '../../utils/Colors';
// import { NewsCountriesData, NewsSortTypesData } from '../../data';
import Fonts from '../../utils/Fonts';
import { TEXT_STRINGS } from '../../data/Enums';
// import GLOBAL from '../../store/globalStore';
// import { getArticlesHelper } from '../../utils/Api';

class NewsByCategory extends Component {
    constructor(props) {
        super(props);
        // console.log('props: ' + JSON.stringify(props))
        // console.log('navigation: ' + JSON.stringify(props.navigation.getState()))
        // console.log('route.name: ' + this.props.route.name)

        this.state = {
            news: [],
            categories: [],
            favorites: [],
            isLoading: true,
            error: false,
            isModalVisible: false,
            // country: NewsCountriesData[0],
            // sortType: NewsSortTypesData[0],
        };
        actions = props;

    }

    componentDidMount() {

        // this.getNewsByCategory();
        this.setState({ isLoading: false })

        this._unsubscribeFocus = this.props.navigation.addListener('focus', () => {
        //     console.log('NewsByCategory this.props.route.name HERE: ' + this.props.route.name)
            this.setState({ isLoading: false })
        });

        // console.log("Value: " + JSON.stringify(GLOBAL.categories))
    }

    componentWillUnmount() {
        this._unsubscribeFocus();
    }

    componentDidUpdate(prevProps) {
        console.log("componentDidUpdate prevProps: " + JSON.stringify(prevProps))
    }

    async getNewsByCategory() {
        // try {
        // const { route, navigation } = this.props;
        // const { name } = route;
        // const { country, sortType } = this.state;
        // console.log('navigation.getState(): ' + navigation.getState().history.length)
        // console.log('name: ' + name)

        // if(navigation.getState().history.length==1){
        // const news = await getArticlesHelper();


        // const news = await getArticlesHelper(name);
        // console.log(JSON.stringify(news));
        // console.log(news.articles);
        // console.log("name: " + name && name != 'Loading' ? name : 'Home');
        // console.log(JSON.stringify(news['categories']));
        //     // console.log(JSON.stringify(news));
        //     if (news && news['articles']) {

        //         categoriesArray = Object.keys(news['categories']).map(k => news['categories'][k]),
        //             this.setState({ categories: categoriesArray, isLoading: false, error: false });
        //         newsArray = Object.keys(news['articles']).map(k => news['articles'][k]),
        //             this.setState({ news: newsArray, isLoading: false, error: false });

        //         // console.log("categoriesArray: " + JSON.stringify(categoriesArray));
        //         this.setState({ isLoading: false, error: false });

        //     } else if (news && news.error) {
        //         throw new Error(news.error);
        //     } else {
        //         throw new Error("There was an issue getting article data");
        //     }
        // }



        // this.setState({ isLoading: false, error: false });


        // }
        // catch (e) {
        //     this.setState({ news: [], isLoading: false, error: JSON.stringify(e) });
        // }
    }


    // selectPicker = (item) => {
    //     const pickerType = this.state.isModalVisible // if true - is type of picker
    //     switch (pickerType) {
    //         case NEWS_PICKER_TYPE.COUNTRIES:
    //             this.setState({ country: item, isModalVisible: false, isLoading: true }, this.getNewsByCategory)
    //             break;
    //         case NEWS_PICKER_TYPE.SORT:
    //             this.setState({ sortType: item, isModalVisible: false, isLoading: true }, this.getNewsByCategory)
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // renderOption = ({ item, index }) => {
    //     const { isModalVisible, country, sortType } = this.state
    //     const stateItem = isModalVisible == NEWS_PICKER_TYPE.COUNTRIES ? country : sortType
    //     return (
    //         <TouchableOpacity style={styles.optionContainer} onPress={() => this.selectPicker(item)}>
    //             <Text style={styles.optionIcon}>{item.icon}</Text>
    //             <Text style={[styles.optionText, { fontWeight: item.id == stateItem.id ? '400' : '200' }]}>{item.name}</Text>
    //         </TouchableOpacity>
    //     )
    // }

    render() {
        const { news, categories, isLoading, isModalVisible, country, sortType, error } = this.state
        const { route, navigation } = this.props;
        return (
            <>

                {/* <View style={styles.pickersLine}>
                    <TouchableOpacity style={styles.pickerButton} onPress={() => this.setState({ isModalVisible: NEWS_PICKER_TYPE.COUNTRIES })}>
                        <Text style={styles.pickerText}>{`${country.icon} ${country.name}`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pickerButton} onPress={() => this.setState({ isModalVisible: NEWS_PICKER_TYPE.SORT })}>
                        <Text style={styles.pickerText}>{`${sortType.icon} ${sortType.name}`}</Text>
                    </TouchableOpacity>
                </View> */}

                {/* {!isLoading ? Object.keys(news).length ?
                    <NewsCardList categories={categories} news={news} state={this.state} navigation={navigation} route={route} />
                    :
                    <NoResults text={error || null} />
                    : <Loader />
                } */}

                {!isLoading ?
                    <NewsCardList categories={categories} news={news} state={this.state} navigation={navigation} route={route} />
                    :
                    <Loader />
                }

                {/* <Modal
                    isVisible={!!isModalVisible}
                    onRequestClose={() => this.setState({ isModalVisible: false })}
                    onBackdropPress={() => this.setState({ isModalVisible: false })}
                >
                    <View style={styles.modalHolder}>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => this.setState({ isModalVisible: false })}>
                            <Text style={styles.modalCloseIcon}>𝖷</Text>
                        </TouchableOpacity>
                        <View style={styles.modalHolderHeader}>
                            <Text style={styles.modalHeaderTitle}>{isModalVisible == NEWS_PICKER_TYPE.COUNTRIES ? 'Select country news' : 'Select sort type'}</Text>
                        </View>
                        <FlatList
                            style={styles.filtersListHolder}
                            data={isModalVisible == NEWS_PICKER_TYPE.COUNTRIES ? NewsCountriesData : NewsSortTypesData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderOption}
                        />
                    </View>
                    </Modal> */}

                <Login message={TEXT_STRINGS.LOGIN_FOR_FAVORITES} />


            </>
        )
    }
}



// const mapStateToProps = (state) => ({
//     news: state.news,
//     categories: state.categories
// });


export default connect(mapStateToProps)(NewsByCategory);
// export default (NewsByCategory);

const styles = StyleSheet.create({
    pickersLine: {
        paddingTop: 10,
        paddingBottom: 8,
        borderBottomWidth: .3,
        borderBottomColor: Colors.grey_green,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    pickerButton: {
        flex: 0.42,
        borderColor: Colors.black_opacity,
        backgroundColor: Colors.off_white,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderRadius: 4,
        paddingVertical: 5,
    },
    pickerText: {
        fontSize: 16,
        fontFamily: Fonts.KBWriterThin,
        textAlign: 'center'
    },
    modalHolder: {
        backgroundColor: Colors.off_white,
        borderRadius: 5,
        overflow: 'hidden',
        paddingTop: 10
    },
    modalHolderHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey_green,
        paddingVertical: 15,
    },
    modalHeaderTitle: {
        fontWeight: '500',
        color: Colors.black,
        fontSize: 22,
        lineHeight: 26,
        fontFamily: Fonts.KBWriter,
    },
    modalCloseButton: {
        position: 'absolute',
        alignItems: 'center',
        borderRadius: 4,
        top: 10,
        left: 0,
        width: 42,
        height: 42,
        backgroundColor: Colors.off_white,
        zIndex: 9
    },
    modalCloseIcon: {
        color: Colors.grey_green,
        fontSize: 24
    },
    filtersListHolder: {
        flex: 0,
        backgroundColor: Colors.off_white
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 46,
        paddingHorizontal: 8,
        backgroundColor: Colors.off_white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey_green,
        // marginBottom: 10,
    },
    optionIcon: {
        color: Colors.black,
        fontSize: 28,
        paddingHorizontal: 10,
    },
    optionText: {
        color: Colors.black,
        fontSize: 22,
        fontFamily: Fonts.KBWriterThin
    },
});