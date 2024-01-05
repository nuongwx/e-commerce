
function loadMoreReviews(id) {
    $.ajax({
        // url: '/shop/' + id + '/review?page=' + page,
        url: '/product/' + id + '/reviews?page=' + document.getElementById('more-reviews-btn').getAttribute('rel'),
        type: 'GET',
        success: function (data) {
            if (data.length < 3) {
                document.getElementById('more-reviews-btn').remove();
            } else {
                document.getElementById('more-reviews-btn').setAttribute('rel', parseInt(document.getElementById('more-reviews-btn').getAttribute('rel')) + 1);
            }
            console.log(data);
            data.forEach(function (review) {
                document.getElementById("reviews").innerHTML += Handlebars.templates.review(review);
            });

        }
    });
}

function getSearchResults() {
    // xd
    $.ajax({
        url: '/shop/query?category_id=' + document.getElementById('category').value + '&min=' + document.getElementById('min').value + '&max=' + document.getElementById('max').value + '&sort=' + document.getElementById('sort').value + '&order=' + document.getElementById('order').value + '&name=' + document.getElementById('name').value,
        type: 'GET',
        // data: { query: query },
        success: function (data) {
            console.log(data);
            document.getElementsByClassName("product-lists")[0].innerHTML = "";
            if (data.products.count == 0) {
                document.getElementsByClassName("product-lists")[0].innerHTML = '<div class="col-lg-12 text-center min-vh-25"><h1> No products found</h1></div>';
                $('.pagination-wrap ul li a').remove();
                return;
            }
            var count = data.products.count;
            var limit = 3;
            var pages = Math.ceil(count / limit);
            var pagination = '';
            for (var i = 1; i <= pages; i++) {
                pagination += '<li><a href="#" rel="' + i + '">' + i + '</a></li>';
            }
            document.querySelector('.pagination-wrap ul').innerHTML = pagination;

            let products = Array.from(data.products.rows);
            document.getElementsByClassName("product-lists")[0].innerHTML = "";
            products.forEach(function (product) {
                $(".product-lists").append(Handlebars.templates.product(product));
                $(".product-lists").isotope('reloadItems').isotope();
            });

            $('.pagination-wrap ul li a:first').addClass('active');
            $('.pagination-wrap ul li a').click(function (e) {
                $('.pagination-wrap ul li a').removeClass('active');
                $(this).addClass('active');
                e.preventDefault();
                var pageNum = this.rel;
                $.ajax({
                    url: '/shop/query?category_id=' + document.getElementById('category').value + '&min=' + document.getElementById('min').value + '&max=' + document.getElementById('max').value + '&sort=' + document.getElementById('sort').value + '&order=' + document.getElementById('order').value + '&name=' + document.getElementById('name').value + '&page=' + pageNum,
                    type: 'GET',
                    success: function (data) {
                        console.log(data);
                        document.getElementsByClassName("product-lists")[0].innerHTML = "";
                        let products = Array.from(data.products.rows);
                        products.forEach(function (product) {
                            $(".product-lists").append(Handlebars.templates.product(product));
                            $(".product-lists").isotope('reloadItems').isotope();
                        });
                    }
                });
            });
            document.getElementsByClassName('active')[0].click();
        }
    });
}

function pessimisticReview(id) {
    $.ajax({
        url: '/product/' + id + '/reviews',
        type: 'POST',
        data: {
            rating: document.querySelector('input[name="rating"]:checked').value,
            comment: document.getElementById('comment').value
        },
        success: function (data) {
            console.log(data);
            $("#reviews").prepend(Handlebars.templates.review(data));
            document.getElementById('comment').value = "";
        }
    });
}

function addToCart(id) {
    $.ajax({
        url: '/cart/update',
        type: 'POST',
        data: {
            productId: id,
            quantity: document.getElementById('quantity').value
        },
        success: function (data) {
            console.log(data);
            $('#notify').html('Added to cart');
            $('#notification').modal('show');
            $('#close-modal').click(function () {
                $('#notification').modal('hide');
            });
        }
    });
}