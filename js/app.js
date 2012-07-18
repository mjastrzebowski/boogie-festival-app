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
    success: function(json) {
      for (var i = 0; i < json.length; i++) {
        var item = '<li data-role="list-divider">' + json[i].date + ' r.</li>';
        item += '<li><a href="#news?id=' + json[i].id_page + '">';
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
});
