import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView
} from 'react-native';

import mainStyles from '../styles';

export default class UrlPreviewer extends Component {
  constructor(props){
      super(props);
      
      this.state = { 
          height: null, 
          width: null,
          image: null
      };
  }
  
  componentWillReceiveProps(nextProps){
      this.setState({ image: null });
      
      if(!nextProps.info.preview || !nextProps.info.preview.image){
          return;
      }
      
      const imageUri = nextProps.info.preview.image.uri;
      const containerWidth = this.state.width;
      
      if(!containerWidth && imageUri){
          Image.getSize(imageUri, (width, height) => {
            this.setState({
                image: {
                    uri: imageUri,
                    height: height,
                    width: width
                }    
            });
          });
      }
      
      if(containerWidth && imageUri){
          Image.getSize(imageUri, (width, height) => {
            this.setState({
                height: containerWidth * height / width,
                image: {
                    uri: imageUri,
                    height: height,
                    width: width
                }    
            });
          });
      }
  }
  
  renderPreview(preview) {
      return(
          <View style={styles.previewInfoContainer}>
                <View style={styles.verticalLineContainer}>
                    <View style={styles.verticalLine}></View>
                </View>
                <View style={{ flex: 1}}>
                    <View style={styles.logoContainer}>
                        <Image source={{uri: preview.logoUrl}}
                            style={styles.logoImage}/>
                        <Text style={styles.siteName}>
                            {preview.siteName}
                        </Text>
                    </View>
                    <View>
                        <Text style={[styles.fontColor, {fontWeight: 'bold'}]}>
                            {preview.title}
                        </Text>
                        <Text style={styles.description}>
                            {preview.description}
                        </Text>
                    </View>
                    {this.state.image ?
                        this.renderPreviewImage()
                        :
                        null
                    }
                </View>
            </View>
      );
  }
  
  renderPreviewImage() {
      return(
        <View style={styles.imageContainer}>
            <Image 
                    source={{uri: this.state.image.uri}} 
                    resizeMode='contain' 
                    onLayout={(event) => {
                         this.setState({
                              height: event.nativeEvent.layout.width * this.state.image.height / this.state.image.width, width : event.nativeEvent.layout.width
                            });
                        }}
                    style={{ flex: 1, height: this.state.height, width: this.state.width}}/>
        </View>
      );
  }
  
  renderError(error){
      return(
          <Text>{error}</Text>
      );
  }
  
  render() {
    return (
      <View style={[ mainStyles.mainBorder ,{marginTop: 20, marginBottom: 20}]}>
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>
                Previewer
            </Text>
        </View>
        { this.props.info ? 
            <View style={styles.content}>
                <View>
                    <Text style={styles.fontColor}>
                        {this.props.info.url}
                    </Text>
                </View>
                {this.props.info.preview ?
                    this.renderPreview(this.props.info.preview)
                    : null 
                }
                {this.props.info.error ?
                    this.renderError(this.props.info.error)
                    : null 
                }
            </View>   
            :
            <View style={styles.content}>
                <Text>No url was fetch, please type your url and click fetch.</Text>
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fontColor: {
    color: '#78ADD0'
  },
  headerContainer: { 
      backgroundColor: '#92CDEC',
      borderBottomWidth: 4,
      borderBottomColor: '#92CDEC'
  },
  headerTitle: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
  },
  content: {
      padding: 10
  },
  imageContainer: {
      flex: 1,
      alignItems: 'stretch',
      flexDirection: 'row',
      marginTop: 10
  },
  logoContainer: { 
      flexDirection: 'row',
      alignItems:'center'
  },
  logoImage: {
      height: 32,
      width: 32,
      marginRight: 10
  },
  siteName: { 
      fontSize: 24
  },
  previewInfoContainer: { 
      alignItems: 'stretch',
      flexDirection: 'row',
      marginTop: 10
  },
  verticalLineContainer: { 
      paddingRight: 10,
      alignItems: 'center'
  },
  verticalLine: {
      borderColor: 'gray',
      borderWidth: 2,
      flex: 1
  },
  description: {
      marginTop: 5
  }
});