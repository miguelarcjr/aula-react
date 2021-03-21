import React, { Component, useState } from 'react'
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import api from '../services/api'

export default class Perfil extends Component {

    state = {
        nome: '',
        foto: '',
        user: '',
        seguidores: '',
        seguindo: '',
        quantidadeRepositorio: '',
        ultimoRepositorio: '',
    }

    loadNome = async (usuario) => {
        let ult = 0;
        const response = await api.get('/'+usuario)
        const user = response.data;
        
        const responseRepository = await api.get('/'+usuario+'/repos');
        const repository = responseRepository.data;
        
        await repository.map(repo => {
            console.log(repo.id, Number(repo.id) >= Number(ult), repo.full_name);
          if(Number(repo.id) >= Number(ult)) {
            ult = repo.id;
          } 
        });

        const repositoryEnd = await repository.find( repo => {
            //console.log(repo);
            return ult === repo.id; 
        });

        console.log(JSON.stringify(repositoryEnd))

        this.setState({
            nome: user.name,
            foto: user.avatar_url,
            seguidores: user.followers,
            seguindo: user.following,
            quantidadeRepositorio: user.public_repos,
            ultimoRepositorio: repository[0].full_name,
        })
    }

    handleUser = (text) => {
        this.setState({ user: text })
    }

    handleButton = () => {
        this.loadNome(this.state.user)
    }

    render() {
        const pic = {
            uri: this.state.foto
        }

        return (
            <View style={ styles.container }>
                <Image style={ styles.foto } source={ pic } />
                <Text style={ styles.texto }> 
                    {this.state.nome === '' ? '' : 'Usuário:'} { this.state.nome }
                </Text>
                <Text style={ styles.texto }>
                    {this.state.nome === '' ? '' : 'Seguidores:'} { this.state.seguidores }
                </Text>
                <Text style={ styles.texto }>
                    {this.state.nome === '' ? '' : 'Seguindo:'} { this.state.seguindo }
                </Text>
                <Text style={ styles.texto }>
                    {this.state.nome === '' ? '' : 'Quantidade De Repositórios:'} { this.state.quantidadeRepositorio }
                </Text>
                <Text style={ styles.texto }>
                    {this.state.nome === '' ? '' : 'Último Repositório:'} { this.state.ultimoRepositorio }
                </Text>

                <TextInput style={ styles.textInput } onChangeText={ this.handleUser } value={this.state.user} placeholder="Nick GitHub"></TextInput>
                <TouchableOpacity style={ styles.button } onPress={ this.handleButton } >
                    <Text style={ styles.buttonText }>Enviar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    texto: {
      fontFamily: 'Roboto',
      //fontSize: '2em',
      color: '#f55',
      fontWeight: 'bold'
    },
    foto: {
        width: 200,
        height: 200,
        borderRadius: 100
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        height: 40, 
        backgroundColor: '#fff', 
        marginTop: 20, 
        borderRadius: 10,
        //border: '5px solid',
        padding: 10, 
        borderWidth: 1,
        borderColor: 'red',
        borderStyle: 'solid',
        //fontSize: '1.2em', 
        textAlign: 'center', 
        color: '#f55'
    },
    button: {
        backgroundColor: '#f55',
        padding: 10,
        margin: 15,
        height: 40,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff'
    }
});