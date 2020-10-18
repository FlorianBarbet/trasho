import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, Dimensions  } from 'react-native';
import { View, Text, Icon, Toast } from 'native-base';
import Constants from 'expo-constants';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Dialog from "react-native-dialog";
import Globals from '../Globals';

const screenWidth = Math.round(Dimensions.get('window').width);

export default class PhotoPoubelle extends React.Component{

    state = {
        hasPermission: null,
        type: Camera.Constants.Type.back,
        photo: null,
        picker: false,
        dialog: false,
    }
    
    componentDidMount(){
        this._checkPermission();
        this.props.navigation.addListener('willFocus', payload => {this._checkProps()});
    }

    componentDidUpdate(){
        this._checkPermission();
    }

    componentWillUnmount(){
        this.state = {}
    }

    /**
     * Check and get parameters from navigation
     *
     * @memberof PhotoPoubelle
     */
    _checkProps(){
        if(this.props.navigation.getParam("types") !== undefined){
            this.setState({
                types : this.props.navigation.getParam("types"),
                position: this.props.navigation.getParam("position"),
            });
            this.props.navigation.setParams({
                types : undefined,
                position: undefined,
            });
        }
    }

    /**
     * Ask permission to use the camera
     */
    async _checkPermission(){
        const { status } = await Camera.requestPermissionsAsync();
        this.setState({
            hasPermission: (status === 'granted')
        });
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
    }

    /**
     * Switch the camera between front and back
     */
    _setType(){
        this.state.type === Camera.Constants.Type.back
            ? this.setState({ type : Camera.Constants.Type.front })
            : this.setState({ type : Camera.Constants.Type.back })
    }

    /**
     * Take a picture
     *
     * @memberof PhotoPoubelle
     */
    async _takePicture(){
        if (this.camera) {
            await this.camera.takePictureAsync({
                quality : 0.5,
                base64: true
            }).then((currentPhoto) => {                
                this.setState({
                    photo: currentPhoto.base64,
                    picker: false,
                });
            });
        }
    }

    /**
     * Pick a picture from gallery
     *
     * @memberof PhotoPoubelle
     */
    async _pickPicture(){
        try {
            await ImagePicker.launchImageLibraryAsync({
                quality: 1,
                base64: true
            }).then((result) => {
                console.log(result.cancelled);
                if (result.cancelled) {                   
                    this.setState({ photo: null });
                } else {
                    this.setState({ 
                        photo: result.base64,
                        picker: true
                    });
                }
            });
        } catch (E) {
            console.log(E);
        }
    }

    /**
     * Valid and add a new trash
     * Navigate to the map
     *
     * @memberof PhotoPoubelle
     */
    async _validPhoto(){
        const url = Globals.BASE_URL + '/api/trash';
        await fetch(url,{
            method: 'POST',
            headers: {
                "token_api": Globals.token_api,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                longitude: this.state.position.lng,
                latitude: this.state.position.lat,
                url_photo: 'data:image/png;base64,'+this.state.photo
              }),
        }).then(async (response) => {
            if(response.status == 201){
                await response.json().then(async (json) => {
                    for(const type of this.state.types){
                        const url2 = Globals.BASE_URL + '/api/trash/add-type/' + json.id_poubelle + '/' + type;
                        await fetch(url2,{
                            method: 'POST',
                            headers: {
                                "token_api": Globals.token_api
                            }
                        });
                    }
                    const urlToReport = Globals.BASE_URL + '/api/report/newTrash';
                    await fetch(urlToReport,{
                        method: 'POST',
                        headers: {
                            "token_api": Globals.token_api,
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                            mail: Globals.email,
                            id_poubelle: json.id_poubelle
                            }),
                    }).then((responseReport) => {
                        if(responseReport.status == 201){
                            this.setState({ dialog: false });
                            Toast.show({
                                text: "Poubelle ajoutée !",
                                duration : 3000,
                                type: "success"
                            });
                            this.props.navigation.navigate('MapPage');
                        }
                    });
                });
                
            }
        }).catch((err) => {
            Toast.show({
                text: "Problème lors de l'ajout de poubelle !",
                duration : 2000,
                type: "danger"
            });
        });
    }
    
    render(){
        if (this.state.hasPermission === null) {
            return <Text>No permission asked</Text>;
        }
        if (this.state.hasPermission === false) {
            return <Text>No access to camera</Text>;
        }        
        return(
            <View style={{ flex: 1 }}>
                {//no photo -> camera
                    !this.state.photo && (
                        <Camera 
                            style={{ flex: 1 }} 
                            type={this.state.type}
                            ref={ref => {
                                this.camera = ref;
                            }}
                        >
                            <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>
                                <TouchableOpacity
                                    style={styles.cameraButtons}
                                    onPress={() => this._pickPicture()}
                                >
                                    <Icon
                                        type="Ionicons"
                                        name="ios-photos"
                                        style={styles.cameraIcons}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cameraButtons}
                                    onPress={() => this._takePicture()}
                                >
                                    <Icon
                                        type="FontAwesome"
                                        name="camera"
                                        style={styles.cameraIcons}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cameraButtons}
                                    onPress={() => this._setType()}
                                >
                                    <Icon
                                        type="MaterialCommunityIcons"
                                        name="camera-switch"
                                        style={styles.cameraIcons}
                                    />
                                </TouchableOpacity>
                            </View>
                        </Camera>
                    )
                }
                {//photo -> display photo                   
                    this.state.photo && (
                        <View style={{ flex: 1 }}>
                            <Image style={styles.photo} source={{ uri : 'data:image/png;base64,'+this.state.photo}} /> 
                            <View style={styles.validOrCancelPhoto}>
                                <TouchableOpacity
                                    style={styles.cameraButtons}
                                    onPress={() => {
                                        this.setState({
                                            photo: null
                                        })
                                    }}
                                >
                                    <Icon
                                        type="FontAwesome"
                                        name="remove"
                                        style={styles.cameraIcons}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cameraButtons}
                                    onPress={() => {
                                        this.setState({
                                            dialog: true
                                        });
                                    }}
                                >
                                    <Icon
                                        type="FontAwesome"
                                        name="check"
                                        style={styles.cameraIcons}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
                <Dialog.Container visible={this.state.dialog}>
                    <Dialog.Title>Valider la nouvelle poubelle</Dialog.Title>
                    <Dialog.Description>
                        Êtes vous bien sûr de vouloir ajouter cette nouvelle poubelle ?
                    </Dialog.Description>
                    <Dialog.Button label="Annuler" onPress={() => this.setState({dialog : false})} />
                    <Dialog.Button label="Valider" onPress={() => this._validPhoto()}/>
                </Dialog.Container>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    centerView : {
        flex: 1,
        justifyContent : 'center',
        alignItems : 'center',
    },
    cameraButtons : {
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    cameraIcons : {
        color: "#fff", 
        fontSize: 40
    },
    photo: {
        width: screenWidth, 
        flex: 1,
        resizeMode: 'cover'
    },
    validOrCancelPhoto: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0, 
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:"row",
        justifyContent:"space-between",
        margin:20
    }
    
})