import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';

function Loader({ text = 'Loading...', color = Colors.black, size = 'large', display = 'flex', align= 'center'}) {
    return (
        <View style={{ ...styles.container, display: display}}>
            <View style={{...styles.containerLoader, justifyContent: align, alignItems: align}}>
                <ActivityIndicator color={color} size={size} />
                <Text style={styles.textLoader}>{text}</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,

    },
    textLoader: {
        fontSize: 20,
        color: Colors.black,
        marginTop: 20
    }
})

export default Loader;

