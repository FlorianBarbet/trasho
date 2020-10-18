import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Button, Icon, Input, Item } from 'native-base';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import GLOBAL from '../Globals';

export default class ListeUtilisateurs extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        dialogVisible: false,
        listeUtilisateurs: [],
        search: ''
    }

    async componentDidMount() {
        this.getAllUsers();
    }

    /**
     * Hide or show dialog
     *
     * @memberof ListeUtilisateurs
     */
    changeDialogState() {
        this.setState(prevState => ({
            dialogVisible: !prevState.dialogVisible
        }));
    }

    /**
     * Get all users
     *
     * @memberof ListeUtilisateurs
     */
    async getAllUsers() {
        const url = GLOBAL.BASE_URL + '/api/user/'+GLOBAL.url_base_admin+'/users';        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "token_api": GLOBAL.token_api,
                "token_user": GLOBAL.token_user
            }
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        }); 
        const res = await response.json();
        if (response.status == 400) {
            alert('Problème de récupération des données');
        }
        else if (response.status == 200) {
            const utilisateurs = []
            let utilisateur = res.utilisateur;
            

            for (let key in utilisateur) {
                utilisateurs.push(utilisateur[key]
                )
                console.log(key);
            }
            this.setState({ listeUtilisateurs: utilisateurs });
        }
    }

    /**
     * Navigate to user page
     *
     * @param {*} email
     * @param {*} admin
     * @memberof ListeUtilisateurs
     */
    navigatePageUser(email, admin) {
        this.props.navigation.navigate('Utilisateur', { mail: email, admin: admin });
    }

    /**
     * Handle the search bar
     *
     * @memberof ListeUtilisateurs
     */
    handleSearch = (text) => {
        this.setState({ search: text });
    }

    render() {
        return (
            <Container>
                <Content>
                    <Item style={{ borderColor: 'dark', marginLeft: 15, marginRight: 15 }}>
                        <Input placeholder="Email" onChangeText={this.handleSearch} />
                        <Icon name="refresh" onPress={() => { this.setState({ search: '' }), this.getAllUsers() }} />
                    </Item>
                    <List>
                        {this.state.listeUtilisateurs.map((item, key) => (
                            (item.mail.includes(this.state.search) || this.state.search == '') && <ListItem key={key}>
                                <Button transparent
                                    onPress={
                                        () => this.navigatePageUser(item.mail, item.flag_admin)
                                    }>
                                    <Icon name={'person'} style={styles.black} />
                                    <Text style={styles.black}>{item.mail}</Text>
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Content>
            </Container>
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
    black: {
        color: 'black'
    }
});