grassboy-ajax
=============

auto generate the cross domain xhr

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
