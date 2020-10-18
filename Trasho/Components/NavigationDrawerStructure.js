import React, { Component } from 'react';
import { View, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import Connexion from '../Screens/Connexion';
import MonCompte from '../Screens/MonCompte';
import AjouterPoubelle from '../Screens/AjouterPoubelle';
import Admin from '../Screens/Admin';
import MapPage from '../Screens/MapPage';
import Inscription from '../Screens/Inscription';
import ListeUtilisateurs from '../Screens/ListeUtilisateurs';
import Utilisateur from '../Screens/Utilisateur';
import Statistiques from '../Screens/Statistiques';
import CustomSideMenu from './CustomSideMenu';
import Globals from '../Globals';
import CGU from '../Screens/CGU';
import AjouterPoubelleMap from '../Screens/AjouterPoubelleMap'
import PhotoPoubelle from '../Screens/PhotoPoubelle';

class NavigationDrawerStructure extends Component {

    state = {
        reload: false
    }

    async componentDidMount() {
        await Expo.Font.loadAsync({
            'Roboto_medium': require('../assets/fonts/Roboto-Medium.ttf'),
        });
        await this._retrieveData();
        //await AsyncStorage.clear();
        console.log("connected 2 : " + Globals.connected);
    }

    _retrieveData = async () => {
        try {
            const admin = await AsyncStorage.getItem('ADMIN');
            const connected = await AsyncStorage.getItem('CONNECTED');
            const email = await AsyncStorage.getItem('EMAIL');
            const experience = await AsyncStorage.getItem('EXPERIENCE');
            const niveau = await AsyncStorage.getItem('NIVEAU');

            if (admin !== null) {
                Globals.admin = admin;
            }

            if (connected !== null) {
                Globals.connected = connected;
            }

            if (email !== null) {
                Globals.email = email;
            }

            if (experience !== null) {
                Globals.experience = Number(experience);
            }

            if (niveau !== null) {
                Globals.niveau = Number(niveau);
            }

        } catch (error) {
            console.log(error)
        }
    };

    toggleDrawer = () => {
        this.setState(prevState => ({
            reload: !prevState.reload
        }));
        this.props.navigationProps.toggleDrawer();
    };

    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                    <Image
                        source={require('../Images/drawer.png')}
                        style={{ width: 30, height: 25, marginLeft: 10, marginTop: 0 }}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const DrawerNavigator = createDrawerNavigator({
    MapPage: {
        screen: MapPage,
        navigationOptions: {
            drawerLabel: 'MapPage',
        },
    },
    Connexion: {
        screen: Connexion,
        navigationOptions: {
            drawerLabel: 'Connexion',
        },
    },
    Inscription: {
        screen: Inscription,
        navigationOptions: {
            drawerLabel: 'Inscription'
        },
    },
    MonCompte: {
        screen: MonCompte,
        navigationOptions: {
            drawerLabel: 'Mon compte'
        }
    },
    AjouterPoubelle: {
        screen: AjouterPoubelle,
        navigationOptions: {
            drawerLabel: 'Ajouter poubelle'
        }
    },
    Admin: {
        screen: Admin,
        navigationOptions: {
            drawerLabel: 'Admin'
        }
    },
    ListeUtilisateurs: {
        screen: ListeUtilisateurs,
        navigationOptions: {
            drawerLabel: 'ListeUtilisateurs'
        }
    },
    Utilisateur: {
        screen: Utilisateur,
        navigationOptions: {
            drawerLabel: 'Utilisateur'
        }
    },
    CGU:{
        screen: CGU,
        navigationOptions: {
            drawerLabel: 'CGU'
        }
    },
    Statistiques: {
        screen: Statistiques,
        navigationOptions: {
            drawerLabel: 'Statistiques'
        }
    },
    AjouterPoubelleMap:{
        screen: AjouterPoubelleMap,
        navigationOptions: {
            drawerLabel: 'AjouterPoubelleMap'
        }
    },
    PhotoPoubelle:{
        screen: PhotoPoubelle,
        navigationOptions: {
            drawerLabel: 'PhotoPoubelle'
        }
    }
},
    {
        contentComponent: CustomSideMenu,
        contentOptions: {
            activeTintColor: 'green'
        }
    }
);

const StackNavigator = createStackNavigator({
    DrawerNavigator:{
        screen: DrawerNavigator,
        navigationOptions: ({ navigation }) => ({
            title: 'Trasho',
            headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#74992e',
            },
            headerTintColor: '#fff',
        }),
    }
});

export default createAppContainer(StackNavigator);