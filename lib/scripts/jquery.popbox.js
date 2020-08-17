; (function ($) {

    var template = {
        box: '<div class="popbox"><div class="popbox-arrow"></div><div class="popbox-inner"><div class="popbox-content"></div></div></div>',
        button: '<button class="popbox-button">#{text}</button>',
        link: '<a class="popbox-link" href="#">#{text}</a>',
        text: '<span class="popbox-text">#{text}</span>'
    };

    $.widget("ccw.popbox", {

        options: {
            width: "auto",
            height: "auto",
            content: null,
            autoShow: true,
            position: "right left bottom top",
            offset: 5,
            arrowWidth: 20,
            arrowHeight: 10,
            buttons: [],
            hide: null,
            show: null
        },

        _init: function () {
            var opts = this.options;
            this.box = $(template.box)
                .data("popsrc", this.element)
                .appendTo("body")
                .hide();
            this.box.find(".popbox-inner")
                .width(opts.width)
                .height(opts.height);
            this.box.find(".popbox-content")
                .append($(opts.content).show());

            if (opts.title) {
                $("<h3/>", {
                    text: opts.title
                }).prependTo(this.box.find(".popbox-content"));
            }

            if (opts.buttons && opts.buttons.length) {
                var buttonBar = $('<div class="popbox-buttons clearfix"></div>');

                $.each(opts.buttons, $.proxy(function (i, b) {
                    if (b.type == "text") {
                        $(template.text.replace(/#\{text\}/g, b.text))
                            .addClass(b.align)
                            .addClass(b.cls)
                            .appendTo(buttonBar);
                    } else {
                        b.type = b.type || "button";
                        $(template[b.type].replace(/#\{text\}/g, b.text))
                            .addClass(b.align)
                            .addClass(b.cls)
                            .appendTo(buttonBar)
                            .click($.proxy(function (e) {
                                e.preventDefault();
                                if ($.isFunction(b.handler)) {
                                    b.handler.call(this.box, e);
                                }
                            }, this));
                    }
                }, this));

                this.box.find(".popbox-inner")
                    .append(buttonBar);
            }

            this._initEvents();

            if (opts.autoShow) {
                this.show();
            }
        },

        _initEvents: function () {
            var opts = this.options;

            if (opts.hide) {
                this.element.bind("pophide", opts.hide);
            }

            if (opts.show) {
                this.element.bind("popshow", opts.show);
            }
        },

        _checkPosition: function (pos, ui) {
            var opts = this.options;
            if (pos == "right") {
                if (ui.elL + ui.elW + opts.offset + opts.arrowHeight + ui.boxW + 10 > ui.winW) {
                    return false;
                } else {
                    return true;
                }
            } else if (pos == "left") {
                if (ui.elL - opts.offset - opts.arrowHeight - ui.boxW - 10 < 0) {
                    return false;
                } else {
                    return true;
                }
            } else if (pos == "top") {
                if (ui.elT - opts.offset - opts.arrowHeight - ui.boxH - 10 < 0) {
                    return false;
                } else {
                    return true;
                }
            } else if (pos == "bottom") {
                if (ui.elT + ui.elH + opts.offset + opts.arrowHeight + ui.boxH + 10 > ui.winH) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        },

        boxEl: function () {
            return this.box;
        },

        show: function () {
            var opts = this.options;
            this.box.show()
                .removeClass("popbox-hidden");
            this.refresh();

            this.element.trigger("popshow", [this.box]);
        },

        hide: function (accessible) {
            if (this.box.hasClass("popbox-hidden") || !this.box.is(":visible")) {
                return;
            }

            if (accessible) {
                this.box.css({
                    left: "-99999999px"
                }).addClass("popbox-hidden");
            } else {
                this.box.hide();
            }

            this.element.trigger("pophide", [this.box]);
        },

        remove: function () {
            this.box.remove();
        },

        refresh: function () {
            if (this.box.hasClass("popbox-hidden")) {
                return;
            }

            var opts = this.options,
                position = "",
                winW = $(window).width(),
                winH = $(window).height(),
                elW = this.element.outerWidth(),
                elH = this.element.outerHeight(),
                elT = this.element.offset().top,
                elL = this.element.offset().left,
                boxW = this.box.outerWidth(),
                boxH = this.box.outerHeight(),
                boxT = 0,
                boxL = 0,
                arrowT = 0,
                arrowL = 0;

            $.each(opts.position.split(" "), $.proxy(function (i, p) {
                var valid = this._checkPosition(p, {
                    winW: winW,
                    winH: winH,
                    elW: elW,
                    elH: elH,
                    elT: elT,
                    elL: elL,
                    boxW: boxW,
                    boxH: boxH
                });

                if (valid) {
                    position = p;
                    return false;
                }
            }, this));

            if (position == "right") {
                boxT = elT - ((boxH - elH) / 2);
                boxL = elL + elW + opts.offset + opts.arrowHeight;
                arrowT = elT - boxT + (elH / 2) - (opts.arrowWidth / 2);
                arrowL = - opts.arrowHeight;
                if (boxT - 10 < 0) {
                    boxT = 10;
                } else if (boxT + boxH + 10 > winH) {
                    boxT = winH - boxH - 10;
                }
            } else if (position == "left") {
                boxT = elT - ((boxH - elH) / 2);
                boxL = elL - opts.offset - opts.arrowHeight - boxW;
                arrowT = elT - boxT + (elH / 2) - (opts.arrowWidth / 2);
                arrowL = boxW;
                if (boxT - 10 < 0) {
                    boxT = 10;
                } else if (boxT + boxH + 10 > winH) {
                    boxT = winH - boxH - 10;
                }
            } else if (position == "top") {
                boxT = elT - opts.offset - opts.arrowHeight - boxH;
                boxL = elL - ((boxW - elW) / 2);
                arrowT = boxH;
                arrowL = elL - boxL + (elW / 2) - (opts.arrowWidth / 2);
                if (boxL - 10 < 0) {
                    boxL = 10;
                } else if (boxL + boxW + 10 > winW) {
                    boxL = winW - boxW - 10;
                }
            } else if (position == "bottom") {
                boxT = elT + elH + opts.offset + opts.arrowHeight;
                boxL = elL - ((boxW - elW) / 2);
                arrowT = - opts.arrowHeight;
                arrowL = elL - boxL + (elW / 2) - (opts.arrowWidth / 2);
                if (boxL - 10 < 0) {
                    boxL = 10;
                } else if (boxL + boxW + 10 > winW) {
                    boxL = winW - boxW - 10;
                }
            }

            this.box.removeClass("popbox-top popbox-right popbox-bottom popbox-left")
                .addClass("popbox-" + position)
                .css({
                    top: boxT,
                    left: boxL
                })
                .find(".popbox-arrow").css({
                    top: arrowT,
                    left: arrowL
                });
        }

    });

}(jQuery));