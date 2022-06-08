/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */
(function ($) {
    'use strict';

    // Preloader
    $(window).on('load', function () {
        $('#preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });

    // Instagram Feed
    if ($('#instafeed').length !== 0) {
        var accessToken = $('#instafeed').attr('data-accessToken');
        var userFeed = new Instafeed({
            get: 'user',
            resolution: 'low_resolution',
            accessToken: accessToken,
            template:
                '<a href="{{link}}"><img src="{{image}}" alt="instagram-image"></a>'
        });
        userFeed.run();
    }

    setTimeout(function () {
        $('.instagram-slider').slick({
            dots: false,
            speed: 300,
            // autoplay: true,
            arrows: false,
            slidesToShow: 6,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2
                    }
                }
            ]
        });
    }, 1500);

    // e-commerce touchspin
    $("input[name='product-quantity']").TouchSpin({
        min: 1,
        max: 300
    });

    // Video Lightbox
    $(document).on('click', '[data-toggle="lightbox"]', function (event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });

    // Count Down JS
    $('#simple-timer').syotimer({
        year: 2022,
        month: 5,
        day: 9,
        hour: 20,
        minute: 30
    });

    //Hero Slider
    $('.hero-slider').slick({
        // autoplay: true,
        infinite: true,
        arrows: true,
        prevArrow:
            "<button type='button' class='heroSliderArrow prevArrow tf-ion-chevron-left'></button>",
        nextArrow:
            "<button type='button' class='heroSliderArrow nextArrow tf-ion-chevron-right'></button>",
        dots: true,
        autoplaySpeed: 7000,
        pauseOnFocus: false,
        pauseOnHover: false
    });
    $('.hero-slider').slickAnimation();
})(jQuery);

var configs = {
    overlayBackgroundColor: '#000000',
    overlayOpacity: 0.6,
    spinnerIcon: 'ball-running-dots',
    spinnerColor: '#fff',
    spinnerSize: '3x',
    overlayIDName: 'overlay',
    spinnerIDName: 'spinner',
    offsetY: 0,
    offsetX: 0,
    lockScroll: false,
    containerID: null
};

function addToCart(slug) {
    toastr.options.closeButton = true;
    toastr.options.closeMethod = 'fadeOut';
    toastr.options.closeDuration = 300;
    toastr.options.closeEasing = 'swing';
    toastr.options = {
        closeButton: true,
        positionClass: 'toast-bottom-right',
        showDuration: '300',
        closeMethod: 'fadeOut',
        closeEasing: 'swing'
    };

    let quantity = $('#quantity').val();
    if (quantity == undefined) {
        quantity = 1;
    }
    let size = $('#size').val();
    if (size == undefined) {
        size = 'S';
    }
    var session = getCookie('token');

    if (!session) {
        toastr.warning('Hãy đăng nhập trước khi thêm sản phẩm');
    } else {
        JsLoadingOverlay.show(configs);

        $.ajax({
            async: true,
            type: 'POST',
            url: '/addtocart',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            data: { slug, quantity, size },
            // cache: true,
            success: function (res) {
                minicart(res);
                toastr.success('Thêm thành công');
                JsLoadingOverlay.hide();
            },
            error: function (xhr) {
                // alert(id);
                console.log(xhr.responseText);
            }
        });
    }
}

