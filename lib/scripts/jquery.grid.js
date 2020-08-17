/*
    Copyright (C) 2010 mycolorway.com
    All rights reserved
    script for jquery grid plugin, based on jquery ui widget
*/

;( function( $ ) {

$.widget( "ccw.grid", {
    
    options: {
        url: "",
        params: {},
        data: null,
        columns: [],
        border: "",
        stripe: true,
        rowover: false,
        selectable: false,
        selectType: "radio",
        paging: false,
        pagingToolbar: true,
        capacity: 10,
        colResizable: false,
        colMinWidth: 80,
        tree: false,
        holderSize: 16,
        colMenu: false,
        loadingText: "正在请求数据..."
    },
    
    _init: function() {
        var opts = this.options;
        
        this.element.addClass( "grid" );
        if ( opts.tree ) {
            this.element.addClass( "tree-grid" );
        }
        
        if ( opts.border ) {
            if ( opts.border === true ) {
                this.element.css( "border-width", "1px" );
            } else {
                this.element.css( "border-width", opts.border );
            }
		}
        
        if ( opts.paging && !opts.tree ) {
            this._currentPage = 1;
        }
        
        if ( opts.columns ) {
            this._generateMarkup();
        }
        
        if ( opts.data ) {
            this._data = opts.data;
            if ( opts.tree ) {
                this.addNode( this._data );
            } else {
                this.add( this._data );
            }
            this._refreshStripe();
            
            this.element.trigger( "load", [this.element] );		
        } else {
            var params = opts.params
            if ( opts.paging ) {
                params = $.extend({}, params, {
                    start: ( this._currentPage - 1 ) * opts.capacity,
                    offset: opts.capacity
                });
            }
            
            $.ajax({
                url: opts.url,
                type: "POST",
                data: params,
                dataType: "json",
                success: $.proxy( function( result ) {                    
                    this._data = result.data;
                    var data = this._data;
                    if ( opts.tree ) {
                        this.addNode( data );
                    } else if ( opts.paging ) {
                        this._pageCount = Math.ceil(( result.total || data.length ) / opts.capacity );
                        data = this._pageData( data );
                        this.add( data );
                    } else {
                        this.add( data );
                    }
                    this._refreshStripe();
                    
                    this.element.find( ".content-loading" )
                        .remove();
                    
                    this.element.trigger( "load", [this.element] );
                }, this )
            });
        }
    },
    
    _generateMarkup: function() {
        var opts = this.options;
        this.element.empty();
        
        var tableWrapper = $( "<div/>", {
            "class": "data-table-wrapper"
        }).appendTo( this.element );
        var table = $( "<table/>", {
            "class": "data-table"
        }).appendTo( tableWrapper );
        var thead = $( "<thead/>" ).appendTo( table );
        var hrow = $( "<tr/>" ).appendTo( thead );
        var tbody = $( "<tbody/>" ).appendTo( table );
        
        $.each( opts.columns, $.proxy( function( index, config ) {
            var th = $( "<th/>", {
                "class": config.sortable ? " sortable" : ""
            }).bind( "selectstart mousedown", function( e ) {
                e.preventDefault();
                return false;
            }).data( "config", config )
                .appendTo( hrow );
            
            var inner = $( "<div/>", {
                "class": "th-inner"
            }).append( '<div class="th-text">' + config.header + '</div>' )
                .appendTo( th );
            
            if ( opts.colResizable && !opts.colMenu ) {
                inner.append( '<div class="resize-handle"></div>' );
            }
            
            if ( config.align || config.headerAlign ) {
                th.css( "text-align", config.headerAlign || config.align );
            }
            
            if ( index == 0 ) {
                th.addClass( "first" );
            } else if ( index == opts.columns.length - 1 ) {
                th.addClass( "last" );
            }
            
            if ( config.width && !config.hidden ) {
                th.width( config.width );
            }
            
            if ( config.hidden ) {
                th.hide();
            }
        }, this ));
        
        this.element.append( '<div class="content-loading"><p>' + opts.loadingText + '</p></div>');
        
        if ( opts.paging && opts.pagingToolbar && !opts.data ) {
            this.element.append( this._generatePageToolbar());
        }
        
        if ( opts.colMenu ) {
            $( "<a/>", {
                "class": "link-col-menu",
                text: "+"
            }).appendTo( tableWrapper );
            
            var colMenu = $( "<div/>", {
                "class": "col-menu"
            }).appendTo( tableWrapper );
            
            var colMenuList = $( "<div/>", {
                "class": "col-menu-list clearfix"
            }).appendTo( colMenu );
            
            var colMenuBtn = $( "<div/>", {
                "class": "col-menu-buttons"
            }).appendTo( colMenu );
            
            $( "<button/>", {
                "class": "btn-close-col-menu",
                text: "选好了"
            }).appendTo( colMenuBtn );
            
            $.each( opts.columns, function( i, config ) {
                var cb = $( "<input/>", {
                    type: "checkbox",
                    value: config.dataIndex
                });
                
                $( "<label/>" ).append( cb )
                    .append( config.header )
                    .appendTo( colMenuList );
                
                cb[0].checked = !config.hidden;
            });
        }
        
        this._initEvents();
    },
    
    _initEvents: function() {
        var opts = this.options;
        var tbody = this.element.find( "tbody" );
        
        if ( opts.rowover ) {
            $( "tr", tbody[0] ).live( "mouseenter", function( e ) {
                $( this ).css({
                    cursor: "pointer"
                }).addClass( "over" );
            });
            
            $( "tr", tbody[0] ).live( "mouseleave", function( e ) {
                $( this ).css({
                    cursor: "default"
                }).removeClass( "over" );
            });
        }
        
        if ( opts.selectable ) {
            $( "tr", tbody[0] ).live( "click", $.proxy( function( e ) {
                e.preventDefault();
                var row = $( e.currentTarget );
                
                if ( opts.selectType == "radio" ) {
                    row.addClass( "selected" )
                        .siblings()
                        .removeClass( "selected" );
                } else if ( opts.selectType == "checkbox" ) {
                    row.toggleClass( "selected" );
                } else {
                    return;
                }
                
                this.element.trigger( "rowselect", [{
                    index: tbody.find( "tr" ).index( row ),
                    select: row.hasClass( "selected" ),
                    data: row.data( "data" )
                }]);
            }, this ));
        }
        
        if ( opts.colResizable && !opts.colMenu ) {
            this.element.find( ".resize-handle").each( $.proxy( function( i, handle ) {
                handle = $( handle );
                var th = handle.closest( "th" );
                handle.mousedown( $.proxy( function( e ) {
                    e.preventDefault();
                    var oldX = e.pageX;
                    var oldWidth = th.width();
                    var tableWidth = this.element.width();
                    var helper = $( "<div/>", {
                        "class": "resize-helper",
                        css: {
                            width: oldWidth,
                            left: th.position().left
                        }
                    }).bind( "selectstart mousedown", function( e ) {
                        e.preventDefault();
                        return false;
                    }).appendTo( this.element.find( ".data-table-wrapper" ));
                    
                    $( document ).bind( "mousemove.grid", function( e ) {
                        var w = Math.round( e.pageX - oldX + oldWidth );
                        w = w < opts.colMinWidth ? opts.colMinWidth : w; 
                        var maxWidth = tableWidth - th.siblings( ":visible" ).length * opts.colMinWidth;
                        if ( w < opts.colMinWidth ) {
                            w = opts.colMinWidth;
                        } else if ( w > maxWidth ) {
                            w = maxWidth;
                        }
                        helper.width( w );
                    }).one( "mouseup", $.proxy( function( e ) {
                        $( document ).unbind( "mousemove.grid" );
                        $( "body" ).css( "cursor", "default" );
                        
                        var newWidth = helper.width();
                        var cols = [];
                        th.siblings( ":visible" ).each( function( i, c ) {
                            cols.push( $( c ).width());
                        }).each( function( i, c ) {
                            $( c ).width( Math.floor( cols[i] / ( tableWidth - oldWidth ) * ( tableWidth - newWidth )));
                        });
                        th.width( newWidth );
                        
                        helper.remove();
                    }, this ));
                    
                    $( "body" ).css( "cursor", "w-resize" );
                }, this ));
            }, this ));
        }
        
        if ( opts.colMenu ) {
            var colMenu = this.element.find( ".col-menu" );
            
            colMenu.find( ".btn-close-col-menu" ).click( function( e ) {
                colMenu.hide();
            });
            
            colMenu.find( "input:checkbox" ).click( $.proxy( function( e ) {
                var cb = $( e.currentTarget );
                var hidden = !cb.is( ":checked" );
                var colIndex = this._getColumn( cb.val()) + 1;
                var cells = this.element.find( "td:nth-child(" + colIndex + "), th:nth-child(" + colIndex + ")");
                if ( hidden ) {
                    cells.css( "display", "none" );
                } else {
                    cells.css( "display", $.browser.msie ? "block" : "table-cell" );
                }
                cells.filter( "th" ).data( "config" ).hidden = hidden;
            }, this ));
            
            this.element.find( ".link-col-menu" ).click( function( e ) {
                e.preventDefault();
                colMenu.toggle();
            });
        }
        
        this.element.find( "thead th" ).click( $.proxy( function( e ) {
            var th = $( e.currentTarget );
            var col = th.data( "config" );
            if ( col.sortable && !opts.tree ) {
                this._sortRows( th ); 
            }
        }, this ));
        
        $( "tr", tbody[0] ).live( "click", $.proxy( function( e ) {
            e.preventDefault();
            var row = $( e.currentTarget );
            this.element.trigger( "rowclick", [{
                index: tbody.find( "tr" ).index( row ),
                data: row.data( "data" )
            }]);
        }, this ));
        
        $( "tr", tbody[0] ).live( "dblclick", $.proxy( function( e ) {
            e.preventDefault();
            var row = $( e.currentTarget )
            this.toggle( row );
            this.element.trigger( "rowdblclick", [{
                index: tbody.find( "tr" ).index( row ),
                data: row.data( "data" )
            }]);
        }, this ));
        
        $.each([
            "load",
            "rowselect",
            "rowclick",
            "rowdblclick"
        ], $.proxy( function( i, e ) {
            if ( $.isFunction( opts[e] )) {
                this.element.bind( e, $.proxy( opts[e], this.element ));
            }
        }, this ));
    },
    
    _getColumn: function( dataIndex ) {
        var colIndex = -1;
        this.element.find( "thead th" ).each( function( i, th ) {
            var config = $( th ).data( "config" );
            if ( config.dataIndex == dataIndex ) {
                colIndex = i;
                return false;
            }
        });
        return colIndex;
    },
    
    _generatePageToolbar: function() {
        var pageToolbar = $( "<div/>", {
            "class": "paging-toolbar"
        });
        
        $( "<a/>", {
            "class": "link-first-page",
            href: "javascript:void(0);",
            text: "首页"
        }).click( $.proxy( function( e ) {
            e.preventDefault();
            this.firstPage();
        }, this )).appendTo( pageToolbar );
        
        $( "<a/>", {
            "class": "link-prev-page",
            href: "javascript:void(0);",
            text: "上一页"
        }).click( $.proxy( function( e ) {
            e.preventDefault();
            this.prevPage();
        }, this )).appendTo( pageToolbar );
        
        var txtPage = $( "<input/>", {
            type: "text",
            "class": "txt-current-page"
        }).keydown( $.proxy( function( e ) {
            if ( e.which != 13 ) {
                return;
            }
            
            e.preventDefault();
            var txt = $( e.currentTarget );
            var val = txt.val();
            if ( isNaN( val )) {
                txt.val( "1" );
                return;
            }
            
            this.page( Math.round( val ));
        }, this ));
        
        $( "<span/>" ).addClass( "page-info" )
            .append( "第" )
            .append( txtPage )
            .append( "页" )
            .appendTo( pageToolbar );
        
        $( "<span/>" ).addClass( "page-info" )
            .append( "共<span class='total-page'></span>页" )
            .appendTo( pageToolbar );
        
        $( "<a/>", {
            "class": "link-next-page",
            href: "javascript:void(0);",
            text: "下一页"
        }).click( $.proxy( function( e ) {
            e.preventDefault();
            this.nextPage();
        }, this )).appendTo( pageToolbar );

        $( "<a/>", {
            "class": "link-last-page",
            href: "javascript:void(0);",
            text: "末页"
        }).click( $.proxy( function( e ) {
            e.preventDefault();
            this.lastPage();
        }, this )).appendTo( pageToolbar );
        
        return pageToolbar;
    },
    
    _pageData: function( data ) {
        var opts = this.options;
        
        var toolbar = this.element.find( ".paging-toolbar" );
        toolbar.find( ".txt-current-page" ).val( this._currentPage );
        toolbar.find( ".total-page" ).text( this._pageCount || Math.ceil( data.length / opts.capacity ));
        
        if ( this._currentPage == 1 ) {
            toolbar.find( ".link-prev-page" ).addClass( "disabled" );
            toolbar.find( ".link-first-page" ).addClass( "disabled" );
        } else {
            toolbar.find( ".link-prev-page" ).removeClass( "disabled" );
            toolbar.find( ".link-first-page" ).removeClass( "disabled" );
        }
        
        if ( this._currentPage == this._pageCount ) {
            toolbar.find( ".link-next-page" ).addClass( "disabled" );
            toolbar.find( ".link-last-page" ).addClass( "disabled" );
        } else {
            toolbar.find( ".link-next-page" ).removeClass( "disabled" );
            toolbar.find( ".link-last-page" ).removeClass( "disabled" );
        }
        
        return data;
    },
    
    _refreshStripe: function() {
        if ( !this.options.stripe ) {
            return;
        }
        
        this.element.find( "tbody tr" )
            .removeClass( "even" )
            .filter( ":odd" )
            .addClass( "even");
    },
    
    _nodeId: function() {
        if ( !this.lastId ) {
            this.lastId = 0;
        }
        return ++this.lastId;
    },
    
    _childNodes: function( parent ) {
        if ( typeof parent != "string" ) {
            parent = $( parent ).attr( "nodeid" );
        }
        
        return this.element.find( "tbody tr[parentid=" + parent + "]" );
    },
    
    _descendants: function( parent ) {
        var children = this._childNodes( parent );
        $.each( children, $.proxy( function( i, c ) {
            children = children.add( this._descendants( c ));
        }, this ));
        
        return children;
    },
    
    _sortRows: function( col ) {		
        var config = col.data( "config" );
        var tbody = this.element.find( "tbody" );
        var rows = tbody.find( "tr" ).get();
        if ( !rows.length ) {
            return;
        }

		if ( col.hasClass( "sort-asc" ) ) {
			col.removeClass( "sort-asc" )
				.addClass( "sort-desc" );
		} else {
			col.removeClass( "sort-desc" )
				.addClass( "sort-asc" );
		}
		col.siblings().removeClass( "sort-asc" )
			.removeClass( "sort-desc" );

		if( this.options.paging ){
			var sortType;
			if( col.hasClass("sort-asc") ){
				sortType = "asc"
			}else{
				sortType = "desc"
			}
			$.extend( this.options.params, {
            	sortId: config.dataIndex,
				sortType: sortType
			})
			this.page( 1 );
		}else{ 
			var sortType = config.sortType || ( typeof $( rows[0] ).data( "data" )[config.dataIndex] );
			var sortFunc = config.sortFunc || $.fn.grid.sortFunc[sortType]( config.dataIndex )
				|| $.fn.grid.sortFunc["string"]( config.dataIndex );
			rows.sort( sortFunc );
			if ( col.hasClass( "sort-desc" ) ) {
				rows.reverse();
			}
			$.each( rows, function( i, r ) {
			   tbody.append( r ); 
			});
			
			this._refreshStripe();
		}
    },
    
    toggle: function( node ) {
        node = $( node );
        if ( !node.hasClass( "node-parent" )) {
            return;
        }
        
        var descendants = this._descendants( node );
        if ( node.hasClass( "node-collapsed" )) {
            node.removeClass( "node-collapsed" )
                .addClass( "node-expanded" );
            descendants.each( function( i, d ) {
                d = $( d );
                d.data( "visible" ) === false ? d.hide() : d.show();
                d.removeData( "visible" );
            });
        } else if ( node.hasClass( "node-expanded" )) {
            node.removeClass( "node-expanded" )
                .addClass( "node-collapsed" );
            descendants.each( function( i, d ) {
                d = $( d );
                d.data( "visible", d.is( ":visible" ))
                    .hide();
            });
        }
    },
    
    collapse: function( node ) {
        node = $( node );
        if ( !node.hasClass( "node-parent" )) {
            return;
        }
        
        var descendants = this._descendants( node );
        node.removeClass( "node-expanded" )
            .addClass( "node-collapsed" );
        descendants.hide();
    },
    
    collapseAll: function() {
        var parents = this.element.find( "tbody tr.node-parent" );
        parents.each( $.proxy( function( index, node ) {
            this.collapse( node )
        }, this ));
    },
    
    expand: function( node ) {
        node = $( node );
        if ( !node.hasClass( "node-parent" )) {
            return;
        }
        
        var descendants = this._descendants( node );
        node.removeClass( "node-collapsed" )
            .addClass( "node-expanded" );
        descendants.show();
    },
    
    expandAll: function() {
        var parents = this.element.find( "tbody tr.node-parent" );
        parents.each( $.proxy( function( index, node ) {
            this.expand( node )
        }, this ));
    },
    
    add: function( row, rowIndex ) {
        if ( $.isArray( row )) {
            $.each( row, $.proxy( function( i, r ) {
                this.add( r, rowIndex );
                rowIndex && rowIndex++;
            }, this ));
            return;
        }
        
        var opts = this.options;
        var tr = $( "<tr/>" ).data( "data", row );
        var cols = this.element.find( "thead th" );
        var rows = this.element.find( "tbody tr" );
        
        $.each( cols, function( colIndex, col ) {
            var config = $( col ).data( "config" );
            var td = $( "<td/>" );
            
            if ( config.align ) {
                td.css( "text-align", config.align );
            }
            
            if ( colIndex == 0 ) {
                td.addClass( "first" );
            } else if ( colIndex == cols.length - 1 ) {
                td.addClass( "last" );
            }
            
            var val = row[config.dataIndex];
            var content = val;
            if ( typeof config.renderer == "function" ) {
                content = config.renderer.apply( td, [val, rowIndex, colIndex, row, config] );
            } else if ( typeof config.renderer == "string" ) {
                content = eval( config.renderer ).apply( td, [val, rowIndex, colIndex, row, config] );
            }
            
            if( $.isArray( content )) {
                $.each( content, function( index, item ) {
                    td.append( item );
                });
            } else {
                td.append( content );
            }
            
            if ( config.hidden ) {
                td.hide();
            }
            
            tr.append( td );
        });
        
        if ( rowIndex ) {
            rows.eq( rowIndex ).before( tr );
        } else {
            this.element.find( "tbody" )
                .append( tr );
        }
    },
    
    addNode: function( node, parent ) {
        if ( $.isArray( node )) {
            $.each( node, $.proxy( function( i, d ) {
                this.addNode( d, parent );
            }, this ));
            return;
        }
        
        if ( parent && typeof parent == "string" ) {
            if ( typeof parent == "string" ) {
                parent = this.element.find( "tbody tr[nodeid=" + parent + "]" );
            } else {
                parent = $( parent );
            }
        }
        
        var opts = this.options;
        var tr = $( "<tr/>" ).data( "data", node );
        var cols = this.element.find( "thead th" );
        var depth = parent ? parent.attr( "depth" ) * 1 + 1 : 0;
        
        tr.attr({
            nodeid: this._nodeId(),
            parentid: parent ? parent.attr( "nodeid" ) : undefined,
            depth: depth
        });
        
        $.each( cols, $.proxy( function( colIndex, col ) {
            var config = $( col ).data( "config" );
            var td = $( "<td/>" );
            var container = td;
            
            if ( config.align ) {
                td.css( "text-align", config.align );
            }
            
            if ( colIndex == 0 ) {
                td.addClass( "first" )
                    .attr( "unselectable", "on" );
                var toggler = $( "<span/>", {
                    "class": "node-toggler",
                    css: {
                        "margin-left": depth * opts.holderSize
                    }
                }).hover(
                    function() {
                        $( this ).addClass( "node-toggler-over" );
                    },
                    function() {
                        $( this ).removeClass( "node-toggler-over" );
                    }
                ).click( $.proxy( function( e ) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggle( $( e.currentTarget ).closest( "tr" ));
                }, this )).prependTo( td );
                
                var container = $( "<div/>" )
                    .addClass( "node-wrapper" )
                    .attr( "unselectable", "on" )
                    .appendTo( td );
                
                if ( $.isArray( node.children ) && node.children.length > 0 ) {
                    if ( opts.collapsed || node.collapsed ) {
                        tr.addClass( "node-collapsed" );
                    } else {
                        tr.addClass( "node-expanded" );
                    }
                    
                    tr.addClass( "node-parent" );
                }
            } else if ( colIndex == cols.length - 1 ) {
                td.addClass( "last" );
            }
            
            var val = node[config.dataIndex];
            var content = val;
            if ( typeof config.renderer == "function" ) {
                content = config.renderer.apply( td, [val, parent, colIndex, node, config] );
            } else if ( typeof config.renderer == "string" ) {
                content = eval( config.renderer ).apply( td, [val, parent, colIndex, node, config] );
            }
            
            if( $.isArray( content )) {
                $.each( content, function( index, item ) {
                    container.append( item );
                });
            } else {
                container.append( content );
            }
            
            if ( config.hidden ) {
                td.hide();
            }
            
            tr.append( td );
        }, this ));
        
        if ( parent ) {
            var descendants = this._descendants( parent );
            if ( descendants.length > 0 ) {
                descendants.last().after( tr );
            } else {
                parent.after( tr );
            }
            
            parent.addClass( "node-parent" );
        } else {
            this.element.find( "tbody" )
                .append( tr );
        }
        
        if ( $.isArray( node.children ) && node.children.length > 0 ) {
            $.each( node.children, $.proxy( function( i, c ) {
                this.addNode( c, tr );
            }, this ));
        }
    },
    
    page: function( index ) {
        var opts = this.options;
        if ( !opts.paging || isNaN( index ) || index < 1 || index > this._pageCount ) {
            return;
        }
        
        this._currentPage = index;
        var wrapper = this.element.find( ".data-table-wrapper" );
        
        if ( !opts.url ) {
            this._pageCount = Math.ceil( this._data.length / opts.capacity );
            
            this.element.find( "tbody" ).empty();
            this.add( this._pageData( this._data ));
            this._refreshStripe();
            wrapper.height( "auto" );
        } else {  
            $.ajax({
                url: opts.url,
                type: "POST",
                data: $.extend({}, opts.params, {
                    start: ( index - 1 ) * opts.capacity,
                    offset: opts.capacity
                }),
                dataType: "json",
                success: $.proxy( function( result ) {
                    this._data = result.data;
                    this._pageCount = Math.ceil(( result.total || this._data.length ) / opts.capacity );
                    
                    this.element.find( "tbody" ).empty();
                    this.add( this._pageData( this._data ));
                    this._refreshStripe();
                }, this )
            });
        }
    },
    
    firstPage: function() {
        if ( this._currentPage == 1 ) {
            return;
        }
        this.page( 1 );
    },
    
    lastPage: function() {
        if ( this._currentPage == this._pageCount ) {
            return;
        }
        this.page( this._pageCount );
    },
    
    nextPage: function() {
        this.page( this._currentPage + 1 );
    },
    
    prevPage: function() {
        this.page( this._currentPage - 1 );
    },
    
    currentPage: function() {
        return this._currentPage;
    },
    
    pageCount: function() {
        return this._pageCount;
    }
});

$.fn.grid.sortFunc = {
    string: function( dataIndex ) {
        return function( a, b ) {
            a = $( a ).data( "data" )[dataIndex];
            b = $( b ).data( "data" )[dataIndex];
            if ( a == b ) {
                return 0;
            }
            return a > b ? 1 : -1;
        };
    },
    number: function( dataIndex ) {
        return function( a, b ) {
            a = $( a ).data( "data" )[dataIndex];
            b = $( b ).data( "data" )[dataIndex];
            return a - b;
        }
    },
    date: function( dateFormat ) { //require date.js
        return function( a, b ) {
            a = Date.parseExact( $( a ).data( "data" )[dataIndex], dateFormat )
            b = Date.parseExact( $( b ).data( "data" )[dataIndex], dateFormat )
            return a - b;
        }
    }
};
    
})( jQuery );
