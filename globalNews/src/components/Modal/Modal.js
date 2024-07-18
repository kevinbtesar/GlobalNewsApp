import React from 'react';
import { StyleSheet, Alert} from 'react-native';
import { Layout, Button, Text, ModalService, Modal, Card} from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import Colors from './../../utils/Colors';
import GLOBAL from '../../store/globalStore';


let modalID
export const showModal = (inputText, buttonText) => {
    const contentElement = renderModalContentElement(inputText, buttonText);
    modalID = ModalService.show(contentElement, { onBackdropPress: hideModal(modalID) });
    return modalID  
};

export const hideModal = (modalId) => {

    if(modalId){
        ModalService.hide(modalId);
    }
    
    // Commenting this line will force noInternetModal to stay on screen until there is a connection
    // ModalService.hide(GLOBAL.noInternetModalId); 
};

const renderModalContentElement = (displayText, buttonText) => {

    return (
        <Layout level='1'>

            <Modal visible={true} style={{height:300}} >
                <Card disabled={true} >

                    <Text>{displayText}</Text>
                    <Button onPress={() => hideModal()}>
                        {buttonText}
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