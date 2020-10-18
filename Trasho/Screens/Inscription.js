import React, { Component } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Icon, Button, Text, Toast } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { Root } from "native-base";
import Globals from '../Globals';

export default class Inscription extends Component {

  state = {
    loading: true,
    email: '',
    password: '',
    confirmPassword: '',
    iconPassword: 'eye-off',
    hidePassword: true,
    iconConfirmPassword: 'eye-off',
    hideConfirmPassword: true,
    isEmail: false
  }

  regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  /**
   * Handle the email input
   *
   * @memberof Inscription
   */
  _handleEmail = (text) => {
    this.setState({ email: text, isEmail: this.regexEmail.test(text) });
  }
 
  /**
   * Handle the password input
   *
   * @memberof Inscription
   */
  _handlePassword = (text) => {
    this.setState({ password: text })
  }

  /**
   * Handle the confirm password input
   *
   * @memberof Inscription
   */
  _handleConfirmPassword = (text) => {
    this.setState({ confirmPassword: text })
  }

  /**
   * Check if the email is valid
   *
   * @returns
   * @memberof Inscription
   */
  _checkEmail() {
    if(!this.regexEmail.test(this.state.email)) {
      Toast.show({
        text: "Email invalide",
        duration : 5000,
        buttonText: "Okay !",
        type: "danger"
      });
      return false;
    }
    return true;
  }

  /**
   * Check if password is valid
   *
   * @returns
   * @memberof Inscription
   */
  _checkPassword() {
    if(this.state.password.length < 1) {
      Toast.show({
        text: "Mot de passe indéfini",
        duration : 5000,
        buttonText: "Okay !",
        type: "danger"
      });
      return false;
    }
    var regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,50}$/;
    if(this.state.password.length<6){
      Toast.show({
        text: "Le mot de passe doit contenir au moins 6 caractères.",
        duration : 5000,
        buttonText: "Okay !",
        type: "danger"
      });
      return false;
    } else if(this.state.password.length>50){
      Toast.show({
        text: "Le mot de passe doit contenir au maximim 50 caractères.",
        duration : 5000,
        buttonText: "Okay !",
        type: "danger"
      });
      return false;
    }     
    else if(!regexPassword.test(this.state.password)){
      Toast.show({
        text: "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.",
        duration : 7000,
        buttonText: "Okay !",
        type: "danger"
      });
      return false;
    }
    return true;
  }

  /**
   * Check if the confirm password is valid
   *
   * @returns
   * @memberof Inscription
   */
  _checkConfirmPassword(){
    if(this.state.confirmPassword.length < 1) {
      Toast.show({
        text: "Confirmation du mot de passe indéfinie",
        duration : 5000,
        buttonText: "Okay !",
        type: "danger"
      });
      return false;
    }
    if(this.state.password != this.state.confirmPassword){
      Toast.show({
        text: "Les deux mots de passe ne correspondent pas",
        duration : 5000,
        buttonText: "Okay !",
        type: "danger"
      });
      return false;
    }
    return true;
  }

  /**
   * Hide or show the password
   *
   * @memberof Inscription
   */
  _changeViewPassword(){
    if(this.state.hidePassword){
      this.setState({ iconPassword: 'eye', hidePassword: false});
    } else {
      this.setState({ iconPassword: 'eye-off', hidePassword: true});
    }
  }

  /**
   * Hide or show the confirm password
   *
   * @memberof Inscription
   */
  _changeViewConfirmPassword(){
    if(this.state.hideConfirmPassword){
      this.setState({ iconConfirmPassword: 'eye', hideConfirmPassword: false});
    } else {
      this.setState({ iconConfirmPassword: 'eye-off', hideConfirmPassword: true});
    }
  }

  async _checkRegistration(){
    if(this._checkEmail()
      && this._checkPassword() 
      && this._checkConfirmPassword() 
    ){
      const url = Globals.BASE_URL + '/api/user/email/' + this.state.email;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
            "token_api": Globals.token_api
        }
    }).catch((err) => {console.log('Problème API')});     
      if(response.status != 200){
        Toast.show({
          text: "Problème de communication !",
          duration : 2000,
          type: "danger"
        });
        return;
      }
      const json = await response.json();
      if (Object.keys(json.utilisateur).length != 0){
        Toast.show({
          text: "L'adresse mail indiquée a déjà un compte sur Trasho.",
          duration : 6000,
          buttonText: "Okay !",
          type: "danger"
        });
        return;
      }
      this.props.navigation.navigate('CGU', {mail : this.state.email, password : this.state.password})  
    }
  }

  render() {
    if(this.state.loading){
      <View></View>
    }
    return (
      <Container>
        <Content>
          <Image 
            style={styles.logo} 
            source={require('../Images/logo.png')}
          />
          <Form>
            <Item style={{ borderColor: 'transparent' }}>
              <Icon name="mail"/>
              <Item error={!this.state.isEmail} success={this.state.isEmail} style={{ marginRight: 40, }}>
                <Input 
                  placeholder="Adresse mail"
                  onChangeText={this._handleEmail}
                  autoCapitalize="none"
                />
                <Icon name='checkmark-circle' />
              </Item>
            </Item>
            <Item style={{ borderColor: 'transparent' }}>
              <Icon name="key"/>
              <Item style={{ marginRight: 40, }}>
                <Input 
                  placeholder="Mot de passe" 
                  secureTextEntry={this.state.hidePassword}
                  onChangeText={this._handlePassword}
                />
                <Icon
                  name={this.state.iconPassword}
                  onPress={() => this._changeViewPassword()}
                />
              </Item>
            </Item>
            <Item style={{ borderColor: 'transparent' }}>
              <Icon name="key"/>
              <Item style={{ marginRight: 40, }}>
                <Input 
                  placeholder="Confirmer mot de passe" 
                  secureTextEntry={this.state.hideConfirmPassword}
                  onChangeText={this._handleConfirmPassword}
                />
                <Icon
                  name={this.state.iconConfirmPassword}
                  onPress={() => this._changeViewConfirmPassword()}
                />
              </Item>
            </Item>
          </Form>
            <Button rounded block style={styles.button} onPress={() => this._checkRegistration()}>
              <Text>S'inscrire</Text>
            </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    justifyContent: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  button: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#74992e',
    padding: 10,
    marginTop: 40,
    height: 40,
    marginBottom: 30
  },
});
