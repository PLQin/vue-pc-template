
;( function( $ ) {

$.widget( "ccw.datetime", {
    
    options: {
        showOn: "focus",
        buttonImage: "images/icon/icon-calendar.png",
        buttonImageOnly: true,
        dateFormat: "yyyy/MM/dd",
        time: true,
        seconds: false,
        changeYear: true,
        changeMonth: false
    },
    
    _init: function() {
        var el = this.element;
        var opts = this.options;
        opts.timeFormat = opts.seconds ? "HH:mm:ss" : "HH:mm";
        
        el.datepicker({
            showOn: opts.showOn,
            buttonImage: opts.buttonImage,
            buttonImageOnly: opts.buttonImageOnly,
            dateFormat: this._dateFormat( opts.dateFormat ),
            beforeShow: $.proxy( this._updateTimepicker, this ),
            changeYear: opts.changeYear,
            changeMonth: opts.changeMonth,
            onClose: $.proxy( function( dateText, inst ) {
                this._updateField( inst );
                inst.dpDiv.empty();
                this.timepicker = null;
            }, this ),
            onChangeMonthYear: $.proxy( function( year, month, inst ) {
                inst.dpDiv.empty();
                this.timepicker = null;
                this._updateTimepicker( el, inst );
            }, this )
        }).keydown( function( e ) {
            return false;
        });
    },
    
    _dateFormat: function( format ) {
        return format.replace( /dddd/g, "DD" )
            .replace( /ddd/g, "D" )
            .replace( /MMMM/g, "MM" )
            .replace( /MMM/g, "M" )
            .replace( /MM/g, "mm" )
            .replace( /M/g, "m" )
            .replace( /yy/g, "y" );
    },
    
    _updateTimepicker: function( field, inst ) {
        var opts = this.options;
        if ( !opts.time ) {
            return;
        }
        
        var container = inst.dpDiv;
        if ( !container.find( ".ui-datepicker-calendar" ).length ) {
            setTimeout( $.proxy( function (){
                this._updateTimepicker( field, inst );
            }, this ), 50 );
            return;
        }
        
        this.timepicker = $( "<div/>", {
            "class": "timepicker"
        }).appendTo( container );
        
        var hour = $( "<select/>", {
            "class": "timepicker-hour"
        }).appendTo( this.timepicker );
        
        this.timepicker.append( "<span> : </span>" );
        
        var minute = $( "<select/>", {
            "class": "timepicker-minute"
        }).appendTo( this.timepicker );
        
        if ( opts.seconds ) {
            this.timepicker.append( "<span> : </span>" );
        
            var second = $( "<select/>", {
                "class": "timepicker-second"
            }).appendTo( this.timepicker );
        }
        
        for ( var i = 0; i < 24; i++ ) {
            var h = Date.today().set({
                hour: i
            }).toString( "HH" );
            hour.append( '<option value="' + h + '">' + h + '</option>' );
        }
        
        for ( var i = 0; i < 60; i++ ) {
            var m = Date.today().set({
                minute: i
            }).toString( "mm" );
            minute.append( '<option value="' + m + '">' + m + '</option>' );
            if ( opts.seconds ) {
                second.append( '<option value="' + m + '">' + m + '</option>' );
            }
        }
        
        var time = Date.parseExact( $( field ).val(), opts.dateFormat + " " + opts.timeFormat ) || new Date();
        hour.val( time.toString( "HH" ));
        minute.val( time.toString( "mm" ));
        if ( opts.seconds ) {
            second.val( time.toString( "ss" ));
        }
        
        this.timepicker.find( "select" ).change( $.proxy( function() {
            this._updateField( inst );
        }, this ));
        
        // fix display bug in ie8
        container.removeClass( "ui-helper-clearfix" )
            .addClass( "ui-helper-clearfix" );
    },
    
    _updateField: function( inst ) {
        var opts = this.options;
        if ( opts.time ) {
            var hour = this.timepicker.find( ".timepicker-hour" ).val() * 1;
            var minute = this.timepicker.find( ".timepicker-minute" ).val() * 1;
            var second = opts.seconds ? this.timepicker.find( ".timepicker-second" ).val() * 1 : "";
            var time = new Date( inst.selectedYear, inst.selectedMonth, inst.selectedDay , hour, minute, second );
            this.element.val( time.toString( opts.dateFormat + " " + opts.timeFormat ));
        }
    }
    
});
    
})( jQuery );