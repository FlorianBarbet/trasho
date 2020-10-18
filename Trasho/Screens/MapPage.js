import React from 'react';
import {
    WebViewLeaflet,
    MapShapeType,
    WebViewLeafletEvents
} from "react-native-webview-leaflet";
import { Button, Icon, ListItem, CheckBox } from "native-base";
import { StyleSheet, View, Modal, Text } from 'react-native';
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import ModalInfoPoubelle, { MessageModal } from './../Components/ModalInfoPoubelle';
import { GetItinerary } from './../Components/Itineraire';

import GLOBAL from '../Globals';


export default class MapPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapCenterPosition: {
                lat: 50.636665,
                lng: 3.069481
            },
            ownPosition: null,
            markerPoubelle: [],
            markers: [],
            modalTypeVisible: false,
            listTypes: [],
            idPoubelle: null,
            modal: false,
            positions: [],
            itinerairePoubelle: null,
            ownPositionMarker: null
        },
            webViewLeafletRef = null
    }

    /**
     * hide or show modal
     *
     * @memberof MapPage
     */
    setModal = (visible) => {
        this.setState({ modal: visible })
    }

    /**
     * Set route
     *
     * @param {*} idPoubelle
     * @memberof MapPage
     */
    setItinerairePoubelle(idPoubelle) {
        this.setState({ itinerairePoubelle: idPoubelle })
    }

    /**
     * Set position
     *
     * @param {*} itineraire
     * @memberof MapPage
     */
    setPositions(itineraire) {
        this.setState({ positions: itineraire })
    }

    /**
     * Set trash id
     *
     * @param {*} idPoubelle
     * @memberof MapPage
     */
    setIdPoubelle(idPoubelle) {
        this.setState({ idPoubelle: idPoubelle })
    }

    /**
     * Set all trash markers
     *
     * @param {*} listPoubelle all trash
     * @memberof MapPage
     */
    setMarkerPoubelle(listPoubelle) {
        this.setState({ markerPoubelle: listPoubelle });
        this.setMarkers();
    }

    /**
     * Set all trash markers and position marker
     *
     * @param {*} listPoubelle all trash
     * @memberof MapPage
     */
    setMarkers() {
        let markers = [];
        this.state.markerPoubelle.forEach(element=> {
            markers.push(element);
        })
        if (this.state.ownPositionMarker !== null) {
            markers.push(this.state.ownPositionMarker);
        }
        this.setState({ markers: markers });
    }

    /**
     * Set the center map
     *
     * @param {*} lat latitude
     * @param {*} lng longitude
     * @memberof MapPage
     */
    setMapCenterPosition(lat, lng) {
        this.setState({
            mapCenterPosition: {
                lat: lat,
                lng: lng
            }
        })
    }

    /**
     * Set the user position
     *
     * @param {*} lat latitude
     * @param {*} lng longitude
     * @memberof MapPage
     */
    setOwnPosition(lat, lng) {
        this.setState({
            ownPosition: {
                lat: lat,
                lng: lng
            }
        });
        this.setState({
            ownPositionMarker: {
                id: "OWN_POSTION_MARKER_ID",
                position: this.state.ownPosition,
                icon: "https://www.stickpng.com/assets/images/58889219bc2fc2ef3a1860aa.png",
                size: [24, 32],
                /*animation: {
                    duration: "0.5",
                    delay: 0,
                    iterationCount: INFINITE_ANIMATION_ITERATIONS,
                    type: AnimationType.PULSE
                } *///si tu veux le voir bondir 

                /*
                
                AnimationType possible : 
                  "BOUNCE",
                  "FADE",
                  "JUMP",
                  "PULSE",
                  "SPIN", 
                  "WAGGLE",
                
                */


            }
        });
        this.setMarkers();
    }

    /**
     * Handle the map events
     *
     * @memberof MapPage
     */
    onMessageReceived = (message) => {
        switch (message.event) {
            case WebViewLeafletEvents.ON_MAP_MARKER_CLICKED:
                if (message.payload.mapMarkerID !== 'OWN_POSTION_MARKER_ID') {
                    this.setIdPoubelle(message.payload.mapMarkerID);
                    this.setModal(true);
                }
                break;
            default:
                null;
        }
    }

    /**
     * Handle modal event
     *
     * @memberof MapPage
     */
    messageModal = (message, idPoubelle) => {
        switch (message) {
            case MessageModal.SUPPRESSION_POUBELLE:
                this.getPoubelleAsync();
                break;
            case MessageModal.ITINERAIRE_POUBELLE:
                this.setItinerairePoubelle(idPoubelle)
                this.itineraire();
                break;
            default:
                null;
                break;
        }
    }

    /**
     * Get the user location
     *
     * @memberof MapPage
     */
    async getLocationAsync() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            console.warn("Permission to access location was denied");
        }

        let location = await Location.getCurrentPositionAsync({});
        if (!this.state.ownPosition || (this.state.ownPosition.lat !== location.coords.latitude || this.state.ownPosition.lng !== location.coords.longitude)) {
            if (!this.state.ownPosition) {
                this.setMapCenterPosition(location.coords.latitude, location.coords.longitude);
            }
            this.setOwnPosition(location.coords.latitude, location.coords.longitude);
            //this.setMapCenterPosition(location.coords.latitude, location.coords.longitude);
            //this.setMapCenterPosition(50.636665, 3.069481);
        }
    }

    /**
     * Add marker for one trash
     *
     * @param {*} poubelle
     * @memberof MapPage
     */
    addMarkerPoubelle(poubelle) {
        const poubelles = []
        for (let key in poubelle) {
            poubelles.push(
                {
                    id: key.substring(1),
                    position: { lat: poubelle[key].latitude, lng: poubelle[key].longitude },
                    icon: "https://i.ya-webdesign.com/images/google-maps-pin-png-4.png",
                    size: [24, 32],
                    /*animation: {
                         duration: "0.5",
                         delay: 0,
                         iterationCount: INFINITE_ANIMATION_ITERATIONS,
                         type: AnimationType.JUMP
                       }*/
                }
            )
        }
        this.setMarkerPoubelle(poubelles)
    }

    /**
    * Get trash location
    *
    * @memberof MapPage
    */
    async getPoubelleAsync() {
        const url = GLOBAL.BASE_URL + '/api/trash';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "token_api": GLOBAL.token_api
            }
        })
        const json = await response.json()
        this.addMarkerPoubelle(json.poubelle)
    }

    /**
     * Load all types of database
     *
     * @memberof MapPage
     */
    async _loadAllType() {
        const url = GLOBAL.BASE_URL + '/api/type';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "token_api": GLOBAL.token_api
            }
        }).catch((err) => {
            console.error(err);
        });
        const res = await response.json();
        if (response.status != 200) {
            Toast.show({
                text: "Problème de communication !",
                duration: 2000,
                type: "danger"
            });
        } else {
            const mapType = new Map();
            const allTypes = [];
            Object.values(res.type_poubelle).forEach(element => {
                allTypes.push(element.type);
                mapType.set(element.type, false);
            });

            this.setState({
                listTypes: allTypes,
                mapSelected: mapType,
            });
        }
    }

    /**
     * Handle the click on item checkbox to change the checkbox value
     *
     * @param {*} type
     * @memberof MapPage
     */
    _handleCheckbox(type) {
        var newMap = this.state.mapSelected;
        newMap.set(type, !newMap.get(type));
        this.setState({
            mapSelected: newMap,
        });
    }

    /**
     * Filter trash types
     */
    async filterTrash() {
        var allTypes = []
        for (var [key, value] of this.state.mapSelected) {
            if (value) {
                allTypes.push(key);
            }
        }
        if (allTypes.length == 0) {
            this.setState({ modalTypeVisible: false })
            return this.getPoubelleAsync();
        }
        const url = GLOBAL.BASE_URL + '/api/trash/byType/name';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "token_api": GLOBAL.token_api,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: allTypes
            })
        });
        const json = await response.json();
        this.setState({ modalTypeVisible: false });
        this.addMarkerPoubelle(json.poubelle);
    }

    componentDidMount() {
        this.getLocationAsync();
        this.getPoubelleAsync();
        this._loadAllType();
        this.props.navigation.addListener('willFocus', payload => {
            this.getLocationAsync();
            this.getPoubelleAsync();
            this._loadAllType();
        });
        setInterval(() => {
            this.getLocationAsync();
            this.itineraire();
        }, 1000);
    }

    /**
     * Modal to select type
     *
     * @returns
     * @memberof MapPage
     */
    modalType() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalTypeVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Type sélectionné :</Text>
                        {
                            this.state.listTypes.map((type) => {
                                return (
                                    <ListItem onPress={() => this._handleCheckbox(type)} key={type}>
                                        <CheckBox checked={this.state.mapSelected.get(type)} color="#74992e" />
                                        <Text>      {type}</Text>
                                    </ListItem>
                                );
                            })
                        }
                        <Button block success onPress={() => this.filterTrash()}>
                            <Text>Valider</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        )
    }

    /**
     * Refresh route to trash
     *
     * @memberof MapPage
     */
    async itineraire() {
        if (this.state.itinerairePoubelle != null) {
            let r = await GetItinerary(this.state.itinerairePoubelle, this.state.ownPosition)
            this.setPositions(r)
            this.setMapCenterPosition(this.state.ownPosition.lat, this.state.ownPosition.lng);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.modalType()}
                <ModalInfoPoubelle
                    idPoubelle={this.state.idPoubelle}
                    visible={this.state.modal}
                    affichemodal={this.setModal}
                    messageModal={this.messageModal}
                />

                {
                    <WebViewLeaflet
                        ref={component => (this.webViewLeafletRef = component)}
                        onMessageReceived={this.onMessageReceived}
                        eventReceiver={this}
                        mapShapes={[
                            {
                                shapeType: MapShapeType.POLYLINE,
                                color: "#000000",
                                id: "1",
                                positions: this.state.positions
                            }
                        ]}
                        mapLayers={[{
                            attribution:
                                '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                            baseLayerIsChecked: true,
                            baseLayerName: "Fr OSM",
                            url: "http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                        },

                        {
                            attribution:
                                '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                            baseLayerName: "OpenStreetMap.Mapnik",
                            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                        }

                        ]}
                        mapMarkers={this.state.markers}
                        mapCenterPosition={this.state.mapCenterPosition}
                        //ownPositionMarker={this.state.ownPositionMarker}
                        zoom={90}
                    />
                }


                <View style={styles.mapControls}>
                    <Button
                        onPress={() => {
                            this.getLocationAsync();
                            this.setMapCenterPosition(this.state.ownPosition.lat, this.state.ownPosition.lng);
                        }}
                        style={styles.mapButton}
                        success
                    >
                        <Text style={styles.mapButtonEmoji}>🎯</Text>
                    </Button>
                    <Button
                        onPress={() => {
                            this.setState({ modalTypeVisible: true });
                        }}
                        style={styles.mapButton}
                        success
                    >
                        <Icon type="FontAwesome" name="filter" />
                    </Button>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    mapControls: {
        backgroundColor: "rgba(255,255,255,.5)",
        borderRadius: 5,
        bottom: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        left: 0,
        marginHorizontal: 10,
        padding: 7,
        position: "absolute",
        right: 0
    },
    mapButton: {
        alignItems: "center",
        height: 50,
        justifyContent: "center",
        width: 50
    },
    mapButtonEmoji: {
        fontSize: 28
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        margin: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
});
