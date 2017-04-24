//includes the Flickr package
var Flickr = require("flickrapi")

//this is authentication
var flickrOptions = {
  api_key: {{flickr api here}},
  secret: {{secret here}},
  user_id: {{user id here}},
  access_token: {{access token}},
  access_token_secret: {{access token secret}}
};

Flickr.authenticate(flickrOptions, function(error, flickr) {
  // we can now use flickr as our API object
  // parse the URL and identify the photo ID
  // hardcoding URl for now
  var url = "https://www.flickr.com/photos/135969040@N03/33171710555/in/dateposted-public/"

  var photoID = url.replace("https://", "").split("/")[3]

  flickr.photos.getSizes({
    api_key: {{flickr api here}},
    photo_id: photoID
  }, function(err, result) {
    /*
      This will give public results only, even if we used
      Flickr.authenticate(), because the function does not
      *require* authentication to run. It just runs with
      fewer permissions.
    */
    var photoarray = result.sizes.size
    for (var i=0; i < photoarray.length; i++) {
      //if this is a thumbnail or original size, grab it
      if (photoarray[i].label.toLowerCase() === "thumbnail") {
        console.log(photoarray[i].url)
      }
      else if (photoarray[i].label.toLowerCase() === "original") {
        console.log(photoarray[i].url)
      }
    }

  });
});

//next thing we need to do is using google spreadsheets API
