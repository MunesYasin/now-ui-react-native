import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, Image, Linking, ScrollView } from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppStyles } from '../Appstyles';

export default function InformationCard(props) {

    const handleLinkingClick = async (ele) => {
        await Linking.openURL(ele);
    }


    const openGoogleMap = (coordinates) => {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = coordinates;
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&zoom=14&center=${latitude},${longitude}&basemap=satellite`;
        Linking.openURL(url);
    }
    return (
        <View style={styles.viewContainer}>
            {
                props.userDetails &&
                <View style={styles.container}>
                    <View style={styles.profileHeader}>
                        <View style={styles.profileImageWrapper}>
                            <Image
                                source={{ uri: 'https://via.placeholder.com/150' }}
                                style={styles.profileImage}
                            />
                        </View>
                        <Text style={styles.profileName}>{props.userDetails.full_name}</Text>
                    </View>
                    <View style={styles.profileSection}>
                        {
                            props.userDetails &&
                            Object.entries(props.userDetails).map(ele => {
                                if (ele[0] != "full_name" && ele[0]!= "secretQrCode" && ele[0]!= "id") {
                                    return (
                                        <View>
                                            <Text style={styles.text}>
                                                {ele[0]}
                                            </Text>
                                            {
                                                <View style={styles.sectionRow}>
                                                    {
                                                        ele[1].map(info => {

                                                            if (info.name == "map-marker") {
                                                                return (
                                                                    <MaterialIcons name="location-on" size={30} color="#900" onPress={() => openGoogleMap(info.value)} />

                                                                )
                                                            } else {

                                                                return (
                                                                    <Ionicons name={`logo-${info.name}`} size={50} style={styles.socialMediaIcon} onPress={() => handleLinkingClick(info.value)} />
                                                                )
                                                            }

                                                        })
                                                    }

                                                </View>
                                            }
                                        </View>
                                    )
                                }

                            })
                        }
                    </View>


                </View>
            }
        </View>
    )
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
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
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
        paddingTop: 20,
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

