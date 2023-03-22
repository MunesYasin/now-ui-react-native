import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, Image, Linking, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from '../assets/config/axios';
import { Modal, TouchableHighlight, Dimensions } from 'react-native';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import InformationCard from "../components/informationCard"
import {
    Animated,
    Pressable,
    useWindowDimensions,
} from 'react-native';
import { useCardAnimation } from '@react-navigation/stack';
import { AppStyles } from '../Appstyles';
const { width, height } = Dimensions.get('window');
function ScanQR(props) {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [userDetails, setUserDetails] = useState(null)


    const { height } = useWindowDimensions();
    const { current } = useCardAnimation();


    useEffect(() => {

        let params = {
            // secretQrCode: data,
            id: props.selected_user_id,
            categouries: props.selected_user_categouries

        }
        axios.post("/getUserBeanFromUserID", params).then(res => {
            setShowDetailsModal(true)
            setUserDetails(res.data)
        }).catch(error => {
            alert(error);

        })
    }, [])



    const handleLinkedInClick = async (ele) => {
        await Linking.openURL(ele.value);
    }

    const handleDeleteUser = () => {
        let params = {
            id: props.selected_user_id,
        }
        axios.post("/deleteUserFromMyList", params).then(res => {
            props.navigation("Home")

        }).catch(error => {
            console.log(error)
        })
    }
    return (
        <View style={styles.container}>
            <ScrollView>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

                    <Animated.View
                        style={[
                            {
                                height: height,
                                // transform: [
                                //     {
                                //         translateY: current.progress.interpolate({
                                //             inputRange: [0, 1],
                                //             outputRange: [height, height * 0],
                                //             extrapolate: 'clamp',
                                //         }),
                                //     },
                                // ],
                            },
                            styles.viewAnimated,
                        ]}>
                        {
                            showDetailsModal &&
                            <>
                                <InformationCard userDetails={userDetails}/>
                                <TouchableOpacity style={styles.saveButton} onPress={handleDeleteUser}>
                                    <Text style={styles.saveButtonText}>Delete user</Text>
                                </TouchableOpacity>
                            </>
                        }
                    </Animated.View>
                </View>
            </ScrollView>
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    viewAnimated: {
      width: '100%',
    },
    saveButton: {
      backgroundColor: AppStyles.color.tint,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    viewContainer: {
      flex: 1,
      padding: 10,
      borderRadius: 20,
    },
  
    profileHeader: {
      marginTop: -height * 0.4,
      alignItems: 'center',
      marginBottom: height * 0.03,
    },
    profileImageWrapper: {
      width: width * 0.4,
      height: width * 0.4,
      borderRadius: (width * 0.4) / 2,
      overflow: 'hidden',
    },
    profileImage: {
      width: '100%',
      height: '100%',
    },
    profileName: {
      fontSize: width * 0.06,
      fontWeight: 'bold',
      marginTop: height * 0.01,
    },
    profileSection: {
      borderTopWidth: 1,
      borderTopColor: '#DDD',
      paddingTop: height * 0.02,
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: height * 0.01,
      marginTop: height * 0.005,
      justifyContent: 'space-evenly',
    },
    sectionIcon: {
      marginRight: width * 0.03,
    },
    socialMediaIcon: {
      marginRight: width * 0.03,
      color: '#3b5998',
    },
    sectionLabel: {
      flex: 1,
      fontSize: width * 0.045,
    },
    sectionValue: {
      flex: 3,
      fontSize: width * 0.045,
      fontWeight: 'bold',
    },
  });
const mapStateToProps = state => ({

    selected_user_id: state.selected_user_id,
    selected_user_categouries: state.selected_user_categouries
});

const mapDispatchToProps = dispatch => ({
    selectUser: value => dispatch({ type: 'select_user_from_my_list', payload: value })
});

export default connect(mapStateToProps, mapDispatchToProps)(ScanQR);
