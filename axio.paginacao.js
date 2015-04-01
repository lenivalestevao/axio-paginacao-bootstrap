/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * @author Lenival Estevão
 * @since 24/03/2015
 * 
 *  <ul class="pagination">
 *  </ul>
 *  $('.table').paginacao({pagerSelector: '.pagination', perPage: 10, total: 300});
 * 
 */


$.fn.paginacao = function (opts) {
    var $this = this,
            defaults = {
                perPage: 10,
                total: 0,
                pagerSelector: ''
            },
    settings = $.extend(defaults, opts);

    var perPage = parseInt(settings.perPage);
    var total = parseInt(settings.total);
    var pagerSelector = settings.pagerSelector;
    var totalPages = parseInt(total / perPage) + 1;
    var tbody = $this.find("tbody");
    var tr = $(tbody).find("tr");
    var html = new Array();

    html.push("<li class='primeira'><a href='#'>&laquo;</a></li>");

    for (var x = 1; x <= totalPages; x++) {
        html.push("<li class='pag_" + x + "'><a href='#'>" + x + "</a></li>");
    }

    html.push("<li class='ultima'><a href='#'>&raquo;</a></li>");

    var linha = 0, pg = 1;
    for (var x = 0; x < tr.length; x++) {

        if (perPage == linha) {
            linha = 0;
            pg++;
        }

        $(tr[x]).addClass("pg_" + pg);

        linha++;
    }

    $(pagerSelector).html(html.join(" "));

    $(tr).hide();
    $(".pg_1").show();
    $(".pag_1").addClass("active");

    $(".primeira").unbind();
    $(".primeira").on("click", function () {
        $("[class^='pg_']").hide();
        $(".pg_1").show();
        $("[class^='pag_']").removeClass("active");
        $(".pag_1").addClass("active");
    });

    $(".ultima").unbind();
    $(".ultima").on("click", function () {
        $("[class^='pg_']").hide();
        $(".pg_" + totalPages).show();
        $("[class^='pag_']").removeClass("active");
        $(".pag_" + totalPages).addClass("active");
    });

    $("[class^='pag_']").unbind();
    $("[class^='pag_']").on("click", function () {
        var pg = $(this).attr("class").split("_")[1];

        if (!$(".active").hasClass("pag_" + pg)) {
            $("[class^='pg_']").hide();
            $(".pg_" + pg).show();
            $("[class^='pag_']").removeClass("active");
            $(".pag_" + pg).addClass("active");
        }

    });

};
