import React, { Component } from 'react';

import { StyleSheet, Platform, Image, TouchableOpacity, YellowBox, Dimensions, View, AsyncStorage } from 'react-native';
import { Text, Icon, Item } from 'native-base';

import { DrawerNavigator } from 'react-navigation';

import { StackNavigator } from 'react-navigation';

import MapPage from '../Screens/MapPage';
import Connexion from '../Screens/Connexion';
import Admin from '../Screens/Admin';
import MonCompte from '../Screens/MonCompte';
import Globals from '../Globals';

export default class CustomSideMenu extends Component {

    state = {
        currentPage: '',
        reload: false
    }

    constructor(props) {
        super(props)
    }

    UNSAFE_componentWillReceiveProps({ goal }) {
        this.setState(prevState => ({
            reload: !prevState.reload
        }));
    }

    async componentDidMount() {
        await Expo.Font.loadAsync({
            'Roboto_medium': require('../assets/fonts/Roboto-Medium.ttf'),
        });
    }

    getStylePage(page) {
        if (this.state.currentPage == page) {
            return {
                color: '#74992e'
            }
        } else {
            return {
                color: 'black'
            }
        }
    }

    getBackground(page) {
        if (this.state.currentPage == page) {
            return {
                backgroundColor: '#dcdcdc'
            }
        } else {
            return {
                backgroundColor: 'white'
            }
        }
    }

    render() {
        console.log("connected : " + Globals.connected);

        return (

            <View style={styles.sideMenuContainer}>

                <Image source={require('../Images/logo.png')} style={{ height: 140, width: 140, marginTop: 50 }} />

                <View style={{ width: '100%', height: 1, backgroundColor: '#e2e2e2', marginTop: 15 }} />

                <View style={{ width: '100%' }}>

                    {!Globals.connected && <View style={[styles.onglet, this.getBackground('Connexion')]}>

                        <Icon name='md-log-in' style={[styles.sideMenuIcon, this.getStylePage('Connexion')]} />

                        <Text style={[styles.menuText, this.getStylePage('Connexion')]} onPress={() => { this.props.navigation.navigate('Connexion'), this.setState({ currentPage: 'Connexion' }); }} > Connexion </Text>

                    </View>
                    }

                    <View style={[styles.onglet, this.getBackground('Map')]}>

                        <Icon name='map' style={[styles.sideMenuIcon, this.getStylePage('MapPage')]} />

                        <Text style={[styles.menuText, this.getStylePage('MapPage')]} onPress={() => { this.props.navigation.navigate('MapPage'), this.setState({ currentPage: 'MapPage' }) }} > Carte </Text>

                    </View>

                    {Globals.connected && <View style={[styles.onglet, this.getBackground('AjouterPoubelle')]}>

                        <Icon type="AntDesign" name='plus' style={[styles.sideMenuIcon, this.getStylePage('AjouterPoubelle')]} />

                        <Text style={[styles.menuText, this.getStylePage('AjouterPoubelle')]} onPress={() => { this.props.navigation.navigate('AjouterPoubelle'), this.setState({ currentPage: 'AjouterPoubelle' }); }} > Ajouter </Text>

                    </View>
                    }

                    {Globals.connected && <View style={[styles.onglet, this.getBackground('MonCompte')]}>

                        <Icon name='md-person' style={[styles.sideMenuIcon, this.getStylePage('MonCompte')]} />

                        <Text style={[styles.menuText, this.getStylePage('MonCompte')]} onPress={() => { this.props.navigation.navigate('MonCompte'), this.setState({ currentPage: 'MonCompte' }); }} > Mon compte </Text>

                    </View>
                    }

                    {Globals.admin && <View style={[styles.onglet, this.getBackground('Admin')]}>

                        <Icon name='md-settings' style={[styles.sideMenuIcon, this.getStylePage('Admin')]} />

                        <Text style={[styles.menuText, this.getStylePage('Admin')]} onPress={() => { this.props.navigation.navigate('Admin'), this.setState({ currentPage: 'Admin' }); }} > Admin </Text>

                    </View>}

                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {

        flex: 1,
        paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
        alignItems: 'center',
        justifyContent: 'center',

    },

    sideMenuContainer: {

        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20
    },

    sideMenuProfileIcon:
        {
            width: 150,
            height: 150,
            borderRadius: 150 / 2
        },

    sideMenuIcon:
        {
            width: 28,
            height: 28,
            marginRight: 10,
            marginLeft: 20

        },

    menuText: {

        fontSize: 18,
        color: '#000000',

    },

    onglet: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 15
    }

});