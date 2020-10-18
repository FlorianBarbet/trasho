import React, { Component } from 'react';
import { StyleSheet, View, Image, Switch } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Text, Button, Icon } from 'native-base';
import * as Progress from 'react-native-progress';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import GLOBAL from '../Globals';

export default class Utilisateur extends Component {

    state = { 
        switchValue: false, 
        dialogVisible: false, 
        email: '', 
        admin: false,
        user: undefined,
        loading: false,
    }

    async componentDidMount() {
        this.getUserInformations();
        this.props.navigation.addListener('willFocus', payload => {
            this.getUserInformations();
        });
    }

    async getUserInformations(){
        if (this.props.navigation.getParam("mail") == this.state.email){
            return;
        }
        this.setState({
            email: this.props.navigation.getParam("mail"),
            admin: this.props.navigation.getParam("admin"),
            switchValue: this.props.navigation.getParam("admin")
        });
        const url = GLOBAL.BASE_URL + '/api/user/email/' + GLOBAL.email;      
        await fetch(url, {
            method: 'GET',
            headers: {
                "token_api": GLOBAL.token_api
            }
        }).then(async (response) => {            
            if(response.status != 200){
                Toast.show({
                    text: "Problème de communication avec l'API",
                    duration : 3000,
                    buttonText: "Okay !",
                    type: "danger"
                });
                return;
            }
            await response.json().then((json) => {
                this.setState({ 
                    user: Object.values(json.utilisateur)[0],
                    loading: true
                });
            })
        })
    }

    /**
     * Handle the admin switch
     *
     * @memberof Utilisateur
     */
    toggleSwitch = (value) => {
        this.setState({ switchValue: value });
    }

    /**
     * Hide or show the dialog
     *
     * @memberof Utilisateur
     */
    changeDialogState() {
        this.setState(prevState => ({
            dialogVisible: !prevState.dialogVisible
        }));
    }

    /*componentDidUpdate(prevProps) {
        if (this.props.navigation.getParam("mail") != this.state.email) {
            this.setState({
                email: this.props.navigation.getParam("mail"),
                admin: this.props.navigation.getParam("admin"),
                switchValue: this.props.navigation.getParam("admin")
            });
        }
    }*/

    /*
    * Requête vers le back pour sauvegarder les informations d'un utilisateur
    */
    saveModifications() {
        const url = GLOBAL.BASE_URL + '/api/user/'+GLOBAL.url_base_admin+'/update';
        const body = 'mail=' + this.state.email + '&admin=' + this.state.switchValue;
        fetch(url, {
            method: 'POST',
            headers: new Headers({
                "token_user": GLOBAL.token_user,
                "token_api": GLOBAL.token_api,
                'Content-Type': 'application/x-www-form-urlencoded',
            }),
            body: body
        })
            .then((response) => response.text())
            .then((responseText) => {
                alert("Modifications sauvegardées !");
            })
            .catch((error) => {
                console.error(error);
            });
    }

    /*
    * Suppression d'un utilisateur en fonction de son adresse mail
    */
    deleteUser(mail) {
        const url = GLOBAL.BASE_URL + '/api/user/'+GLOBAL.url_base_admin+'/delete';
        const body = 'mail=' + this.state.email;
        fetch(url, {
            method: 'POST',
            headers: new Headers({
                "token_api": GLOBAL.token_api,
                "token_user": GLOBAL.token_user,
                'Content-Type': 'application/x-www-form-urlencoded',
            }),
            body: body
        })
            .then((response) => response.text())
            .then((responseText) => {
                this.changeDialogState();
                alert("Compte supprimé !");
                this.props.navigation.navigate('ListeUtilisateurs');
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        if(!this.state.loading){
            return(
                <View><Text>Please wait..</Text></View>
            )
        }
        return (
            <Container>
                <Content style={{ flex: 1 }}>
                    <Image
                        source={require('../Images/logo.png')}
                        style={styles.logo}
                    />
                    <Text style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 25, fontSize: 30 }}>Email</Text>
                    <Text style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 15 }}>{this.props.navigation.getParam("mail")}</Text>
                    <Text style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 25, fontSize: 30 }}>Admin</Text>
                    <Switch
                        style={{ marginTop: 15, marginLeft: 'auto', marginRight: 'auto' }}
                        onValueChange={this.toggleSwitch}
                        value={this.state.switchValue}
                    />

                    <Text style={styles.niveau}> Niveau </Text>
                    <Item style={{ borderColor: 'transparent', justifyContent: 'center', marginTop: 15 }}>
                        <Text style={{ marginRight: 5 }}>{this.state.user.niveau}</Text>
                        <Progress.Bar progress={this.state.user.experience/100} width={300} borderColor={'#74992e'} color={'#74992e'} />
                        <Text style={{ marginLeft: 5 }}>{this.state.user.niveau+1}</Text>
                    </Item>

                    <Button rounded block style={[styles.submitButton, styles.buttonWidth]}
                        onPress={
                            () => this.saveModifications()
                        }>
                        <Text style={styles.submitButtonText}> Sauvegarder modifications </Text>
                    </Button>

                    <Button rounded block style={[styles.deconnexion, styles.buttonWidth]}
                        onPress={
                            () => this.changeDialogState()
                        }>
                        <Text style={styles.submitButtonText}> Supprimer le compte </Text>
                    </Button>
                    <ConfirmDialog
                        title="Confirmation"
                        message="Voulez-vous vraiment supprimer le compte ?"
                        visible={this.state.dialogVisible}
                        onTouchOutside={() => this.setState({ dialogVisible: false })}
                        positiveButton={{
                            title: "Oui",
                            onPress: () => { this.deleteUser(this.state.email) }
                        }}
                        negativeButton={{
                            title: "Non",
                            onPress: () => { this.changeDialogState() }
                        }}
                    />
                </Content>
            </Container >
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        marginTop: 50,
        justifyContent: 'center',
    },
    logo: {
        width: 250,
        height: 250,
        marginLeft: 10,
        marginTop: 3,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    deconnexion: {
        backgroundColor: 'red',
        padding: 10,
        marginTop: 40,
        height: 40,
        marginBottom: 30
    },
    buttonWidth: {
        marginLeft: 15,
        marginRight: 15
    },
    black: {
        color: 'black'
    },
    niveau: {
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 30
    },
    submitButton: {
        backgroundColor: '#74992e',
        padding: 10,
        marginTop: 40,
        height: 40,
        marginBottom: 30
    }
});