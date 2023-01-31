import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, ActivityIndicator, Platform, BackHandler, Dimensions } from "react-native";
// import { Card, Title, Subheading, Caption } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import Device from 'react-native-device-info';
import Snackbar from 'react-native-snackbar';

import Colors from '../../utils/Colors';
// import { FavoriteIcon, Login } from '../../components';
// import { capitalizeFirstLetter } from '../../utils/Tools';
import Fonts from '../../utils/Fonts';
// import { TEXT_STRINGS } from '../../utils/Enums';
import { showSnackbar } from '../../components/Snackbar/SnackbarComponent';
import GLOBAL from '../../store/globalStore';

import { createClient } from '@supabase/supabase-js'

const Article = (props) => {
    const { route, navigation } = props
    const { title, description, image_url, source, category, created_utc, author, reddit_article_id, url } = route.params
    const [currentURI, setURI] = useState(url);
    const isTablet = Device.isTablet();
    const webViewRef = useRef(null)
    // let article = { title: title, reddit_article_id: reddit_article_id }
    canGoBack = false
    canGoForward = false
    // console.log("props: " + route.name)
    // console.log("props: " + JSON.stringify(props.navigation))
    // console.log("route: " + JSON.stringify(route))
    // console.log("source: " + source)

    const onAndroidBackPress = () => {
        // console.log("onAndroidBackPress canGoBack: " + canGoBack)
        // console.log("onAndroidBackPress canGoForward: " + canGoForward)
        // console.log("webViewRef.current: " + JSON.stringify(webViewRef.current))
        if ( webViewRef.current && canGoBack ) {
            // console.log("HERE0  current: " + JSON.stringify(webViewRef.current))
            webViewRef.current.goBack();
            return true; // prevent default behavior (exit app)
        } else {
            // console.log("HERE2")
            return false;
        }
    };

    useEffect(() => 
    {
        if (Platform.OS === 'android') {
                BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
            };
        }

        
    }, [])



    return ( <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
        <WebView
            // ref={(ref) => GLOBAL.webviewRef = ref}
            ref={webViewRef}
            source={{ uri: url }}
            userAgent="Mozilla/5.0 (Linux; Android 4.4.4; One Build/KTU84L.H4) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/28.0.0.20.16;]"
            decelerationRate='normal'
            allowsInlineMediaPlayback={true}                    
            mediaPlaybackRequiresUserAction={false}
            sharedCookiesEnabled={true}
            style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
            mixedContentMode='always'
            startInLoadingState={true}
            textInteractionEnabled={false}
            setSupportMultipleWindows={false}
            automaticallyAdjustContentInsets={true}
            containerStyle={{ marginTop: isTablet ? -100 : -90 }}  // pushes other website's nav bar off the screen
            renderLoading={() => (
                <ActivityIndicator
                    color='#29aae1'
                    size='large'
                    style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center',}}
                />
            )}
            onMessage={(event) => {
                alert(event.nativeEvent.data);
            }}
    
            onContentProcessDidTerminate={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('Content process terminated, reloading', nativeEvent);
                webViewRef.current.reload();
            }}
            
            // Only allow navigating within this website
            originWhitelist={["http", "https"]}
            onNavigationStateChange={navState => {
                console.log('navState HERE: ' + JSON.stringify(navState))
                GLOBAL.webviewRef = webViewRef
                
                // Keep track of going back navigation within component
                canGoBack = navState.canGoBack
                canGoForward = navState.canGoForward
                // console.log('canGoBack: ' + canGoBack)
                // console.log('canGoForward: ' + canGoForward)
            }}
            onShouldStartLoadWithRequest={(request) => {
                console.log('request HERE: ' + JSON.stringify(request))
                console.log('request.url: ' + request.url)
                console.log('url: ' + url)
                console.log('currentURI: ' + currentURI)
                // let domain = extractRootDomain(url)
                // console.log('domain: ' + domain)

                // Only allow navigating within this website
                // if (request.url.includes(source)) { // too lenient 
                // if ((request.url === currentURI && request.url.startsWith(url)) || request.url.includes('redirect')) return true; // too strict. wasnt allowing adding query params
                if ( request.url.startsWith(url) || request.url.includes('redirect'))  return true;
               
                else {
                    // We're loading a new URL -- change state first
                    setURI(request.url)
                    showSnackbar('Cannot change from source URL', Snackbar.LENGTH_LONG)

                    if(request.lockIdentifier && !request.canGoBack && !request.canGoForward && request.loading){
                        navigation.goBack()
                    } 
                    
                    return false;
                }
            }}
        />

</View>

        
        //  <ScrollView style={styles.container}> 
        //     <Card.Content>
        //         <View style={styles.titleLine}>
        //             <Title style={styles.title} >{title}</Title>
        //             <FavoriteIcon article={article} style={styles.favoriteIcon} />
        //         </View>
        //         <Caption style={styles.subtitles}>{`Source: ${source}`}</Caption>
                
        //         <View style={styles.sourceAndDate}>
        //         <Caption style={styles.subtitles}>{moment(created_utc).format("DD.MM.YYYY")}</Caption>
        //             <Caption style={styles.subtitles}>{`Category: ${capitalizeFirstLetter(category)}`}</Caption>
                    
        //         </View>
        //         {image_url ? <Card.Cover source={{ uri: image_url }} style={styles.image} /> : <React.Fragment />}
        //         {description ? <Subheading style={styles.description}>{description}</Subheading> : <React.Fragment />}
        //     </Card.Content>
        // </ScrollView> 


    )

    function extractHostname(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname
      
        if (url.indexOf("//") > -1) {
          hostname = url.split('/')[2];
        } else {
          hostname = url.split('/')[0];
        }
      
        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];
      
        return hostname;
      }
      function extractRootDomain(url) {
        var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;
      
        //extracting the root domain here
        //if there is a subdomain
        if (arrLen > 2) {
          domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
          //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
          if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
          }
        }
        return domain;
      }

}



export default Article

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        padding: 12
    },
    cardContainer: {
        flex: 1,
    },
    title: {
        fontSize: 23,
        lineHeight: 26,
        paddingTop: 14,
        paddingBottom: 8,
        fontFamily: Fonts.OptimusBold,
        width: '90%',
    },
    titleLine: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    sourceAndDate: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    image: {
        marginVertical: 20,
    },
    subtitles: {
        fontFamily: Fonts.Optimus,
        fontSize: 14
    },
    description: {
        fontFamily: Fonts.Optimus,
        fontSize: 20
    },
    favoriteIcon: {
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, .3)',
        zIndex: 9,
        padding: 7,
        marginTop: 15
    }
});