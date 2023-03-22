

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Dimensions,
    Animated,
    useWindowDimensions,
    Button,
    AppState
} from 'react-native';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { AppStyles } from '../Appstyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useCardAnimation } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import axios from '../assets/config/axios';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Modal from 'react-native-modal';

const ProfileScreen = (props) => {
    const { current } = useCardAnimation();
    const { height } = useWindowDimensions();
    const [showspecificInfoModal, setShowspecificInfoModal] = useState(false)
    const [specificInfoValue, setSpecificInfoValue] = useState("")
    const [possibleData, setPossibleData] = useState(null)
    const [profileData, setProfileData] = useState(null)
    const [alternativeName, setAlternativeName] = useState("")
    //----------------------------------------------------------------------------------------//


    const DismissKeyboard = ({ children }) => (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
    );




    useEffect(() => {
        let params = {}
        axios.post("/getAllPossibleData", params).then(res => {
            setPossibleData(res.data)
        }).catch(error => {
            console.log(error)
        })

        let params2 = {}
        axios.post("/getUserBean", params2).then(res => {
            setProfileData(res.data)
        }).catch(error => {
            console.log(error)
        })

    }, [])


    useEffect(() => {
        if (showspecificInfoModal && showspecificInfoModal.split(".")[1] == "map-marker") {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    // Handle permission denied
                    return;
                }

                let { coords } = await Location.getCurrentPositionAsync({});
                setSpecificInfoValue({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            })();
        } else if (showspecificInfoModal) {
            setAlternativeName(showspecificInfoModal.split(".")[1])
        }
    }, [showspecificInfoModal])


    const handleSaveValue = () => {
        if (!specificInfoValue || !alternativeName) return
        let params = {
            category: showspecificInfoModal.split(".")[0],
            name: showspecificInfoModal.split(".")[1],
            alternativeName: alternativeName,
            value: specificInfoValue,
            show: true,
        }
        axios.put(`/addToUserBean`, params).then(res => {
            handleCloseSpecificInfoModal()
        }).catch(error => {
            console.log(error)
        })
    }

    const handleCloseSpecificInfoModal = () => {
        setSpecificInfoValue("")
        setShowspecificInfoModal(false)
        setAlternativeName("")
    }




    // -----------------------------------------------------------------------------------------------------------


    const [address, setAddress] = useState('');

    const handleSearch = async () => {
        try {
            const response = await Geocoder.from(address);
            const { lat, lng } = response.results[0].geometry.location;
            setSpecificInfoValue({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        } catch (error) {
            console.error(error);
        }
    };
    // ----------------------------------------------------------------------------------------------------------
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <>
            <DismissKeyboard>
                <ScrollView>


                    <View style={styles.container}>

                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('App')
                        }}>
                            <Icon name={`chevron-left`} size={30} style={styles.socialMediaIcon} />


                        </TouchableOpacity>



                        {
                            possibleData && Object.entries(possibleData).map(ele => {

                                return (
                                    <View>
                                        <Text style={{ ...styles.text, paddingTop: 10 }}>
                                            {ele[0]}
                                        </Text>
                                        {
                                            console.log(ele)
                                        }
                                        {ele[1].map(info => {
                                            return (
                                                <TouchableOpacity style={styles.blockContainer} onPress={() => {
                                                    setShowspecificInfoModal(`${ele[0]}.${info}`)
                                                    setIsModalVisible(true)
                                                }}>
                                                    <View style={styles.iconContainer}>
                                                        <View style={styles.iconAndNameDiv}>
                                                            <Icon name={`${info}`} size={30} style={styles.socialMediaIcon} />
                                                            <Text style={styles.text}>{info}</Text>
                                                        </View>
                                                        <View style={styles.addDiv}>
                                                            <Text style={{ ...styles.text }}>Add</Text>
                                                        </View>
                                                    </View>

                                                </TouchableOpacity>
                                            )
                                        })}



                                    </View>
                                )


                            })
                        }


                    </View>
                </ScrollView>

            </DismissKeyboard>

            {
                showspecificInfoModal &&


                <Modal
                    isVisible={isModalVisible}
                    onSwipeComplete={() => handleCloseSpecificInfoModal()}
                    swipeDirection={['down']}
                    style={styles.modal}
                    animationType="slide"
                    transparent={true}
                    animationDuration={100}
                >
                    <View style={styles.viewContainer}>

                        <>

                            {showspecificInfoModal.split(".")[1] == "map-marker" ?


                                <View style={{ flex: 1, height: 20 }}>
                                    <View style={styles.titleDiv}>
                                        <TouchableOpacity onPress={() => {
                                            handleCloseSpecificInfoModal()
                                        }}>
                                            <Icon name={`times`} size={30} style={styles.socialMediaIcon} />

                                        </TouchableOpacity>
                                        <View>
                                            <Text style={styles.titleText}>
                                                {showspecificInfoModal.split(".")[1]}
                                            </Text>
                                        </View>
                                        <View>

                                        </View>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text>Alternative name</Text>

                                        <TextInput
                                            style={styles.inputField}
                                            value={alternativeName}
                                            onChangeText={(e) => {
                                                setAlternativeName(e)
                                            }}
                                        />
                                    </View>
                                    {
                                        specificInfoValue &&
                                        <>

                                            <MapView style={styles.map} initialRegion={specificInfoValue} onPress={(event) => {
                                                const { latitude, longitude } = event.nativeEvent.coordinate;
                                                setSpecificInfoValue({
                                                    latitude,
                                                    longitude,
                                                    latitudeDelta: specificInfoValue.latitudeDelta,
                                                    longitudeDelta: specificInfoValue.longitudeDelta,
                                                })
                                            }}>
                                                <Marker coordinate={specificInfoValue} title="My Location" />
                                            </MapView>

                                        </>
                                    }
                                </View>


                                :
                                <>
                                    <View style={styles.titleDiv}>
                                        <TouchableOpacity onPress={() => {
                                            handleCloseSpecificInfoModal()
                                        }}>
                                            <Icon name={`times`} size={30} style={styles.socialMediaIcon} />

                                        </TouchableOpacity>
                                        <View>
                                            <Text style={styles.titleText}>
                                                {showspecificInfoModal.split(".")[1]}
                                            </Text>
                                        </View>
                                        <View>

                                        </View>
                                    </View>



                                    <View style={styles.iconDivInModal}>
                                        <Icon name={showspecificInfoModal.split(".")[1]} size={30} style={styles.socialMediaIcon} />

                                        <Text>
                                            {alternativeName}
                                        </Text>

                                    </View>


                                    <View style={styles.inputContainer}>
                                        <Text>Value</Text>

                                        <TextInput
                                            style={styles.inputField}
                                            value={specificInfoValue}
                                            onChangeText={(e) => {
                                                setSpecificInfoValue(e)
                                            }}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text>Alternative name</Text>

                                        <TextInput
                                            style={styles.inputField}
                                            value={alternativeName}
                                            onChangeText={(e) => {
                                                setAlternativeName(e)
                                            }}
                                        />
                                    </View>



                                </>
                            }

                            <View >
                                <View >
                                    <TouchableOpacity
                                        style={styles.saveButton}
                                        onPress={() => {

                                            handleSaveValue()
                                        }
                                        }>
                                        <Text style={styles.saveButtonText}>Save Value</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* <TouchableOpacity style={styles.saveButton} onPress={handleCloseSpecificInfoModal}>
                                <Text style={styles.saveButtonText}>Cancel</Text>
                            </TouchableOpacity> */}
                        </>


                    </View>

                </Modal>

            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50
    },
    // socialMediaIcon:{
    //     color:"#6ac6fc"
    // },
    modal: {
        width: "100%",
        margin: 0,
        marginTop: 75,

    },
    titleDiv: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 50
    },
    iconDivInModal: {
        backgroundColor: "#DCDCDC",
        maxHeight: 150,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"

    },
    iconAndNameDiv: {
        flexDirection: 'row',
        alignItems: "center",
        width: "75%"
    },

    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    addDiv: {
        // width: 30,
        borderRadius: 30,
        backgroundColor: "#DCDCDC",
        height: 30,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"

    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    map: {
        flex: 1,
        width: '100%',
        // height: "20%"
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,

    },
    viewAnimated: {
        width: '100%',
    },
    viewContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#E5E5E5',
        borderRadius: 20,
    },

    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    basicInfoContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 10,
    },
    inputField: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
    },
    socialMediaContainer: {
        marginBottom: 20,
    },
    socialMediaInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    socialMediaInputField: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: AppStyles.color.tint,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        ...AppStyles.buttonShadow
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    blockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginLeft: 20,
        justifyContent: "space-between",
        backgroundColor: "#e8e8e8",
        height: 50,
        borderRadius: 15,
        paddingLeft: 20,
        paddingRight: 20
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%"
    },
    icon: {
        width: 30,
        height: 30,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 18,
        // fontWeight: 'bold',
        marginHorizontal: 10,
    },
    toggleButton: {
        borderRadius: 10,
        backgroundColor: '#DDD',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
    },
    toggleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;