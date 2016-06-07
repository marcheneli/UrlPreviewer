import URL from 'url';
import htmlparser from 'htmlparser2';

const YOUTUBE_API_KEY = 'AIzaSyB3WJBZS7J2mhnun0k-_32uUI15uwY3X8Y';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/';

const YOUTUBE_LOGO_URL = 'http://s.ytimg.com/yts/img/favicon_32-vfl8NGn4k.png';
const YOUTUBE_NAME = 'YouTube';

const SPORTS_RU_LOGO_URL = 'http://www.sports.ru/apple-touch-icon-76.png';
const SPORTS_RU_NAME = 'Sports.ru';

const urlExp = new RegExp('^(http(s)?(:\/\/))?(www\.)?[a-zA-Z0-9-_\.]+([-a-zA-Z0-9:%_\+.~#?&//=]*)');

const youtubeChannelIdExp = new RegExp('^\/channel\/(.+)$');
const youtubeUserNameExp = new RegExp('^\/user\/(.+)\/(.*)$');
const youtubeHostnameExp = new RegExp('^(([w]{3}\.)?(youtube\.[a-z]{2,5}))$');
const sportsHostnameExp = new RegExp('^(([w]{3}\.)?(sports\.ru))$');

export default (urlStr) => {
    
    checkUrl(urlStr);
    
    const urlWithProtocolName = getUrlWithProtocolName(urlStr);
    
    const url = URL.parse(urlWithProtocolName, true);
    
    return fetch(urlWithProtocolName).then(() => {
        if(sportsHostnameExp.test(url.hostname)){
            return getSportsPreview(url);
        }
        
        if(youtubeHostnameExp.test(url.hostname)){
            return getYoutubePreview(url);
        }
        
        return null;
    });
}

const checkUrl = (urlStr) => {
    if(!urlExp.test(urlStr)){
        throw 'Error';
    }
}

const getUrlWithProtocolName = (urlStr) => {
    if(urlStr.indexOf('http://') !== 0 && urlStr.indexOf('https://') !== 0){
        return 'http://' + urlStr;
    }
    
    return urlStr;
}

const getYoutubePreview = (url) => {
    if(url.pathname.indexOf('watch') > -1){
        return getYoutubeWatchPreview(url.query.v);
    }
    
    if(url.pathname.indexOf('channel') > -1){
        return getYoutubeChannelPreview(url.pathname.split('/')[2]);
    }
    
    if(url.pathname.indexOf('user') > -1){
        return getYoutubeUserPreview(url.pathname.split('/')[2]);
    }
    
    return getYoutubePreviewWithoutImage(url);
}

const getSportsPreview = (url) => {
    return fetch(URL.format(url)).then((response) => {
        return response.text();
    }).then((text) => {
        let description = "";
        let title = "";
        let tagName = "";
        let isImageSearching = false;
        let divCounter = 1;
        let imageSrc = null;
        let titleForImgSearching = null;
        
        const parser = new htmlparser.Parser({
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
            return {
                logoUrl: SPORTS_RU_LOGO_URL,
                siteName: SPORTS_RU_NAME,
                title: title,
                description: description,
                image: {
                    uri: imageSrc
                }
            };
        } else {
            return {
                logoUrl: SPORTS_RU_LOGO_URL,
                siteName: SPORTS_RU_NAME,
                title: title,
                description: description,
                image: null
            };
        }
    });
}

const getYoutubeWatchPreview = (videoId) => {
    return fetch(`${YOUTUBE_API_URL}videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`).then((response) => {
        return response.json();
    }).then((json) => {
        
        if(json.items.length == 0){
            throw "Url is not valid"
        }
        
        return {
            logoUrl: YOUTUBE_LOGO_URL,
            siteName: YOUTUBE_NAME,
            title: json.items[0].snippet.title,
            description: json.items[0].snippet.description.split('\n')[0],
            image: {
                uri: json.items[0].snippet.thumbnails.medium.url
            }
        };
    });
}

const getYoutubeChannelPreview = (channelId) => {
    return fetch(`${YOUTUBE_API_URL}channels?id=${channelId}&key=${YOUTUBE_API_KEY}&part=snippet`).then((response) => {
        return response.json();
    }).then((json) => {
        if(json.items.length == 0){
            throw "Ресурс по данной ссылке не найден."
        }
        
        return {
            logoUrl: YOUTUBE_LOGO_URL,
            siteName: YOUTUBE_NAME,
            title: json.items[0].snippet.title,
            description: json.items[0].snippet.description.split('\n')[0],
            image: {
                uri: json.items[0].snippet.thumbnails.medium.url
            }
        };
    });
}

const getYoutubeUserPreview = (userName) => {
    return fetch(`${YOUTUBE_API_URL}channels?forUsername=${userName}&key=${YOUTUBE_API_KEY}&part=snippet`).then((response) => {
        return response.json();
    }).then((json) => {
        if(json.items.length == 0){
            throw "Ресурс по данной ссылке не найден."
        }
        
        return {
            logoUrl: YOUTUBE_LOGO_URL,
            siteName: YOUTUBE_NAME,
            title: json.items[0].snippet.title,
            description: json.items[0].snippet.description.split('\n')[0],
            image: {
                uri: json.items[0].snippet.thumbnails.medium.url
            }
        };
    });
}

const getYoutubePreviewWithoutImage = (url) => {
    return fetch(URL.format(url)).then((response) => {
        return response.text();
    }).then((text) => {
        let description = "";
        let title = "";
        let tagName = "";
        
        const parser = new htmlparser.Parser({
            onopentag: function(name, attribs){
                tagName = name;
                if(name === 'meta'){
                    if(attribs['name'] && attribs['content']){
                        if(attribs['name'] === 'description'){
                            description = attribs['content'];
                        }
                    }
                }
            },
            ontext: function(text){
                if(tagName === 'title' && title === ""){
                    title = text;
                }
            },
            onclosetag: function(tagname){
            }
        }, {decodeEntities: false});
        
        parser.write(text);
        parser.end();
        
        return {
            logoUrl: YOUTUBE_LOGO_URL,
            siteName: YOUTUBE_NAME,
            title: title,
            description: description,
            image: null
        };
    });
}