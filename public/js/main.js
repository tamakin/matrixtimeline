io = new RocketIO().connect();
var square = 50;
var maxno = 0;
var curno = 0;
var prefix = "box_";
$(function() {
  var width = $(document).width();
  var height = $(document).height();
  var sqwidth = Math.floor(width / square);
  var sqheight = Math.floor(height / square);
  for (var x = 0; x < sqwidth; x++) {
    var sqdiv = $("<div>").addClass("square");
    for (var y = 0; y < sqheight; y++) {
      var div = $("<div>").addClass("box");
      $(div).width(square);
      $(div).height(square);
      $(div).css("line-height", square + "px");
      maxno += 1;
      $(div).attr("id", prefix + maxno);
      $(div).on("click", function(e) {
        var id = $(this).data("id");
        var name = $(this).data("name");
        var text = $(this).data("text");
        if (id) alert(id + " : @" + name + "\r\n" + text);
      });
      $(sqdiv).append(div);
    }
    $("#main").append(sqdiv);
  }
});
io.on("connect", function() {
  console.log("start");
  io.push("start", "start");
});
io.on("mes", function(data) {
  curno += 1;
  var mes = JSON.parse(data.value);
  if (curno > maxno) {
    console.clear();
    var cls = ".box";
    $(cls).css("background-image", "none");
    $(cls).data("id", null);
    $(cls).data("name", null);
    $(cls).data("text", null);
    $(cls).data("protected", null);
    $(cls).data("retweet", null);
    $(cls).text(null);
    $(cls).removeClass("retweet");
    $(cls).removeClass("protected");
    curno = 1;
  }
  var id = "#" + prefix + curno;
  // console.log(id + " : " + data.value);
  $(id).css("background-image", "url('" + mes["image"] + "')");
  $(id).data("id", mes["id"]);
  $(id).data("name", mes["name"]);
  $(id).data("text", mes["text"]);
  $(id).data("protected", mes["protected"]);
  $(id).data("retweet", mes["retweet"]);
  if (mes["retweet"]) { $(id).text("R"); $(id).addClass("retweet"); }
  if (mes["protected"]) { $(id).text("P"); $(id).addClass("protected"); }

});
