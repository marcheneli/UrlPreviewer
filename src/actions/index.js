import URL from 'url';
import { Image } from 'react-native';
import htmlparser from 'htmlparser2';

import UrlPreviewAPI from '../api';

export const FETCH_URL = 'FETCH_URL';
export const CHANGE_URL_INPUT = 'CHANGE_URL_INPUT';

const YOUTUBE_API_KEY = 'AIzaSyB3WJBZS7J2mhnun0k-_32uUI15uwY3X8Y';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/';

const YOUTUBE_LOGO_URL = 'http://s.ytimg.com/yts/img/favicon_32-vfl8NGn4k.png';
const YOUTUBE_NAME = 'YouTube';

const SPORTS_RU_LOGO_URL = 'http://www.sports.ru/apple-touch-icon-76.png';
const SPORTS_RU_NAME = 'Sports.ru';


export const fetchUrl = (url) => {
    return (dispatch) => {
        UrlPreviewAPI(url).then((preview) => {
            dispatch({
                type: FETCH_URL,
                payload: {
                    url: url,
                    preview: preview,
                    error: null
                } 
            });
        }).catch((error) => {
            dispatch({
                type: FETCH_URL,
                payload: {
                    url: url,
                    preview: null,
                    error: "Url is not valid!"
                } 
            });
        });
    };
    
}
export const changeUrlInput = (value) => {
    return {
        type: CHANGE_URL_INPUT,
        payload: value
    };
}

() => {
    
        var youtubeHostnameExp = new RegExp('^(([w]{3}\.)?(youtube\.[a-z]{2,5}))$');
        var youtubeChannelIdExp = new RegExp('^\/channel\/(.+)$');
        var youtubeUserNameExp = new RegExp('^\/user\/(.+)\/.*$');
        
        var sportsHostnameExp = new RegExp('^(([w]{3}\.)?(sports\.ru))$');
        
        const url = URL.parse(value, true);
        
        if(sportsHostnameExp.test(url.hostname)){
            fetch(value).then((response) => {
                return response.text();
            }).then((text) => {
                var description = "";
                var title = "";
                var tagName = "";
                var isImageSearching = false;
                var divCounter = 1;
                var imageSrc = null;
                var titleForImgSearching = null;
                var counter = 0;
                
                var parser = new htmlparser.Parser({
                    onopentag: function(name, attribs){
                        tagName = name;
                        if(name === 'meta'){
                            if(attribs['name'] && attribs['content']){
                                if(attribs['name'] === 'description'){
                                    description = attribs['content'];
                                }
                            }
                        }
                        
                        if(isImageSearching && name === 'div'){
                            divCounter++;
                        }
                        
                        if(isImageSearching && name === 'img'){
                            if(attribs['src']){
                                imageSrc = attribs['src'];
                                isImageSearching = false;
                            }
                        }
                    },
                    ontext: function(text){
                        if(tagName === 'title' && title === ""){
                            title = text;
                            titleForImgSearching = title.substr(0, title.indexOf(' - '));
                        }
                        
                        if(tagName === 'h1' && text.indexOf(titleForImgSearching) > -1){
                            isImageSearching = true;
                        }
                    },
                    onclosetag: function(tagname){
                        if(isImageSearching && (tagname === 'div' || tagname === 'article')){
                            divCounter--;
                            if(divCounter === 0){
                                isImageSearching = false;
                            }
                        }
                    }
                }, {decodeEntities: false});
                
                parser.write(text);
                parser.end();
                
                if(imageSrc){
                    Image.getSize (imageSrc, (width, height) => {
                        dispatch({
                            type: FETCH_URL,
                            payload: {
                                url: value,
                                preview: {
                                    logoUrl: SPORTS_RU_LOGO_URL,
                                    siteName: SPORTS_RU_NAME,
                                    title: title,
                                    description: description,
                                    image: {
                                        uri: imageSrc,
                                        width: width,
                                        height: height
                                    }
                                }
                            } 
                        });
                    });
                } else {
                    dispatch({
                        type: FETCH_URL,
                        payload: {
                            url: value,
                            preview: {
                                logoUrl: SPORTS_RU_LOGO_URL,
                                siteName: SPORTS_RU_NAME,
                                title: title,
                                description: description,
                                image: null
                            }
                        }
                    });
                }
            });
            
        }
        
        if(youtubeHostnameExp.test(url.hostname)){
            if(url.pathname.indexOf('watch') > -1){
                fetch(`${YOUTUBE_API_URL}videos?id=${url.query.v}&key=${YOUTUBE_API_KEY}&part=snippet`).then((response) => {
                    return response.json();
                }).then((json) => {
                    dispatch({
                        type: FETCH_URL,
                        payload: {
                            url: value,
                            preview: {
                                logoUrl: YOUTUBE_LOGO_URL,
                                siteName: YOUTUBE_NAME,
                                title: json.items[0].snippet.title,
                                description: json.items[0].snippet.description.split('\n')[0],
                                image: {
                                    uri: json.items[0].snippet.thumbnails.medium.url,
                                    width: json.items[0].snippet.thumbnails.medium.width,
                                    height: json.items[0].snippet.thumbnails.medium.height
                                }
                            }
                        } 
                    });
                });
            }
            
            if(url.pathname.indexOf('channel') > -1){
                fetch(`${YOUTUBE_API_URL}channels?id=${youtubeChannelIdExp.exec(url.pathname)[1]}&key=${YOUTUBE_API_KEY}&part=snippet`).then((response) => {
                    return response.json();
                }).then((json) => {
                    Image.getSize (json.items[0].snippet.thumbnails.medium.url, (width, height) => {
                        dispatch({
                            type: FETCH_URL,
                            payload: {
                                url: value,
                                preview: {
                                    logoUrl: YOUTUBE_LOGO_URL,
                                    siteName: YOUTUBE_NAME,
                                    title: json.items[0].snippet.title,
                                    description: json.items[0].snippet.description.split('\n')[0],
                                    image: {
                                        uri: json.items[0].snippet.thumbnails.medium.url,
                                        width: width,
                                        height: height
                                    }
                                }
                            } 
                        });
                    });
                    
                });
            }
            
            if(url.pathname.indexOf('user') > -1){
                fetch(`${YOUTUBE_API_URL}channels?forUsername=${youtubeUserNameExp.exec(url.pathname)[1]}&key=${YOUTUBE_API_KEY}&part=snippet`).then((response) => {
                    return response.json();
                }).then((json) => {
                    Image.getSize (json.items[0].snippet.thumbnails.medium.url, (width, height) => {
                        dispatch({
                            type: FETCH_URL,
                            payload: {
                                url: value,
                                preview: {
                                    logoUrl: YOUTUBE_LOGO_URL,
                                    siteName: YOUTUBE_NAME,
                                    title: json.items[0].snippet.title,
                                    description: json.items[0].snippet.description.split('\n')[0],
                                    image: {
                                        uri: json.items[0].snippet.thumbnails.medium.url,
                                        width: width,
                                        height: height
                                    }
                                }
                            } 
                        });
                    });
                    
                });
            }
        }
}