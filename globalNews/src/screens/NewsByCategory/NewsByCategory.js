import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { TabNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { populateArticles } from '../../store/newsStore/newsStore.actions';
import Api from '../../utils/Api';
import { Loader, NoResults, NewsCardList, Login } from '../../components';
import { NEWS_PICKER_TYPE } from '../../utils/Enums';
import Colors from '../../utils/Colors';
import { NewsCountriesData, NewsSortTypesData } from '../../data';
import Fonts from '../../utils/Fonts';
import { TEXT_STRINGS } from '../../utils/Enums';
// import { MaterialTopTabs } from '../routes/NewsStackNavigator';

let actions = undefined;
const MaterialTopTabs = createMaterialTopTabNavigator();

class NewsByCategory extends Component 
{
    constructor(props) {
        super(props);
        console.log('props: ' + JSON.stringify(props))
        console.log('state: ' + JSON.stringify(this.state))
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
    }

    async getNewsByCategory() {
        try {
            const { route, navigation} = this.props;
            const { category } = route.params ?? '';
            const { country, sortType } = this.state;
            const news = await Api.getArticles({ category: 'general', languages: country.language, countries: country.symbol, sort: sortType.type, appName: DeviceInfo.getApplicationName() });
            if (news.error) {
                throw new Error(news.error.message);
            }   
            // const MaterialTopTabs = createMaterialTopTabNavigator();
            // console.log(JSON.stringify(news));
            newsArray = Object.keys(news['articles']).map(k => news['articles'][k]),
                this.setState({ news: newsArray });
            categoriesArray = Object.keys(news['categories']).map(k => news['categories'][k]),
                this.setState({ categories: categoriesArray, isLoading: false, error: false });


                // const components = {};
                // const screens = {};
                // const pages = [
                //     { screenName: 'Foo', componentName: 'Foo' },
                //     { screenName: 'Bar', componentName: 'Bar' },
                //   ]
                //   pages.forEach(page => {
                //     console.log('page: ' + JSON.stringify(page))
                //     screens[page.screenName] = { screen: components[page.componentName] };
                // });
                // console.log('screens: ' + JSON.stringify(screens))
                // console.log('this.props: ' + JSON.stringify(this.props))

                // this.setState({ tabs: MaterialTopTabs.Navigator(screens) });

            console.log("NewsByCat" + JSON.stringify(navigation))
               
        }
        catch (error) {
            this.setState({ news: [], categories: [], isLoading: false, error: error.toString() });
        }
    }


    selectPicker = (item) => {
        const pickerType = this.state.isModalVisible // if true - is type of picker
        switch (pickerType) {
            case NEWS_PICKER_TYPE.COUNTRIES:
                this.setState({ country: item, isModalVisible: false, isLoading: true }, this.getNewsByCategory)
                break;
            case NEWS_PICKER_TYPE.SORT:
                this.setState({ sortType: item, isModalVisible: false, isLoading: true }, this.getNewsByCategory)
                break;
            default:
                break;
        }
    }

    renderOption = ({ item, index }) => {
        const { isModalVisible, country, sortType } = this.state
        const stateItem = isModalVisible == NEWS_PICKER_TYPE.COUNTRIES ? country : sortType
        return (
            <TouchableOpacity style={styles.optionContainer} onPress={() => this.selectPicker(item)}>
                <Text style={styles.optionIcon}>{item.icon}</Text>
                <Text style={[styles.optionText, { fontWeight: item.id == stateItem.id ? '400' : '200' }]}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

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

                <Modal
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
                </Modal>

                <Login message={TEXT_STRINGS.LOGIN_HEADER} />
                

            </>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        NewsStore: state.news
    };
};

// const mapDispatchToProps = dispatch => {
//     return {
//         populateArticles: payload => dispatch(populateArticles(payload))
//     }
// }


export default connect(mapStateToProps, null)(NewsByCategory);

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