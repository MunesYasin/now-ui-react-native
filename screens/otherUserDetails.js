import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, Image, Linking, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from '../assets/config/axios';
import { Modal, TouchableHighlight, Dimensions } from 'react-native';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import {
    Animated,
    Pressable,
    useWindowDimensions,
} from 'react-native';
import { useCardAnimation } from '@react-navigation/stack';
import { AppStyles } from '../Appstyles';

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
            setShowDetailsModal(false)

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
                    {/* <Pressable
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            ]}
            onPress={navigation.goBack}
          /> */}
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

                            <View style={styles.viewContainer}>
                                {
                                    userDetails &&
                                    <View style={styles.container}>
                                        <View style={styles.profileHeader}>
                                            <View style={styles.profileImageWrapper}>
                                                <Image
                                                    source={{ uri: 'https://via.placeholder.com/150' }}
                                                    style={styles.profileImage}
                                                />
                                            </View>
                                            <Text style={styles.profileName}>{userDetails.personalInfo && userDetails.personalInfo.name}</Text>
                                        </View>
                                        <View style={styles.profileSection}>


                                            {/* ----------------------------------Personal Info section-------------------------------- */}
                                            {
                                                userDetails.personalInfo &&
                                                userDetails.personalInfo.map(ele => {
                                                    return (
                                                        <>
                                                            <View style={styles.sectionRow}>
                                                                <Ionicons name="mail-outline" size={24} style={styles.sectionIcon} />
                                                                <Text style={styles.sectionLabel}>{ele.name}:</Text>
                                                                <Text style={styles.sectionValue}>{ele.value}</Text>
                                                            </View>
                                                        </>
                                                    )
                                                })
                                                // <>

                                                //   <View style={styles.sectionRow}>
                                                //     <Ionicons name="mail-outline" size={24} style={styles.sectionIcon} />
                                                //     <Text style={styles.sectionLabel}>Email:</Text>
                                                //     <Text style={styles.sectionValue}>{userDetails.personalInfo.email}</Text>
                                                //   </View>
                                                //   <View style={styles.sectionRow}>
                                                //     <Ionicons name="call-outline" size={24} style={styles.sectionIcon} />
                                                //     <Text style={styles.sectionLabel}>Phone:</Text>
                                                //     <Text style={styles.sectionValue}>{userDetails.personalInfo.phoneNumber}</Text>
                                                //   </View>
                                                //   <View style={styles.sectionRow}>
                                                //     <Ionicons name="location-outline" size={24} style={styles.sectionIcon} />
                                                //     <Text style={styles.sectionLabel}>Location:</Text>
                                                //     <Text style={styles.sectionValue}>{userDetails.personalInfo.location}</Text>
                                                //   </View>
                                                // </>
                                            }
                                            {/* ----------------------------------Personal Info section-------------------------------- */}


                                            {/* ----------------------------------Social media section-------------------------------- */}
                                            {
                                                userDetails.socilaMedia &&
                                                <View style={styles.sectionRow}>

                                                    {
                                                        userDetails.socilaMedia.map(ele => {
                                                            return (
                                                                <Ionicons name={`logo-${ele.name}`} size={50} style={styles.socialMediaIcon} onPress={() => handleLinkedInClick(ele)} />
                                                            )
                                                        })
                                                    }
                                                </View>
                                            }
                                            {/* ----------------------------------Social media section-------------------------------- */}


                                        </View>
                                        <TouchableOpacity style={styles.saveButton} onPress={handleDeleteUser}>
                                            <Text style={styles.saveButtonText}>Delete user</Text>
                                        </TouchableOpacity>

                                    </View>
                                }
                            </View>
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
        // backgroundColor: '#E5E5E5',
        borderRadius: 20,
    },

    profileHeader: {
        marginTop: -400,
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImageWrapper: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    profileSection: {
        borderTopWidth: 1,
        borderTopColor: '#DDD',
        paddingTop: 20,
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 5,
        justifyContent: "space-evenly"
    },
    sectionIcon: {
        marginRight: 10,
    },
    socialMediaIcon: {
        marginRight: 10,
        color: '#3b5998',
    },
    sectionLabel: {
        flex: 1,
        fontSize: 18,
    },
    sectionValue: {
        flex: 3,
        fontSize: 18,
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
