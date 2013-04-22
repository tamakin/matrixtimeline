io = new RocketIO().connect();
var square = 30;
var maxno = 0;
var curno = 0;
var prefix = "box_";
var opacity = 0.5;
$(function() {
  // var width = $(document).width();
  // var height = $(document).height();
  // var width = $("html").width();
  // var height = $("html").height();
  var width = $(window).width();
  var height = $(window).height();
  var mainwidth = width;
  var divheight = Math.floor(height / 3)
  var mainheight = divheight * 2;
  var sqwidth = Math.floor(mainwidth / square);
  var sqheight = Math.floor(mainheight / square);
  for (var x = 0; x < sqwidth; x++) {
    var sqdiv = $("<div>").addClass("square");
    for (var y = 0; y < sqheight; y++) {
      var div = $("<div>").addClass("box");
      $(div).css("line-height", square + "px");
      maxno += 1;
      var id = prefix + maxno;
      $(div).attr("id", id);
      $(div).css("-moz-opacity", opacity);
      $(div).css("opacity", opacity);
      $(div).on("click", function(e) {
        var data = $(this).data("data");
        if (data) {
          var mes = JSON.parse(data);
          MakeTimeline("#info .tl", mes, id, true);
        }
      });
      $(div).on("mouseenter", function(e) {
        $(this).css("-moz-opacity", 1);
        $(this).css("opacity", 1);
      });
      $(div).on("mouseleave", function(e) {
        $(this).css("-moz-opacity", opacity);
        $(this).css("opacity", opacity);
      });

      $(div).text(maxno);
      $(sqdiv).append(div);
    }
    $("#main").append(sqdiv);
  }
  $(".box").css("width", square + "px");
  $(".box").css("height", square + "px");
  $("#sub").width($("#main").width());
  $("#sub").height(divheight);
  $("#timeline").width($("#main").width() / 2);
  $("#info").width($("#main").width() / 2);
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
    $(cls).data("data", null);
    $(cls).data("id", null);
    $(cls).text("");
    $(cls).removeClass("retweet");
    $(cls).removeClass("protected");
    $("#timeline .tl li").remove();
    $("#info .tl li").remove();
    curno = 1;
  }
  var id = "#" + prefix + curno;
  // console.log(id + " : " + data.value);
  $(id).css("background-image", "url('" + mes["image"] + "')");
  $(id).data("data", data.value);
  $(id).data("id", prefix + curno);
  $(id).text("");
  if (mes["retweet"]) { $(id).text("R"); $(id).addClass("retweet"); }
  if (mes["protected"]) { $(id).text("P"); $(id).addClass("protected"); }
  MakeTimeline("#timeline .tl", mes, prefix + curno, false);
});

function MakeTimeline(node, mes, id, mode) {
  var li = $("<li>");

  var img = $("<img>");
  $(img).attr("src", mes["image"]);
  $(img).addClass("favicon");

  var name = $("<a>");
  $(name).attr("href", "https://twitter.com/{0}".format(mes["screen_name"]));
  $(name).attr("target", "_blank");
  $(name).text("{0} / (@{1})".format(mes["name"], mes["screen_name"]));

  var twpage = $("<a>");
  $(twpage).attr("href", "https://twitter.com/{0}/status/{1}".format(mes["screen_name"], mes["id"]));
  $(twpage).attr("target", "_blank");
  $(twpage).text("{0}".format(mes["created_at"]));

  var source = $(mes["source"]);

  var delpage = $("<a>");
  $(delpage).attr("href", "#");
  $(delpage).text("{0}".format("削除"));
  $(delpage).on("click", function(e) {
    $(this).closest("li").remove();
  });

  var span = $("<span>");
  var txt = mes["text"].replace(/\r\n/g, '\n');
  txt = txt.replace(/\r/g, '\n');
  $(span).html(txt.replace(/\n/g, "<br>"));

  var space = "<span>&nbsp;/&nbsp;</span>";

  var append = [];
  append.push($(img));
  append.push($(name));
  append.push($("<br>"));
  append.push($(span));
  append.push($("<br>"));
  append.push($(twpage));
  append.push($(space));
  append.push($("<span>F:{0} R:{1}</span>".format(mes["favorite_count"], mes["retweet_count"])));
  append.push($(space));
  append.push($(source));
  if (mode) {
    append.push($(space));
    append.push($(delpage));
  }
  if (mes["retweet"]) { $(li).addClass("tlretweet"); }
  if (mes["protected"]) { $(li).addClass("tlprotected"); }
  $(li).on("dblclick", function(e) {
    $("#" + id).trigger("click");
  });
  $(li).on("mouseenter", function(e) {
    $("#" + id).trigger("mouseenter");
  });
  $(li).on("mouseleave", function(e) {
    $("#" + id).trigger("mouseleave");
  });

  $(li).append(append);
  $(node).prepend(li);
}

if (String.prototype.format == undefined) {
  String.prototype.format = function(arg) {
    var rep_fn = undefined;
    if (typeof arg == "object") {
      rep_fn = function(m, k) { return arg[k]; }
    }
    else {
      var args = arguments;
      rep_fn = function(m, k) { return args[ parseInt(k) ]; }
    }
    return this.replace( /\{(\w+)\}/g, rep_fn );
  }
}
