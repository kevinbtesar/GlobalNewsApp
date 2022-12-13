import React, { Component } from 'react'
import { StyleSheet, FlatList, View, TouchableOpacity, Text, } from "react-native";
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

import { Loader, NoResults, NewsCardList, Login } from '../../components';
import { NEWS_PICKER_TYPE } from '../../utils/Enums';
import Colors from '../../utils/Colors';
import { NewsCountriesData, NewsSortTypesData } from '../../data';
import Api, {getArticlesHelper} from '../../utils/Api';
import Fonts from '../../utils/Fonts';
import { TEXT_STRINGS } from '../../utils/Enums';
// import { articlesSelector } from '../../store/newsStore/newsStore.selectors';
// import { getArticles } from '../../store/newsStore/newsStore.actions';
// import GLOBAL from '../../store/globalStore';

// let actions = undefined;


class NewsByCategory extends Component 
{
    constructor(props) {
        super(props);
        // console.log('props: ' + JSON.stringify(props))
        console.log('route.name: ' + this.props.route.name)

        this.state = {
            news: [],
            categories: [],
            isLoading: true,
            error: false,
            isModalVisible: false,
            country: NewsCountriesData[0],
            sortType: NewsSortTypesData[0],
        };
        actions = props;
    }

    componentDidMount() { 
        this.getNewsByCategory();

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            console.log('route.params.subreddit HERE: ' + this.props.route.name)
        });

         // console.log("Value: " + JSON.stringify(GLOBAL.categories))
    }


    componentWillUnmount() {
        this._unsubscribe();
    }

    async getNewsByCategory() {
        try {
            const { route, navigation} = this.props;
            const { name } = route;
            // const { country, sortType } = this.state;
            // const news = await Api.getArticles({ category: ((this.props.route.name=='Loading') ? 'Home' : this.props.route.name), sort: sortType.type, appName: DeviceInfo.getApplicationName() });
            const news = await getArticlesHelper();
            if (news && news.error) {
                this.setState({ isLoading: false});
                throw new Error(JSON.stringify(news.error));
            } 

            // console.log(JSON.stringify(news['articles']));
            newsArray = Object.keys(news['articles']).map(k => news['articles'][k]),
                this.setState({ news: newsArray, isLoading: false, error: false });

            // categoriesArray = Object.keys(news['categories']).map(k => news['categories'][k]),
            //     this.setState({ categories: categoriesArray, isLoading: false, error: false });
            //     console.log("categoriesArray: " + JSON.stringify(categoriesArray));
            // newsArray = Object.keys(this.props.news['articles']).map(k => this.props.news['articles'][k]),
            //     this.setState({ news: newsArray });
            // console.log("Value: " + JSON.stringify(GLOBAL.categories))
            // store.dispatch(populateArticles(newsArray))
            // store.dispatch(populateCategories(categoriesArray))

        }
        catch (e) {
            this.setState({ news: [], categories: [], isLoading: false, error: JSON.stringify(e) });
        }
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
        const { route, navigation} = this.props;
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

                {!isLoading ? Object.keys(news).length ?
                    <NewsCardList categories={categories} news={news} navigation={navigation} route={route} />
                    :
                    <NoResults text={error || null} />
                    : <Loader />
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

                <Login message={TEXT_STRINGS.LOGIN_HEADER} />
                

            </>
        )
    }
}


const mapStateToProps = (state) => ({
    news: state.news,
    categories: state.categories
});


export default connect(mapStateToProps)(NewsByCategory);

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