/* Nano Templates - https://github.com/trix/nano */

function nano(template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
        var keys = key.split("."), v = data[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
}

var map = null;

function initMap(){
    map = new google.maps.Map(document.getElementById('shops-map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });

    renderShops();
}

function renderShops(){
    var bounds = [];
    var image = {
        url: "/resources/images/shop-pin.png",
        scaledSize: new google.maps.Size(32, 32),
        anchorPoint: new google.maps.Point(16, 16)
    }
    $.each(shops, function(i, shop){
        bounds.push(shop.position);
        var marker = new google.maps.Marker({
            icon: image,
            position: new google.maps.LatLng(shop.position.lat, shop.position.lng),
            title: shop.title,
            map: map
        });
    });

    fitMapToBounds(bounds);
}

function fitMapToBounds(bounds) {
    var mapBounds = new google.maps.LatLngBounds();
    for (var i = 0; i < bounds.length; i++) {
        mapBounds.extend(new google.maps.LatLng(bounds[i].lat, bounds[i].lng));
    }
    map.fitBounds(mapBounds);
}


$( document ).ready(function() {
   
    $("nav ul li a[href^='#']").on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
          }, 1000, function(){
            window.location.hash = hash;
          });
     });

    function renderAboutUs(){
        var container = $('#aboutus-slider');
        var template = $('#slideTemplate');
        $.each(aboutus, function(i, about){
            about.active = i == 0 ? 'active' : '';
            $(nano(template.html(), about))
            .appendTo(container);
        });
    }

    function renderBeers(){
        var container = $('#beer-container');
        var template = $('#beerTemplate');
        $.each(beers, function(i, beer){
            beer.id = i;
            $(nano(template.html(), beer))
            .appendTo(container);

            renderScale(beer, "ibu");
            renderScale(beer, "body");
            renderScale(beer, "hop");
            renderScale(beer, "malt");
            renderScale(beer, "alcohol");
        });
    }

    function renderScale(beer, property){
        var container = $('#' + property + '-' + beer.id);
        var template = $('#scaleTemplate');
        var i = 0
        while(i < 10){
            i++;
            var colors = {stroke: 'black', fill: 'transparent'};
            if(i*10 <= beer[property]){
                colors.fill = beer.color;
            }
            $(nano(template.html(), colors))
            .appendTo(container);
        }
    }

    function renderGallery(){
        var container = $('#gallery');
        var template = $('#pictureTemplate');
        $.ajax({
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            url: 'https://www.oceanica.com.uy/instafeed.php',
            success: function(images){
                $.each(images, function(i, picture){
                    $(nano(template.html(), {src: picture.url}))
                    .appendTo(container);
                });
            }
         });
        
    }

    renderAboutUs();
    renderBeers();
    renderGallery();
});