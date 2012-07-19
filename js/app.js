$(document).bind("mobileinit", function(){
  $.mobile.defaultPageTransition = 'none';
});

$('body').live('pagebeforecreate', function(event){
  $.mobile.showPageLoadingMsg('test');
});
$('body').live('pagecreate', function(event){
  $.mobile.hidePageLoadingMsg('test');
});

$('#splash').live('pageshow', function(event, ui){
  setTimeout(hideSplash, 2000);
});

function hideSplash() {
  $.mobile.changePage("#main", "fade");
}

$('#news').live('pageshow', function(event, ui) {
  $.mobile.showPageLoadingMsg('test');
  $('#news #content').html('');
  $('#news #content').append('<ul></ul>');
  $.ajax({
    url: "http://polishboogie.com/get_news.php",
    dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
    cache: false,
    success: function(json) {
      for (var i = 0; i < json.length; i++) {
        var item = '<li data-role="list-divider">' + json[i].polishDate + ' r.</li>';
        item += '<li><a href="#news-prev?id=' + json[i].id_page + '" data-transition="none">';
        item += '<h3>' + json[i].title + '</h3>';
        item += '<p>' + json[i].intro + '</p>';
        item += '</a></li>';
        
        $('#news ul').append(item);
      }
      $('#news ul').listview();
      $.mobile.hidePageLoadingMsg('test');
    },
    error: function() {
      alert("Error");
    },
  });
  
  /*
    $('#news li a').click(function(){
      
      alert(this.id);
    });
  */
});

// Listen for any attempts to call changePage().
$(document).bind("pagebeforechange", function(e, data) {
  
  // We only want to handle changePage() calls where the caller is
  // asking us to load a page by URL.
  if (typeof data.toPage === "string") {
    
    // We are being asked to load a page by URL, but we only
    // want to handle URLs that request the data for a specific
    // category.
    var u = $.mobile.path.parseUrl(data.toPage),
       re = /^#news-prev/;
    
    if (u.hash.search(re) !== -1) {
      
      // We're being asked to display the items for a specific category.
      // Call our internal method that builds the content for the category
      // on the fly based on our in-memory category data structure.
      showNews(u, data.options);
      
      // Make sure to tell changePage() we've handled this call so it doesn't
      // have to do anything.
      e.preventDefault();
    }
  }
});

// Load the data for a specific category, based on
// the URL passed in. Generate markup for the items in the
// category, inject it into an embedded page, and then make
// that page the current active page.
function showNews(urlObj, options)
{
  var newsId = urlObj.hash.replace( /.*id=/, "" );
  
  if (newsId > 0) {
    
    $.mobile.showPageLoadingMsg('test');
    $('#news-prev #content').html('');
    $.ajax({
      url: "http://polishboogie.com/get_news.php?id=" + newsId,
      dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
      cache: true,
      success: function(json) {
        
        var news = json[0];
        
        // Get the object that represents the category we
        // are interested in. Note, that at this point we could
        // instead fire off an ajax request to fetch the data, but
        // for the purposes of this sample, it's already in memory.
        //news = { title: 'testowy newsik' },
        
        // The pages we use to display our content are already in
        // the DOM. The id of the page we are going to write our
        // content into is specified in the hash before the '?'.
        pageSelector = urlObj.hash.replace( /\?.*$/, "" );
        
        if (news.title) {
          // Get the page we are going to dump our content into.
          var $page = $(pageSelector),
           
           // Get the header for the page.
           $header = $page.children(":jqmData(role=header)"),
           
           // Get the content area element for the page.
           $content = $page.children(":jqmData(role=content)"),
           
           // The markup we are going to inject into the content
           // area of the page.
           markup = '<img src="http://polishboogie.com/photos/news/' + news.name + '_medium.jpg" alt="' + news.title + '" />';
           markup += '<p class="bold">' + news.intro + '</p>';
           markup += news.newsContent;
           
           // Find the h1 element in our header and inject the name of
           // the category into it.
           $header.find("h1").html(news.title);
           
           // Inject the category items markup into the content element.
           $content.html(markup);
           
           // Pages are lazily enhanced. We call page() on the page
           // element to make sure it is always enhanced before we
           // attempt to enhance the listview markup we just injected.
           // Subsequent calls to page() are ignored since a page/widget
           // can only be enhanced once.
           $page.page();
           
           // We don't want the data-url of the page we just modified
           // to be the url that shows up in the browser's location field,
           // so set the dataUrl option to the URL for the category
           // we just loaded.
           options.dataUrl = urlObj.href;
           
           // Now call changePage() and tell it to switch to
           // the page we just modified.
           $.mobile.changePage($page, options);
        }
        
        $.mobile.hidePageLoadingMsg('test');
      },
      error: function() {
        alert("Error");
      },
    });
    
  }
}

/*
// When map page opens get location and display map
$('.map').live("pagecreate", function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      initialize(position.coords.latitude, position.coords.longitude);
    });
  }
});

function initialize(lat,lng) {
  var latlng = new google.maps.LatLng(lat, lng);
  var myOptions = {
    zoom: 8,
  center: latlng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}
*/
/*
var mobileDemo = { 'center': '53.663853,17.360222', 'zoom': 15 };
var polana = '53.664966,17.365372';
var mdk = '53.663154,17.355158';
////////////////////////////////////////////////////////////

$('#info').live('pageinit', function() {
  $('#map_canvas').gmap({'center': mobileDemo.center, 'zoom': mobileDemo.zoom, 'disableDefaultUI':true, 'callback': function() {
  var self = this;
  self.addMarker({'position': this.get('map').getCenter() }).click(function() {
    self.openInfoWindow({ 'content': 'Hello World!' }, this);
  });
}}); 
  });
*/

$('.map').live('pageshow', function() {
  $.mobile.showPageLoadingMsg('test');
  
  $('#map_canvas').gmap('addMarker', {'position': '53.664966,17.365372', 'bounds': true}).click(function() {
    $('#map_canvas').gmap('openInfoWindow', {'content': 'Polana Rodzinna w Parku Luizy'}, this);
  });
  $('#map_canvas').gmap('addMarker', {'position': '53.663154,17.355158', 'bounds': true}).click(function() {
    $('#map_canvas').gmap('openInfoWindow', {'content': 'Miejski Dom Kultury'}, this);
  });
  
  $('#map_canvas').gmap('closeInfoWindow');
  $('#map_canvas').gmap('refresh');
  
  $.mobile.hidePageLoadingMsg('test');
});