function minicart(res) {
    let sum = 0;
    let html = '';
    if (res.products.length > 0) {
        html += `
    
    <li id="cart-content" class="dropdown cart-nav dropdown-slide">
                        <a href="#!" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown"><i class="tf-ion-android-cart"></i>Giỏ
                            Hàng</a>
                        <div class="dropdown-menu cart-dropdown">`;

        res.products.forEach(function (pro, i) {
            sum += pro.Price * res.cart.Inventory[i].Quantity;
            html +=
                `<div class="media">
                <a class="pull-left" href="#!">
                    <img class="media-object" src="<%= process.env.DOMAIN_SERVER %>/uploads/${pro.Product_image[0]}" alt="image">
                </a>
                <div class="media-body">
                    <h4 class="media-heading"><a href="/products/` +
                pro.Product_slug +
                `">
                    ` +
                pro.Product_name +
                `
                        </a></h4>
                    <div class="cart-price">
                        <span>Size: ` +
                res.cart.Inventory[i].Size +
                `
                                <br>
                        </span>
                        <span>
                        ` +
                res.cart.Inventory[i].Quantity +
                ` x
                        </span>
                        <span>` +
                Intl.NumberFormat().format(pro.Price) +
                `₫</span>
                    </div>
                    <h5><strong>` +
                Intl.NumberFormat().format(
                    pro.Price * res.cart.Inventory[i].Quantity
                ) +
                `₫</strong></h5>
                </div>
                <a href="javascript:(0)" onclick="deleteOneCart('` +
                res.cart.Inventory[i]._id +
                `')" class="remove"><i class="tf-ion-close"></i></a>
            </div>`;
        });

        html +=
            `<div class="cart-summary">
                                    <span>Total</span>
                                    <span class="total-price">
                                        ` +
            Intl.NumberFormat().format(sum) +
            `₫
                                    </span>
                                </div>
                                <ul class="text-center cart-buttons">
                                    <li><a href="/cart" class="btn btn-small">Xem giỏ hàng</a></li>
                                    <li><a href="/checkout" class="btn btn-small btn-solid-border">Thanh toán</a>
                                    </li>
                                </ul>
                                        
                        </div>
                    </li>`;
    } else {
        html += `<li id="cart-content" class="dropdown cart-nav dropdown-slide">
        <a href="#!" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown"><i class="tf-ion-android-cart"></i>Giỏ
            Hàng</a>
        <div class="dropdown-menu cart-dropdown"><h4 style='text-align: center;'>Chưa có sản phẩm được thêm</h4></div>
        </li>`;
    }
    $('#cart-content').replaceWith(html);
}

