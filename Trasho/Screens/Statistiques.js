import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Input, Card, CardItem, Text, Body, Item, Button, Icon } from "native-base";
import GLOBAL from '../Globals';
import PureChart from 'react-native-pure-chart';
import Globals from '../Globals';

export default class Statistiques extends Component {

    state = {
        nbPoubelles: 0,
        nbSignalements: 0,
        percentRecyclable: 1,
        percentVerre: 1,
        percentToutDechet: 1,
        labelRecyclable: '',
        labelVerre: '',
        labelToutDechet: '',
        nbRecyclable: 0,
        nbVerre: 0,
        nbToutDechet: 0,
        statsData: [
            {
                value: 1,
                label: '',
                color: 'gray',
            },
            {
                value: 1,
                label: '',
                color: 'gray',
            }
        ],
        loading : false,
    }

    componentDidMount() {
        this.getPercentsTrash();
        this.getCountSignalement();
        this.props.navigation.addListener('willFocus', payload => {
            this.getPercentsTrash();
            this.getCountSignalement();
        });
    }

    /*
    * Calcul de la date à 7 jours
    */
    calculDate() {
        let currentDate = new Date();
        let annee = currentDate.getFullYear();
        let mois = currentDate.getMonth() + 1;
        let jour = currentDate.getDate();
        var date = 'dsds';

        if ((jour - 7) > 0) {
            jour = jour - 7;
            date = annee + '-' + this.refactorMonth(mois) + '-' + this.refactorDay((jour));
        }
        else {
            if ((mois - 1) > 0) {
                jour = jour + 31 - 7;
                mois = mois - 1;
                date = annee + '-' + this.refactorMonth(mois) + '-' + this.refactorDay((jour));
            }
            else {
                annee = annee - 1;
                jour = jour + 31 - 7;
                date = annee + '-' + '12' + jour;
            }
        }
        return date;
    }

    /**
     * Add 0 before month if the month number is too short
     *
     * @param {*} month
     * @returns
     * @memberof Statistiques
     */
    refactorMonth(month) {
        if (month < 10) {
            month = '0' + month;
        }
        return month;
    }

    /**
     * Add 0 before day if the day number is too short
     *
     * @param {*} day
     * @returns
     * @memberof Statistiques
     */
    refactorDay(day) {
        if (day < 10) {
            day = '0' + day;
        }
        return day;
    }

    /*
    * Récupération des statistiques des poubelles ajoutées entre deux dates
    */
    async getPercentsTrash() {

        let date1 = this.calculDate();
        let currentDate = new Date();
        let annee = currentDate.getFullYear();
        let mois = currentDate.getMonth() + 1;
        let jour = currentDate.getDate();
        let date2 = annee + '-' + this.refactorMonth(mois) + '-' + this.refactorDay(jour);

        const url = GLOBAL.BASE_URL + '/api/trash/' + Globals.url_base_admin + '/poubellesDates/' + date1 + '/' + date2;     

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
        if (response.status != 200) {
            alert('Problème de récupération des données');
        }
        else {
            //stockage des données des poubelles
            await this.storeDataTrash(res);
        }
    }

    async getCountSignalement() {
        const url = GLOBAL.BASE_URL + '/api/report/countSignalements/';

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
        if (response.status != 200) {
            alert('Problème de récupération des données');
        }
        else {
            this.setState({ nbSignalements: res[0]['count'] });
        }
    }

    /*
    * Stockage des statistiques sur les poubelles
    */
    async storeDataTrash(res) {
        if (res.percentRecyclable != 0 || res.percentVerre != 0 || res.percentToutDechet != 0) {
            this.setState({ percentRecyclable: res.percentRecyclable });
            this.setState({ percentVerre: res.percentVerre });
            this.setState({ percentToutDechet: res.percentToutDechet });
            this.setState({ nbRecyclable: res.nbRecyclage });
            this.setState({ nbVerre: res.nbVerre });
            this.setState({ nbToutDechet: res.nbToutDechet });
            let labelRecyclable = 'Recyclable (' + res.nbRecyclage + ')';
            this.setState({ labelRecyclable: labelRecyclable });
            let labelVerre = 'Verre (' + res.nbVerre + ')';
            this.setState({ labelVerre: labelVerre });
            let labelToutDechet = 'Tout déchet (' + res.nbToutDechet + ')';
            this.setState({ labelToutDechet: labelToutDechet });

            let stats = [];

            let nbPoubelles = 0;

            nbPoubelles = parseInt(res.nbRecyclage) + parseInt(res.nbVerre) + parseInt(res.nbToutDechet);

            nbPoubelles = parseInt(nbPoubelles);

            this.setState({ nbPoubelles: nbPoubelles });

            let objRecyclable = {
                value: this.state.percentRecyclable,
                label: this.state.labelRecyclable,
                color: 'gray',
            };

            let objVerre = {
                value: this.state.percentVerre,
                label: this.state.labelVerre,
                color: 'green'
            };

            let objToutDechet = {
                value: this.state.percentToutDechet,
                label: this.state.labelToutDechet,
                color: 'black'
            }

            if (res.nbRecyclage > 0) {
                stats.push(objRecyclable);
            }

            if (res.nbVerre > 0) {
                stats.push(objVerre);
            }

            if (res.nbToutDechet > 0) {
                stats.push(objToutDechet);
            }

            this.setState({ statsData: stats, loading: true });
        }
        else {
            alert("Aucune poubelle ajoutée récemment !");
        }
    }

    render() {
        if(!this.state.loading){
            return(<View><Text>Please wait...</Text></View>)
        }
        let statsData = this.state.statsData;
        return (
            <Container>
                <Content padder style={{ flex: 1 }}>
                    <Item style={{ borderColor: 'white', marginLeft: 15, marginRight: 15, marginTop: 20 }}>
                        <Text style={{ marginRight: 5, marginBottom: 25, fontSize: 30 }}>Depuis 7 jours :</Text>
                        <Icon style={{ marginLeft: 120, marginBottom: 15, fontSize: 30 }} name="refresh" onPress={() => { this.getCountSignalement(); this.getPercentsTrash(); }} />
                    </Item>
                    <Item style={{ justifyContent: 'center', marginTop: 15 }}>
                        <Text style={{ marginRight: 5, paddingBottom: 15, fontSize: 20 }}>{this.state.nbPoubelles} nouvelles poubelles</Text>
                    </Item>
                    <Item style={{ justifyContent: 'center', marginTop: 15 }}>
                        <Text style={{ marginRight: 5, paddingBottom: 15, fontSize: 20 }}>{this.state.nbSignalements} poubelles signalées</Text>
                    </Item>
                    <Item style={{ justifyContent: 'center', borderBottomColor: 'white', marginTop: 20 }}>
                        < PureChart data={statsData} type='pie' />
                    </Item>
                    <Text style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 50 }}> Types des nouvelles poubelles </Text>
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
});