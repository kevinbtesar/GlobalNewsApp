import Share from 'react-native-share';

/**
 * Share Logic
 * ref: https://github.com/react-native-share/react-native-share
 */


export const initializeShare = async (title, url) => {
    // console.log("HEREE")
    const shareOptions = {
        title: title,
        failOnCancel: false,
        urls: [url],
    };
    
    try {
        const shareResponse = await Share.open(shareOptions);
        console.log('Result =>', shareResponse);
    } catch (error) {
        console.log('Error =>', error);
    }
};
