import React, { Component } from 'react';
import { Container, Content, Text, Card, CardItem, Body, View, Button, Icon, Toast } from "native-base";
import { StyleSheet, Dimensions, ScrollView} from 'react-native';
import Globals from '../Globals';
import Spinner from 'react-native-loading-spinner-overlay';

/**
 * CGU screen to valid registration
 *
 * @export
 * @class CGU
 * @extends {Component}
 */
export default class CGU extends Component{

    state = {
        spinner: false
    };

    /**
     * Cancel the registration and go back to the map screen
     *
     * @memberof CGU
     */
    _cancelRegistration(){
        Toast.show({
            text: "Inscription annulée !",
            buttonText: "Okay !",
            duration: 3000,
            type: "danger"
        });
        this.props.navigation.navigate("MapPage");
    }

    /**
     * Valid the registration
     *
     * @returns nothing
     * @memberof CGU
     */
    async _validRegistration(){
        this.setState({spinner : true});
        const url = Globals.BASE_URL + '/api/user';
        const response = await fetch(url,{
            method: 'POST',
            headers: {
                "token_api": Globals.token_api,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                mail: this.props.navigation.getParam("mail"),
                password: this.props.navigation.getParam("password"),
              }),
        }).catch((err) => {
            this.setState({spinner : false});
            Toast.show({
                text: "Problème lors de l'inscription !",
                duration : 2000,
                type: "danger"
            });
        });
        this.setState({spinner : false});
        if(response.status != 201){
            Toast.show({
                text: "Problème lors de l'inscription !",
                duration : 2000,
                type: "danger"
            });
            return;
        }
        Toast.show({
            text: "Inscription validée ! Un mail vous a été envoyé pour confirmer votre compte. Il peut se trouver dans les spams.",
            buttonText: "Okay !",
            duration: 10000,
            type: "success"
        });
        this.props.navigation.navigate("Connexion");
    }
    
    /**
     * Render the screen
     *
     * @returns
     * @memberof CGU
     */
    render() {
        return (
            <Container>
                <Content style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Patientez s\'il vous plaît...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                    <View style={styles.card}>
                        <Card>
                            <CardItem>
                                <Body>
                                    <ScrollView>
                                        <Text>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc placerat eros mi. Curabitur sed est ac leo blandit pellentesque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam varius magna sapien, in cursus erat lobortis blandit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultrices malesuada aliquam. In sed hendrerit magna. Suspendisse nulla ante, accumsan vitae condimentum at, lobortis ac tellus.

        Sed rhoncus accumsan nisi, at sollicitudin lorem tincidunt vitae. Donec a ligula malesuada eros sollicitudin mollis. Praesent posuere nibh nisi, in fringilla erat consectetur ac. Ut auctor sollicitudin risus, id maximus arcu tincidunt et. Quisque convallis est et neque mollis ullamcorper. Mauris id sagittis magna. Nulla accumsan ornare dui et bibendum.

        Donec dignissim ipsum felis, et posuere felis tempor et. Phasellus a consectetur tortor. Vestibulum pulvinar malesuada placerat. Pellentesque non nunc ut lorem consectetur semper. Integer suscipit auctor erat, ut egestas purus maximus in. In facilisis sodales libero, et iaculis risus sagittis vitae. Fusce sed elit accumsan, bibendum nisl interdum, dictum libero. Vivamus eget semper neque. Aliquam tincidunt augue vel orci tristique congue. Aliquam sollicitudin fermentum dui, vitae rutrum risus vulputate quis. Vivamus aliquet egestas lorem, et tempor lectus.

        Aliquam id odio nec ex euismod hendrerit. Suspendisse at felis sapien. Sed rhoncus, diam at placerat vestibulum, ligula mauris sagittis lorem, sit amet sodales nisi augue quis leo. Maecenas fringilla ante quis tortor faucibus vestibulum. Praesent luctus vel ipsum in egestas. In mollis elit quis congue pulvinar. Vestibulum lacus tortor, pretium non aliquet ac, sollicitudin vitae justo. In sed consectetur orci. Vestibulum ut scelerisque nulla, vel dictum erat. Pellentesque porta vitae turpis in finibus. Quisque vel imperdiet purus.

        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc volutpat libero dui, sed blandit est auctor ut. Sed molestie arcu a porta gravida. Quisque eget augue lacus. Vivamus at mauris vehicula, aliquam nunc vel, consectetur justo. Morbi ut nunc pharetra, aliquet nisi et, pretium turpis. In vel est id nisl facilisis sodales. Curabitur quis augue enim. Aenean eget arcu imperdiet tortor euismod dignissim.
                                        </Text>
                                    </ScrollView>
                                </Body>
                            </CardItem>
                        </Card>
                    </View>
                    
                    <View style={styles.buttons}>
                        <Button iconLeft danger style={styles.button}
                            onPress={() => this._cancelRegistration()}>
                            <Icon type="MaterialCommunityIcons" name='cancel'/>
                            <Text>Annuler</Text>
                        </Button>
                        <Button iconLeft success style={styles.button}
                            onPress={() => this._validRegistration()}>
                            <Icon type="AntDesign" name='check'/>
                            <Text>Valider</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    card :{
        flex: 9,
        marginRight: 10,
        marginLeft: 10,
        marginTop : 10,
    },
    buttons :{
        flex: 1,
        flexDirection: 'row',
    },
    button : {
        flex: 1,
    },
    spinnerTextStyle: {
        color: '#37ff00',
        fontWeight: 'bold',
    },
})