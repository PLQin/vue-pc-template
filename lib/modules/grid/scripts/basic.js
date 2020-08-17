/*
    Copyright (C) 2010 mycolorway.com
    All rights reserved
    script for tab component
*/


//表单1
( function( $ ) {
    
$( function() {
    $( ".grid1" ).grid({
        url: "data.json",
        columns: [
            { "header": "指标名称", "dataIndex": "name" },
            { "header": "指标值", "dataIndex": "current", "width": 100, "align": "right" },
            { "header": "状态", "dataIndex": "status", "width": 100, "align": "right" },
            { "header": "环比", "dataIndex": "ring", "width": 100, "align": "right" }
        ],
        border: true
    });

    // 表单2
    $( ".grid2" ).grid({
        url: "data.json",
        columns: [
            { "header": "指标名称", "dataIndex": "name" },
            { "header": "指标值", "dataIndex": "current", "width": 80, "align": "right", "renderer": ratioRenderer },
            { "header": "状态", "dataIndex": "status", "width": 80, "align": "right", "renderer": statusRenderer },
            { "header": "环比", "dataIndex": "ring", "width": 80, "align": "right", "renderer": ringRenderer },
            { "header": "操作", "dataIndex": "id", "width": 100, "align": "center", "renderer": operationRenderer }
        ],
        border: true,
        rowover: true,
        paging: true,
        selectable: true
    }).bind( "rowselect", function( e, row ) {
        alert( "你选择了第" + ( row.index + 1 ) + "行：" + row.data.name + ", " + row.data.current );
    });

    //表单3
    $( ".grid3" ).grid({
        url: "data.json",
        columns: [
            { "header": "指标名称", "dataIndex": "name", "sortable": true },
            { "header": "指标值", "dataIndex": "current", "width": 80, "align": "right", "renderer": ratioRenderer, "sortable": true },
            { "header": "状态", "dataIndex": "status", "width": 80, "align": "right", "renderer": statusRenderer },
            { "header": "环比", "dataIndex": "ring", "width": 80, "align": "right", "renderer": ringRenderer, "hidden": true },
            { "header": "操作", "dataIndex": "id", "width": 100, "align": "center", "renderer": operationRenderer }
        ],
        border: true,
        rowover: true,
        paging: true,
        selectable: true,
        colMenu: true
    }).bind( "rowselect", function( e, row ) {
        alert( "你选择了第" + ( row.index + 1 ) + "行：" + row.data.name + ", " + row.data.current );
    }).bind( "sort", function( e, sort ) {
        alert( sort.status );
    });

    //表单4
    $( ".grid4" ).grid({
        url: "tree.json",
        columns: [
            { "header": "部门", "dataIndex": "name" },
            { "header": "本月创单量", "dataIndex": "current", "width": 100, "align": "right" },
            { "header": "同比", "dataIndex": "tongbi", "width": 100, "align": "right", "renderer": ratioRenderer },
            { "header": "环比", "dataIndex": "huanbi", "width": 100, "align": "right", "renderer": ratioRenderer }
        ],
        border: true,
        rowover: true,
        selectable: true,
        tree: true
    });

});

function ratioRenderer( val, rowIndex, colIndex ) {
    return Math.round( val * 100 ) + "%";
}

function ringRenderer( val, rowIndex, colIndex ) {
    var span = $( "<span/>", {
        "class": val > 0 ? "increase" : "decrease",
        text: ( val > 0 ? "+" : "" ) + val + "%"
    });
    return span;
}

function statusRenderer( val, rowIndex, colIndex, row, col ) {
    var span = $( "<span/>", {
        "class": "help",
        title: "良好范围值：0%-30%；一般范围值：30%-60%；差范围值：60%-90%",
        text: ["差", "一般", "良好"][val]
    });

    if ( row.current < 0.3 ) {
        span.css( "color", "#ff0000" );
    }

    return span;
}

function operationRenderer( val, rowIndex, colIndex, row, col ) {
    this.addClass( "links" );

    var link1 = $( "<a/>", {
        href: "javascript:void(0);",
        text: "分析"
    }).click( function( e ) {
        e.preventDefault();
        e.stopPropagation();
        alert( "你点击了分析链接：id(" + val + "); header(" + col.header + ")" );
    });

    var link2 = $( "<a/>", {
        href: "javascript:void(0);",
        text: "转派"
    }).click( function( e ) {
        e.preventDefault();
        e.stopPropagation();
        alert( "你点击了转派链接：id(" + val + "); header(" + col.header + ")" );
    });
    return [link1, "|", link2];
}

})( jQuery );
