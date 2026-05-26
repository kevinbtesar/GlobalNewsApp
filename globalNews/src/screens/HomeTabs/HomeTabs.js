import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Loader, LoginModal, NewsCardList } from '../../components';
import { categoriesSelector } from '../../store/newsStore/newsStore.selectors';
import { TEXT_STRINGS } from '../../data/Enums';
import Colors from '../../utils/Colors';
import { getArticlesHelper } from '../../utils/Api';

const HomeTabs = ({ navigation }) => {
    const categories = useSelector(categoriesSelector) || [];
    const [loading, setLoading] = useState(categories.length === 0);
    const categoryNames = useMemo(
        () => categories.map(c => c?.title).filter(Boolean),
        [categories]
    );
    const effectiveTabs = categoryNames.length ? categoryNames : ['All'];
    const [activeCategory, setActiveCategory] = useState(effectiveTabs[0]);

    React.useEffect(() => {
        if (!effectiveTabs.includes(activeCategory)) {
            setActiveCategory(effectiveTabs[0]);
        }
    }, [effectiveTabs, activeCategory]);

    React.useEffect(() => {
        let mounted = true;
        if (categories.length === 0) {
            getArticlesHelper()
                .catch(() => null)
                .finally(() => {
                    if (mounted) setLoading(false);
                });
        } else {
            setLoading(false);
        }
        return () => {
            mounted = false;
        };
    }, [categories.length]);

    if (loading) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabRow}
                >
                    {effectiveTabs.map((name) => {
                        const active = name === activeCategory;
                        return (
                            <TouchableOpacity
                                key={name}
                                onPress={() => setActiveCategory(name)}
                                style={[styles.tab, active && styles.tabActive]}
                            >
                                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                                    {name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <NewsCardList
                route={activeCategory === 'All' ? undefined : { name: activeCategory }}
                navigation={navigation}
            />
            <LoginModal message={TEXT_STRINGS.LOGIN_FOR_FAVORITES} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabRow: {
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 6,
        backgroundColor: Colors.off_white,
        alignItems: 'center',
    },
    tabBar: {
        minHeight: 52,
        maxHeight: 52,
        backgroundColor: Colors.off_white,
        justifyContent: 'center',
    },
    tab: {
        borderWidth: 1,
        borderColor: Colors.black_opacity,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        backgroundColor: Colors.off_white,
    },
    tabActive: {
        backgroundColor: Colors.yellow,
    },
    tabText: {
        color: Colors.black,
        fontSize: 13,
        fontWeight: '600',
    },
    tabTextActive: {
        color: Colors.black_opacity,
    },
});

export default HomeTabs;
