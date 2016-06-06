import React, { Component } from 'react';
import {
    View,
    TextInput,
    StyleSheet
} from 'react-native';

import Button from './Button';

export default class UrlBar extends Component {
    constructor(props){
        super(props);
        
        this.onFetchUrlClick = () => { this.props.onFetchClick(this.props.url); };
        this.onUrlChange = this.props.onUrlInputChange.bind(this);
    }
    
    render() {
        return(
            <View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        underlineColorAndroid='transparent'
                        onChangeText={this.onUrlChange}
                        value={this.props.url}
                        style={styles.input}
                        placeholder='Please type your url here'/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button 
                        onClick={this.onFetchUrlClick}
                        style={styles.button}
                        text="Fetch Url"
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        borderWidth: 4,
        borderColor: '#92CDEC'
    },
    input:{
        padding: 2
    },
    buttonContainer: {
        justifyContent: 'center', 
        alignItems: 'center'
    },
    button: {
        marginTop: 20,
        borderRadius: 5
    }
});