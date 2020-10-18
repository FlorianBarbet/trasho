import React from 'react';
import {

    INFINITE_ANIMATION_ITERATIONS,
    WebViewLeaflet,
    AnimationType,
    MapShapeType,
    WebViewLeafletEvents

} from "react-native-webview-leaflet";
import { Button } from "native-base";
import { StyleSheet, Text, View, Image, TouchableHighlight, Modal } from 'react-native';
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import ModalInfoPoubelle from './../Components/ModalInfoPoubelle';
import GLOBAL from '../Globals';

export default class AjouterPoubelleMap extends React.Component {

    state = {}

    constructor(props) {
        super(props)
        this.state = {
            mapCenterPosition: {
                lat: 50.636665,
                lng: 3.069481
            },
            ownPosition: null,
            webViewLeafletRef: null,
            markerPoubelle: null,
            modalVisible: false,
            uuid: undefined,
            newPoubelleSelected: false,
            positionNewPoubelle: {
                lat: null,
                lng: null,
            }
        }
        this.idPoubelle = null;
        this._checkProps();
        this.props.navigation.addListener('willFocus', payload => {this._checkProps()});
    }
    
    /**
     * Create a UUID V4
     *
     * @returns the UUID V4
     * @memberof AjouterPoubelleMap
     */
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    /**
     * Check and get parameters from navigation
     *
     * @memberof AjouterPoubelleMap
     */
    _checkProps(){
        if(this.props.navigation.getParam("types") !== undefined){
            this.setState({
                types : this.props.navigation.getParam("types")
            });
            this.props.navigation.setParams({types : undefined});
        }
    }

    /**
     * Display or hide modal
     *
     * @param {*} visible
     * @memberof AjouterPoubelleMap
     */
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    /**
     * Set all trash markers
     *
     * @param {*} listPoubelle all trash
     * @memberof AjouterPoubelleMap
     */
    setMarkerPoubelle(listPoubelle) {
        this.setState({ markerPoubelle: listPoubelle })
    }

    /**
     * Set the center map
     *
     * @param {*} lat latitude
     * @param {*} lng longitude
     * @memberof AjouterPoubelleMap
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
     * @memberof AjouterPoubelleMap
     */
    setOwnPosition(lat, lng) {
        this.setState({
            ownPosition: {
                lat: lat,
                lng: lng
            }
        })
    }

    /**
     * Set the map ref
     *
     * @param {*} webViewLeafletRef map ref
     * @memberof AjouterPoubelleMap
     */
    setWebViewLeafletRef(webViewLeafletRef) {
        this.setState({ webViewLeafletRef: webViewLeafletRef })
    }

    /**
     * Handle the map events
     *
     * @memberof AjouterPoubelleMap
     */
    onMessageReceived = (message) => {        
        switch (message.event) {
            case WebViewLeafletEvents.ON_MAP_MARKER_CLICKED:
                if (message.payload.mapMarkerID !== 'OWN_POSTION_MARKER_ID') {
                    this.idPoubelle = message.payload.mapMarkerID
                    this.setModalVisible(true);
                }
                break;
            case WebViewLeafletEvents.ON_MAP_TOUCHED:
                this.setNewPoubelle(message.payload.touchLatLng)
                break;
            default:
                null;//console.log("App received", message);
        }
    }

    /**
     * Get the user location
     *
     * @memberof AjouterPoubelleMap
     */
    async getLocationAsync() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            console.warn("Permission to access location was denied");
        }

        let location = await Location.getCurrentPositionAsync({});
        if (!this.state.ownPosition) {
            this.setOwnPosition(location.coords.latitude, location.coords.longitude);
            this.setMapCenterPosition(location.coords.latitude, location.coords.longitude)
        }
    }

    /**
     * Get trash location
     *
     * @memberof AjouterPoubelleMap
     */
    async getPoubelleAsync() {
        const url = GLOBAL.BASE_URL + '/api/trash'
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "token_api": GLOBAL.token_api
            }
        })
        const json = await response.json()
        const poubelles = []
        let poubelle = json.poubelle;
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
     * Set a new trash
     *
     * @param {*} touchLatLng
     * @memberof AjouterPoubelleMap
     */
    setNewPoubelle(touchLatLng){
        if(this.state.uuid !== undefined){
            this.setState(prevState => ({
                markerPoubelle: prevState.markerPoubelle.filter(trash => trash.id != this.state.uuid)
              }));
        }
        const newUuid = this.uuidv4();
        const newPoubelle = {
            id: newUuid,
            position: { lat: touchLatLng.lat, lng: touchLatLng.lng },
            icon: "🗑️",
            size: [24, 32],
        }
        this.setState(prevState =>({
            markerPoubelle : [...prevState.markerPoubelle, newPoubelle],
            uuid : newUuid,
            validNewPoubelle : true,
            positionNewPoubelle: {
                lat : touchLatLng.lat,
                lng: touchLatLng.lng,
            },
        }));
    }

    /**
     * Valid the new trash
     *
     * @memberof AjouterPoubelleMap
     */
    validNewPoubelle() {
        this.props.navigation.navigate('PhotoPoubelle',{
            position : this.state.positionNewPoubelle,
            types : this.state.types,
        });
    }

    componentDidMount() {
        this.getLocationAsync();
        this.getPoubelleAsync();
        this.props.navigation.addListener('willFocus', payload => {
            this.getLocationAsync();
            this.getPoubelleAsync();
        });
    }

    /**
     * The model with all trash informations
     *
     * @returns
     * @memberof AjouterPoubelleMap
     */
    modalPoubelle() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ModalInfoPoubelle idPoubelle={this.idPoubelle} />
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                                this.setModalVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <View style={styles.container}>

                {this.modalPoubelle()}

                {
                    <WebViewLeaflet
                        onMessageReceived={this.onMessageReceived}
                        eventReceiver={this}
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
                        mapMarkers={this.state.markerPoubelle}
                        mapCenterPosition={this.state.mapCenterPosition}
                        ownPositionMarker={
                            this.state.ownPosition && {
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
                        }
                        zoom={50}
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
                    {this.state.validNewPoubelle && (
                        <Button
                        onPress={() => {
                            this.validNewPoubelle();
                        }}
                        style={styles.mapButton}
                        success
                    >
                        <Text style={styles.mapButtonEmoji}>✔️</Text>
                        </Button>)
                    }
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
        height: 42,
        justifyContent: "center",
        width: 42
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
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});