function cart(res) {
    let sum = 0;
    let html = `<div class="col-md-12 col-xs-12 wrapbox-content-cart cart-container">`;
    if (res.cart.Inventory.length > 0) {
        html += `<div class="">
        <div class="cart-col-left">
            <div class="main-content-cart">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <table class="table-cart">
                    <thead>
                        <tr>
                            <th class="image">&nbsp;</th>
                            <th class="item">Tên sản phẩm</th>
                            <th class="remove">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>`;
        res.products.forEach(function (pro, i) {
            sum += res.cart.Inventory[i].Quantity * pro.Price;
            html +=
                `
                            <tr class="line-item-container">
                                <td class="image">
                                    <div class="product_image">
                                        <a href="/products/` +
                pro.Product_slug +
                `">
                                            <img src="<%= process.env.DOMAIN_SERVER %>/uploads/${pro.Product_image[0]}" alt="` +
                pro.Product_name +
                `">
                                        </a>
                                    </div>
                                </td>
                                <td class="item">
                                    <a href="/products/` +
                pro.Product_slug +
                `">
                                        <h3>
                                            ` +
                pro.Product_name +
                `
                                        </h3>
                                        </a>
                                        <p>
                                        <span>
                                            ` +
                Intl.NumberFormat().format(pro.Price) +
                `₫
                                        </span>
                                        
                                        </p>
                                        <p class="variant">
                                            <select class="variant_title" onchange="updateSize(this, '` +
                res.cart.Inventory[i]._id +
                `')" id="size">`;
            pro.Size.forEach(function (pro) {
                html += `<option `;
                if (res.cart.Inventory[i].Size == pro.Name_size) {
                    html += `selected `;
                }
                html +=
                    `value="` +
                    pro.Name_size +
                    `">` +
                    pro.Name_size +
                    `</option>`;
            });
            html +=
                `</select>
                                            
                                            </p>
                                            <div class="qty quantity-partent qty-click clearfix">
                            <button onclick="updateQuantity('` +
                res.cart.Inventory[i]._id +
                `', 'decrease')" type="button"
                                class="qtyminus qty-btn">-</button>`;
            html +=
                `<input type="text" min="1" value="` +
                res.cart.Inventory[i].Quantity +
                `" class="tc line-item-qty item-quantity">
                            <button onclick="updateQuantity('` +
                res.cart.Inventory[i]._id +
                `', 'increase')" type="button"
                                class="qtyplus qty-btn">+</button>
                            </div>
                            <p class="price">
                            <span class="line-item-total">
                                ` +
                Intl.NumberFormat().format(
                    res.cart.Inventory[i].Quantity * pro.Price
                ) +
                `₫
                            </span>
                            </p>
                            </td>
                            <td class="remove">
                    <a href="javascrip:(0)" onclick="deleteOneCart(` +
                res.cart.Inventory[i]._id +
                `)" class="cart">
                        <img src="//theme.hstatic.net/1000378196/1000788468/14/ic_close.png?v=54"></a>
                    </td>
                    </tr>`;
        });
        html +=
            `</tbody>
                        </table>
                        </div>
                        <div class="col-md-12 col-sm-12 col-xs-12 text-right">
                            <p class="order-infor">
                                Tổng tiền:
                                <span class="total_price"><b>
                                        ` +
            Intl.NumberFormat().format(sum) +
            `₫
                                    </b></span>
                                </p>
                                <div class="cart-buttons">
                                <a class="button dark mt-20" href="/collections/all" title="Tiếp tục mua hàng"><i class="fa fa-reply"></i>Tiếp
                                    tục mua hàng</a>
                                <a class="button dark mt-20" href="/checkout">Thanh toán</a>
                                
                                </div>
                                
                                
                                </div>
                                </div>
    </div>
        
        
        </div>`;
    } else {
        html = `<section class="empty-cart page-wrapper">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 col-md-offset-3">
                            <div class="block text-center">
                                <i class="tf-ion-ios-cart-outline"></i>
                                <h2 class="text-center">Không có gì trong giỏ hàng của bạn.</h2>
                                <a href="/" class="button dark mt-20">Mua sắm</a>
                            </div>
                        </div>
                    </div>
            </section>
        
                </div>
</div>`;
    }
    $('.cart-container').replaceWith(html);
}

function deleteOneCart(id) {
    JsLoadingOverlay.show(configs);
    toastr.options = {
        closeButton: true,
        positionClass: 'toast-bottom-right',
        showDuration: '300',
        closeMethod: 'fadeOut',
        closeEasing: 'swing'
    };

    $.ajax({
        async: true,
        type: 'POST',
        url: '/deletecart',
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        data: { id: id },
        success: function (res) {
            minicart(res);
            cart(res);
            toastr.success('Xóa thành công');
            JsLoadingOverlay.hide();
        },
        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function updateQuantity(id, method) {
    toastr.options = {
        closeButton: true,
        positionClass: 'toast-bottom-right',
        showDuration: '300',
        closeMethod: 'fadeOut',
        closeEasing: 'swing'
    };
    JsLoadingOverlay.show(configs);
    $.ajax({
        async: true,
        type: 'POST',
        url: '/updatequantity',
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        data: { id, method },
        success: function (res) {
            minicart(res);
            cart(res);
            JsLoadingOverlay.hide();
        },
        error: function (xhr) {
            // alert(id);
            console.log(xhr.responseText);
        }
    });
}

function getCookie(cname) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function validate(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function updateSize(sel, id) {
    toastr.options = {
        closeButton: true,
        positionClass: 'toast-bottom-right',
        showDuration: '300',
        closeMethod: 'fadeOut',
        closeEasing: 'swing'
    };
    JsLoadingOverlay.show(configs);
    $.ajax({
        async: true,
        type: 'POST',
        url: '/updateSize',
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        data: { id: id, size: sel.value },
        success: function (res) {
            minicart(res);
            JsLoadingOverlay.hide();
        },
        error: function (xhr) {
            // alert(id);
            console.log(xhr.responseText);
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
