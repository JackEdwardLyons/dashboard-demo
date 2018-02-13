

var runGantt = function (el, data, start, end) {
    $("#" + el).gantt({
        data: data,
        startDate: start,
        endDate: end
    });
    $("#" + el).addClass("loaded in");
}
$(document).ready(function () {

    var bid_token = "3E09D9E5-3CC6-44A4-AEB6F28B6B806F07";
    var start_token = "2018-02-11";
    var end_token = "2018-03-25";
    var equipment = ["20G0", "42G0", "45G0"];
    var validation_req = true;
    var setTabPrices = function (step) {
        //Get each carrier tab data and update value = unit x qty
        if (step > 1) {
            var price = 0.00;
            for (var eq in carrierRates) {
                if (carrierRates.hasOwnProperty(eq)) {
                    var eqobj = carrierRates[eq];
                    for (var rate in eqobj) {
                        if (eqobj.hasOwnProperty(rate)) {
                            var rateobj = eqobj[rate];
                            if (rate == "scac") {
                                var scac = rateobj;
                            } else {
                                var eq_code = rate;
                                var eq_unit = rateobj["unit"];
                                if (eq_unit == null) {
                                    price = "no rates";
                                } else {
                                    var $eq_qty = $("input#_" + eq_code);
                                    var qty = $eq_qty.val();
                                    price += eq_unit / 100 * qty;
                                }
                            }
                            //console.log( rateobj );
                        }
                    }
                    $("button.btn-" + scac).text((price).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2
                    }));
                }
            }
        }
    }
    var setEqQtyBadge = function (step, eq, qty) {
        var $badge = $("#" + step + "-" + eq + "-qty-badge");
        var $input = $("#_" + eq);
        $badge.html(qty);
        if (qty != "?") {
            $input.val(qty);
            if (qty != "0") {
                $badge.removeClass("hide");
            } else {
                $badge.addClass("hide");
            }
            setTabPrices(step);
        }
    }

    $('eq-qty').on('click', function () {
        setEqQtyBadge();
    })

    var setValidationMessage = function (msg, el, html, fadeout) {
        html = (typeof html == "undefined") ? false : html;
        fadeout = (typeof fadeout == "undefined") ? true : fadeout;
        el = (typeof el == "undefined") ? "" : "-" + el;
        var $message = $("span#errors-validation" + el).find('.validation-message');
        if (html) {
            $message.html(msg);
        } else {
            $message.text(msg);
        }
        //In case it has been hidden recently
        $('.timed-message').fadeIn('fast');
        if (fadeout) {
            setTimeout(function () {
                $('.timed-message').fadeOut('slow');
                $('span.validate').removeClass("required").addClass("text-muted");
            }, 8000); // <-- time in milliseconds
        }
    }
    var showEquipmentValidation = function (show) {
        if (show) {
            $('span.validate[data-field="equipment"]')
                .addClass("required in")
                .html(
                    "<i class='fa fa-exclamation-triangle'></i>&nbsp;At least one equipment type must be selected."
                );
            //effects
            setTimeout(function () {
                $('span.validate[data-field="equipment"]').removeClass("required").addClass(
                    "text-muted");
            }, 3000); // <-- time in milliseconds
        } else {
            $('span.validate[data-field="equipment"]').fadeIn('fast').removeClass("required in");
        }
    }
    var validateEquipment = function () {
        var eqCount = 0;
        //manage validate message
        //validate and set the message if required
        jQuery.each(equipment, function (i, eq) {
            eqCount += parseInt($("input.eqt-val[name='" + eq + "']").val());
        });
        showEquipmentValidation(eqCount === 0);
        return eqCount;
    }
    var formInit = function (form) {
        $('form#' + form + ':input').val("").dirtyForms('setClean');
        //Add the bid_token
        $("input[name='bid']").val(bid_token);
        //add the date tokens
        $("input[name='start_date']").val(start_token);
        $("input[name='end_date']").val(end_token);
        //reset equipment vals to '0',set badge
        jQuery.each(equipment, function (i, eq) {
            $("a.eq-qty[data-eq='" + eq + "'][data-qty='0'").click();
        });
    }

    if (true) {
        setEqQtyBadge("2", "20G0", '0');
        setEqQtyBadge("2", "42G0", '0');
        setEqQtyBadge("2", "45G0", '5');
    } else {
        setEqQtyBadge("2", "20G0", "?");
        setEqQtyBadge("2", "42G0", "?");
        setEqQtyBadge("2", "45G0", "?");
    }

    var ganttData = schedulesData.filter(function (gd) {
        return gd.carrier_scac === "ZIMU"; // e.g "PABV"
    });

    // init the current active tab
    var pane_id = "ZIMU";
    var ganttStart = new Date('2017-12-06');
    var ganttEnd = new Date('2018-03-19');

    runGantt(pane_id, ganttData, ganttStart, ganttEnd);
    validateEquipment();
    //on tab change SET the scac (active tab) and reload
    $('#carrier-tabs a').on('click', function (e) {
        var $this = $(this);
        var pane_id = $this.parent().data("pane_id");
        if (pane_id === "All") {
            if (!$("#pane_id").hasClass("loaded")) {
                //do not filter schedulesData
                runGantt(pane_id, schedulesData, ganttStart, ganttEnd);
            }
        } else {
            ganttData = schedulesData.filter(function (gd) {
                return gd.carrier_scac === pane_id;
            });
            runGantt(pane_id, ganttData, ganttStart, ganttEnd);
        }
    });
});