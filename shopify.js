"use strict";
var sDOMAIN = "https://shopicruit.myshopify.com";

if(window.location.href.indexOf(sDOMAIN) === -1) {
    window.console.log("please run this JavaScript under https://shopicruit.myshopify.com/");
    window.console.log("because this code doesn't support cross origin request!");
} else {

var sENDPOINT = "/admin/orders.json";
var sACCESSTOKEN = "c32313df0d0ef512ca64d5b336a0d7c6";
var xhr = new XMLHttpRequest();
var fTotalRevenue = 0.00;
var bEmptyPage = false;

var revenuePerOrder = function(oOrder) {
    var fRevenue = 0.00;
    var aShippingLines = oOrder.shipping_lines;
    var fTotalShippingFee = 0.00;
    // total_price: The sum of all the prices of all the items in the order
    // taxes and discounts included (must be positive) - from API website
    var fTotalPrice = parseFloat(oOrder.total_price);
    if(aShippingLines) {
        for(var i = 0; i < aShippingLines.length; i++) {
            // assume price includes tax for shipping fee
            fTotalShippingFee += aShippingLines[i].price;
        }
    }
    fRevenue = fTotalPrice + fTotalShippingFee;
    return fRevenue;
};

var revenuePerPage = function(aOrders) {
    var fRevenuePerPage = 0.00;
    if(aOrders && aOrders.length !== 0) {
        for(var i = 0; i < aOrders.length; i++) {
            fRevenuePerPage += revenuePerOrder(aOrders[i]);
        }
    } else {
        bEmptyPage = true;
    }
    return fRevenuePerPage;
};

xhr.onload = function () {
    var oResponse = JSON.parse(xhr.responseText);
    var aOrders = oResponse.orders;
    var fRevenuePerPage = revenuePerPage(aOrders);
    fTotalRevenue += fRevenuePerPage;
    if(!bEmptyPage) {
        window.console.log("Total revenue so far is: " + fTotalRevenue.toFixed(2) + " CDN");
    } else {
        window.console.log("Your total revenue is: " + fTotalRevenue.toFixed(2) + " CDN");
    }
};

for(var iPage = 1; !bEmptyPage; iPage++) {
    var sParam = "?" + "page=" + iPage + "&" + "access_token=" + sACCESSTOKEN;
    var sUrl = sDOMAIN + sENDPOINT + sParam;
    xhr.open("GET", sUrl, false);
    xhr.send();
}

}