import React, { Component } from 'react';

import {
    Text,
    View,
    TouchableHighlight,
    StyleSheet
} from 'react-native';

export default class Button extends Component {
    constructor(props){
        super(props);
    }
    
    render() {
        return(
            <TouchableHighlight 
                underlayColor='#92CDEC'
                onPress={this.props.onClick}
                style={this.props.style}>
                <View style={styles.container}>
                    <Text>{this.props.text}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 4,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
        borderColor: '#92CDEC'
    }
})