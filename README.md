grassboy-ajax
=============

auto generate the cross domain xhr

## Warning

This addon violated so called review policy of AMO.   
So... Think twice before you install it!!


## Usage:


### GET Request
``` javascript
gAJAX({
    url: 'http://httpbin.org/get?a=1&b=2',
    type: 'get'
}, function(responseText, response){
    //You can also get responseText by accessing response.text
    alert(responseText);
});
```
### POST Request
``` javascript
gAJAX({
    url: 'http://httpbin.org/post',
    type: 'post',
    data: {a:1,b:2}
}, function(responseText, response){
    //You can also get responseText by accessing response.text
    alert(responseText);
});
```
