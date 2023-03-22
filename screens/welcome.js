import React from 'react';
import { ImageBackground, Image, StyleSheet, StatusBar, Dimensions, Platform, FlatList, Linking } from 'react-native';
import { AppStyles } from '../Appstyles';
import {
    ActivityIndicator,
    Text,
    View,
    Alert,
    TouchableOpacity,
} from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';

import Hyperlink from "react-native-hyperlink"
const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants/';
import { HeaderHeight } from '../constants/utils';

export default class Onboarding extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null
        }
    }

    componentDidMount() {
        const getToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token !== null) {
                    this.setState({ token: token })
                }
            } catch (error) {
                console.log(error);
            }
        };
        getToken()
    }
    render() {
        const { navigation } = this.props;
        const images = [
            { id: 1, uri: require("../assets/imgs/profile-img.jpg") },
            { id: 2, uri: require("../assets/imgs/profile-img.jpg") },
            { id: 3, uri: require("../assets/imgs/profile-img.jpg") },
            { id: 4, uri: require("../assets/imgs/profile-img.jpg") },
            { id: 5, uri: require("../assets/imgs/profile-img.jpg") },
        ];
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcom to App !</Text>
                <Image source={require("../assets/imgs/profile-img.jpg")} />
                <Text style={styles.brief}>breif about app !</Text>


                <View style={[
                    styles.container,
                    {
                        flexDirection: "row",
                        // height:10
                    },
                ]}>
                    {
                        images.map(ele => {
                            return (
                                <Image
                                    style={{
                                        width: 50,
                                        height: 50,
                                        marginRight: 10,
                                        marginLeft: 10

                                    }}
                                    source={ele.uri} />
                            )
                        })
                    }

                </View>
                <View style={styles.terms}>

                    <Text style={styles.terms} onPress={() => Linking.openURL('http://google.com')}>Terms and conditions </Text>
                </View>

                <TouchableOpacity
                    style={styles.loginContainer}
                    onPress={() => {
                        // this.state.token ?
                        //     navigation.navigate('App')

                        //     :
                            navigation.navigate('Onboarding')

                    }}>
                    <Text style={styles.loginText}>Agree and continue</Text>
                </TouchableOpacity>

            </View>
        );
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 150,
    },
    logo: {
        width: 200,
        height: 200,
    },
    title: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: 'bold',
        color: AppStyles.color.tint,
        marginTop: 200,
        textAlign: 'center',
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    brief: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: 'bold',
        color: AppStyles.color.tint,
        marginTop: 20,
        textAlign: 'center',
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    terms: {
        marginTop: 0,
        fontSize: 20,
        // fontWeight: 'bold',
        color: "blue",
        borderBottomColor: "blue",
        borderBottomWidth: 1
    },
    loginContainer: {
        alignItems: 'center',
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.tint,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30,
    },
    loginText: {
        color: AppStyles.color.white,
    },
    signupContainer: {
        alignItems: 'center',
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.white,
        borderRadius: AppStyles.borderRadius.main,
        padding: 8,
        borderWidth: 1,
        borderColor: AppStyles.color.tint,
        marginTop: 15,
    },
    signupText: {
        color: AppStyles.color.tint,
    },
    spinner: {
        marginTop: 200,
    },
});


