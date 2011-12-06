$(function(){
  SC.initialize({
    site: "soundcloud.dev",
    client_id: "YOUR_CLIENT_ID"
  });

  /* the first 2 tests will setup the accessToken and fixture track */
  var fixtureTrackId, accessToken;

  asyncTest("Retrieve token using OAuth2", 1, function(){
    SC.accessToken(null);
    SC.post("/oauth2/token", {
      'client_id':     'YOUR_CLIENT_ID',
      'client_secret': 'YOUR_CLIENT_SECRET',
      'grant_type':    'password',
      'username':      'js-sdk-test',
      'password':      'js-sdk-test-pw',
    }, function(response){
      accessToken = response.access_token;
      SC.accessToken(accessToken);
      ok(response.access_token);
      start();
    });
  });
  
  asyncTest("Audio Recording and Uploading", 1, function(){
    var trackTitle = "JS SDK Test Recording";
    SC.record({
      start: function(){
        window.setTimeout(function(){
          SC.recordStop();
          SC.recordUpload({
            track: {
              title: trackTitle,
              sharing: "private"
            }}, function(track){
              fixtureTrackId = track.id;
              equal(track.title, trackTitle);
              start();
            }
          );
        }, 2000);
      }
    })
  });

  asyncTest("Receive latest tracks", 1, function(){
    SC.get("/tracks", {limit: 2}, function(tracks){
      equal(tracks.length, 2);
      start();
    });
  });

  asyncTest("Update a user description", 1, function(){
    var randomDescription = "ABC: " + Math.random();
    SC.put("/me", {user: {description: randomDescription}}, function(updatedMe){
      equal(updatedMe.description, randomDescription);
      start();
    });
  });

  asyncTest("Create a comment", 1, function(){
    var commentBody = "Great Track";
    SC.post("/tracks/" + fixtureTrackId + "/comments", {comment: {body: commentBody}}, function(comment){
      equal(comment.body, commentBody);
      start();
    });
  });

  asyncTest("Handle a 404 error", 1, function(){
    SC.get("/tracks/1", function(track, error){
      equal(error.message, "404 - Not Found");
      start();
    });
  });

  /* not yet implemented */
  //asyncTest("Handle a 302 redirect", 1, function(){
  //  var permalink_url = "http://soundcloud.com/forss/flickermood";
  //  SC.get("/resolve", {url: permalink_url}, function(track, error){
  //    equal(track.permalink_url, permalink_url);
  //    start();
  //  });
  //});
});