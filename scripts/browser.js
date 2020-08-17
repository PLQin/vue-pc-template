(function ($) {

  SyntaxHighlighter.defaults["toolbar"] = false;
  SyntaxHighlighter.defaults["gutter"] = false;

  $(function () {

    $(".nav-list a").live("mouseenter", function (e) {
      $(this).addClass("over")
        .siblings()
        .removeClass("over");

      $("#txt-search").focus();
    }).live("mouseleave", function (e) {
      $(this).removeClass("over");
    }).live("click", function (e) {
      $("#txt-search").focus();

      if ($(this).hasClass("selected")) {
        return;
      }

      var name = this.hash.substring(1);
      var desc = $(this).find(".module-desc").text();
      var path = "lib/modules/" + name + "/";
      var module = $("#module").show();
      $("#home").hide();

      module.find("h2").text(name);
      module.find("p.desc").text(desc);
      module.find("#link-view-src")
        .removeClass("expanded");
      module.find(".demo-src").html("<p>正在加载...</p>")
        .data("loaded", false)
        .hide();
      module.find(".demo iframe")
        .attr("src", path)
        .width("0");

      var docs = module.find(".docs").empty();
      $.ajax({
        url: path + "doc.html",
        success: function (result) {
          if (result) {
            docs.html(result);
            SyntaxHighlighter.highlight();
          }
          setTimeout(function () {
            module.find(".demo iframe")
              .width($("p.desc").outerWidth() - 2);
          }, 100);
        }
      });


      $(".nav-list").find("a[href$=" + this.hash + "]")
        .addClass("selected")
        .siblings()
        .removeClass("selected");

      location.hash = this.hash;
    });

    $("#txt-search").keydown(function (e) {
      if (e.which == 13 || e.which == 38 || e.which == 40) {
        e.preventDefault();
      }
    })

    $("#txt-search").keyup(function (e) {
      if (e.which == 13) { //enter
        $(".nav-list:visible a.over").click();
      } else if (e.which == 38) { //up
        var list = $(".nav-list:visible");
        var over = list.find("a.over");
        over = over.length ? over : list.find("a.selected");
        if (over.length && over.prev("a").length) {
          over.removeClass("over")
            .prev("a")
            .addClass("over");
        }
      } else if (e.which == 40) { //down
        var list = $(".nav-list:visible");
        var over = list.find("a.over");
        over = over.length ? over : list.find("a.selected");
        if (over.length) {
          if (over.next("a").length) {
            over.removeClass("over")
              .next("a")
              .addClass("over");
          }
        } else {
          list.find("a:first").addClass("over");
        }
      } else {
        var s = $(this).val(),
          mlist = $("#module-list"),
          slist = $("#search-result").empty();

        if (s) {
          var regex = new RegExp('(<[^>]*>)|(\\b' + s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + ')', 'ig');
          var results = mlist.hide()
            .find("a:contains(" + s + ")")
            .clone()
            .appendTo(slist)
            .each(function () {
              var n = $(this);
              n.html(n.html().replace(regex, function (a, b, c) {
                return (a.charAt(0) == '<') ? a : '<em class="keyword">' + c + '</em>';
              }));
            });

          results.first().addClass("over")
            .siblings().removeClass("over");
          results.removeClass("odd selected")
            .filter(":odd")
            .addClass("odd");
          slist.show();
          $(window).triggerHandler("resize");
        } else {
          mlist.show();
          slist.hide();
        }
      }
    }).focus();

    $("#link-home").click(function (e) {
      e.preventDefault();
      $(".nav-list a").removeClass("selected");
      $("#home").show();
      $("#module").hide();
      location.hash = "";
    });

    $("#link-view-src").click(function (e) {
      e.preventDefault();
      $(this).toggleClass("expanded");
      var demoSrc = $(".demo-src").toggle();

      if (demoSrc.is(":visible") && !demoSrc.data("loaded")) {
        $.ajax({
          url: $(".demo iframe").attr("src"),
          dataType: "text",
          success: function (result) {
            demoSrc.empty()
              .data("loaded", true);

            result = result.replace(/</g, "&lt;");
            if ($.browser.msie) {
              $("<pre>").appendTo(demoSrc)[0].outerHTML = '<pre class="brush:html">' + result + "</pre>";
            } else {
              $("<pre>").addClass("brush:html")
                .append(result)
                .appendTo(demoSrc);
            }
            //SyntaxHighlighter.highlight();
          }
        });
      }
    });

    $("#link-new-win").click(function (e) {
      e.preventDefault();
      var src = $(".demo iframe").attr("src");
      window.open(src);
    });

    $(window).resize(function () {
      var searchW = $(".search").width();
      $("#txt-search").width(searchW - 20);
      $(".nav-list .module-desc").width(searchW - 40);

      var windowH = $(window).height(),
        searchH = $(".search").height();
      $(".nav-list").height(windowH - searchH);
      $(".main-content").height(windowH - searchH);
    }).triggerHandler("resize");

    $.ajax({
      url: "nav.html",
      success: function (result) {
        if (result) {
          var list = $("#module-list").append(result);

          list.find(".loading")
            .remove();

          list.find("a")
            .filter(":odd")
            .addClass("odd");

          $(window).triggerHandler("resize");

          if (location.hash) {
            list.find("a[href$=" + location.hash + "]")
              .click();
          }
        } else {
          $(".module-list .loading").text("加载模块列表失败");
        }
      }
    });

    $.ajax({
      url: "home.html",
      success: function (result) {
        if (result) {
          $("#home .main-content .entry")
            .empty()
            .html(result);

          SyntaxHighlighter.highlight();
        }
      }
    });

  });

})(jQuery);