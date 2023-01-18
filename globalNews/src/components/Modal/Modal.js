import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Button, Text, ModalService, Modal, Card} from '@ui-kitten/components';
// import { Card, Headline, Caption, TouchableRipple } from 'react-native-paper';
import Colors from './../../utils/Colors';

let modalID = '';

export const showModal = () => {
    const contentElement = renderModalContentElement();
    modalID = ModalService.show(contentElement, { onBackdropPress: hideModal });
};

export const hideModal = () => {
    ModalService.hide(modalID);
};

const renderModalContentElement = () => {
    return (
        <Layout level='1'>

            <Modal visible={true} style={{height:300}} >
                <Card disabled={true} >

                    <Text>Welcome to UI Kitten </Text>
                    <Button onPress={() => hideModal()}>
                        DISMISS
                    </Button>
                </Card>
            </Modal>

        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        // display: 'flex',

        // justifyContent: 'center',
// alignSelf: 'center',
        // maxHeight: 100,
        // maxWidth:100,
        //  alignItems: "center", 
    },
    cardContainer: {
        backgroundColor: Colors.light_green,
        alignSelf: 'center',
        borderRadius: 8,
        padding:300,
        marginBottom: 16,

    },
});