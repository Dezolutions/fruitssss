$(function () {


  /*лоадер*/
  let mask = document.querySelector('.mask');
  window.addEventListener('load', () => {
    mask.classList.add('loader-hide');
    setTimeout(() => {
      mask.remove();
    }, 600);
  })

  /*инициализация плагина wow.js*/
  new WOW().init();

  /*добавление товара в корзину из выбраного слайда на первом экране */
  $('.main__btn').on('click', function () {
    let quantity = $('.slick-current .slider__item').attr('data-quantity');
    let name = $('.slick-current .slider__item').attr('data-name');
    let img = $('.slick-current .slider__item').attr('data-img');
    let price = $('.slick-current .slider__item').attr('data-price');
    $('.modal__product-block').append(`<div class="modal__product-item"><div class="modal__product-item-close"><i class="fas fa-trash"></i></div>
     <img src="${img}" alt="">
     <div class="modal__product-item-descr">
       <h6 class="modal__product-title">${name}</h6>
       <p class="modal__product-subtitle"> 1шт. - диаметр 75(мм)
         масса 150(г)
       </p>
       <p class="modal__product-count">Кол-во <strong>${quantity}</strong></p>
     </div>
     <div class="modal__product-item-price" data-price = "${price}">${price}₴</div></div>`);
    deleteFromCart();
    modalEmpty();
    generalPrice();

  })
  /*слайдер с фруктами на первом экране*/
  $('.fruit-slider').slick({
    infinite: true,
    fade: true,
    prevArrow: '<div class="fruit-slider__arrow-left"><img src="./img/main-left.png" alt=""></div>',
    nextArrow: '<div class="fruit-slider__arrow-right"><img src="./img/main-right.png" alt=""></div>',
    asNavFor: '.bg-slider'
  });

  /*слайдер заднего фона на первом экране*/
  $('.bg-slider').slick({
    arrows: false,
    fade: true,
    asNavFor: '.fruit-slider'
  })

  /*анимация при перелистывании слайда*/
  $('.fruit-slider__arrow-right, .fruit-slider__arrow-left').on('click', function () {
    $('.fruit-slider .slick-slide').css('animation-name', 'none');
    $('.fruit-slider .slick-current').css('animation-name', 'transFormSlide');
  })

  /*слайдер с отзывами*/
  $('.reviews__slider').slick({
    slidesToShow: 3,
    prevArrow: '<div class="review-slider__arrow-left"><img src="./img/left-review.png" alt=""></div>',
    nextArrow: '<div class="review-slider__arrow-right"><img src="./img/right-review.png" alt=""></div>',
    responsive: [
      {
        breakpoint: 1120,
        settings: {
          slidesToShow: 2

        }
      },
      {
        breakpoint: 1030,
        settings: {
          slidesToShow: 1

        }

      }
    ]
  })

  //==========ПРИМЕР РЕАЛИЗАЦИИ ПРОКРУТКИ К СЕКЦИИ НА ЧИСТОМ JS=====//
  // const links = document.querySelectorAll('a[href^="#"');
  // for(let link of links){
  //   link.addEventListener('click', event => {
  //     event.preventDefault();
  //     const blockId = link.getAttribute('href');
  //     document.querySelector('' +blockId).scrollIntoView({
  //       behavior: 'smooth',
  //       block: "start"
  //     })
  //   })
  // }

  /*прокрутка к секции на jQuery*/
  $('a[href^="#"]').on('click', function () {
    let target = $(this).attr('href');
    $('html,body').animate({
      scrollTop: $(target).offset().top
    }, 500);
    $('.nav__btn').removeClass('nav__btn-active');
    $('.nav__btn > span').removeClass('span__active');
    $('.header__nav').removeClass('header__nav-active');
  });

  /*добавляем фиксированную шапку сайта, после прокрутки первого экрана*/
  $(window).on('scroll', function () {
    let catalog = $('.catalog').offset().top;
    if ($(window).scrollTop() > catalog) {
      $('.header__top').addClass('header__top-fixed');
    }
    else {
      $('.header__top').removeClass('header__top-fixed');
    }
  });


  /*бургер навигация*/
  $('.nav__btn').on('click', function () {
    $('.nav__btn').toggleClass('nav__btn-active');
    $('.nav__btn > span').toggleClass('span__active');
    $('.header__nav').toggleClass('header__nav-active');
  });

  /*===============ДОБАВЛЕНИЕ ФРУКТОВ В КОРЗИНУ==========*/
  const productBtns = document.querySelectorAll('.product-btn')
  for (let productBtn of productBtns) {
    let productName = productBtn.getAttribute('data-name'),
      productImg = productBtn.getAttribute('data-img'),
      modalProductBlock = document.querySelector('.modal__product-block');

    /*добавляем(создаем) конкретный товар в корзину*/
    productBtn.onclick = function () {
      let productCreate = document.createElement('div'),
        productPrice = productBtn.getAttribute('data-price'),
        productQuantity = productBtn.getAttribute('data-quantity');
      productCreate.classList.add('modal__product-item');
      productCreate.innerHTML = `<div class="modal__product-item-close"><i class="fas fa-trash"></i></div>
      <img src="${productImg}" alt="">
      <div class="modal__product-item-descr">
        <h6 class="modal__product-title">${productName}</h6>
        <p class="modal__product-subtitle"> 1шт. - диаметр 75(мм)
          масса 150(г)
        </p>
        <p class="modal__product-count">Кол-во <strong>${productQuantity}</strong></p>
      </div>
      <div class="modal__product-item-price" data-price = "${productPrice}">${productPrice}₴</div>`;
      modalProductBlock.append(productCreate);
      deleteFromCart();
      modalEmpty();
      generalPrice();
    }
  }


  // подсчет количества товаров и общей цены //
  function generalPrice() {
    let prodItemPrices = document.querySelectorAll('.modal__product-item-price');
    let genProdPrice = document.querySelector('.modal__order-block-price');
    let cartBtn = document.querySelector('.header__cart-btn');
    let cartText = document.querySelector('.header__cart-text');
    let modalProductBlock = document.querySelector('.modal__product-block');
    let sum = 0;
    for (let prodItemPrice of prodItemPrices) {
      let priceVal = prodItemPrice.getAttribute('data-price');
      let priceValInt = parseFloat(priceVal);
      sum += priceValInt;
    }
    genProdPrice.innerHTML = `${sum}₴`;
    cartText.innerHTML = `${modalProductBlock.children.length} товаров`;
    cartBtn.innerHTML = `<i class="fas fa-shopping-basket"></i> ${sum}₴`;

  }
  generalPrice();




  //==============ФИЛЬТР ФРУКТОВ===========================//
  const productItems = document.querySelectorAll('.catalog__product-item');
  const filterButtons = document.querySelectorAll('.catalog__filter-item');
  for (let button of filterButtons) {
    let filterVal = button.getAttribute('data-filter');
    let buttonFocus = button.getAttribute('data-val');
    button.onclick = (event) => {
      event.preventDefault();

      //по нажатию на конкретную кнопку выделяет ее другим цветом//
      if (buttonFocus == 'off') {
        for (let i of filterButtons) {
          i.setAttribute('data-val', 'off');
          i.classList.remove('focused');
        }
        button.setAttribute('data-val', 'on');
        button.classList.add('focused');
      }

      // фильтр фруктов//
      for (let productItem of productItems) {
        let productVal = productItem.getAttribute('data-filter');
        if (productVal == filterVal) {
          productItem.style.display = 'block';
        }
        else if (filterVal == 'all') {
          /*проверка на наличие класса hidden, который 
          есть у элементов появляющиеся при нажатии кнопки "еще фруктов"
          (они не должны появлятся при нажатии на кнопку "Все")*/
          if (productItem.classList.contains('hidden')) {
            productItem.style.display = 'none';
          }
          else {
            productItem.style.display = 'block';
          }

          //выделяет кнопку "Все" другим цветом
          for (let i of filterButtons) {
            i.setAttribute('data-val', 'off');
            i.classList.remove('focused');
          }
          button.setAttribute('data-val', 'on');
          button.classList.add('focused');
        }
        else {
          productItem.style.display = 'none';
        }
      }
    }
  }
  //==============ФИЛЬТР ФРУКТОВ====================//


  //показывает весь асортимент//
  $('.catalog__more-fruits').on('click', function () {
    if ($('.catalog__filter-item[data-filter = "all"]').hasClass('focused')) {
      $('.hidden').slideToggle(500);
      $('.more-arrow').toggleClass('more-arrow__active');
    }
  });


  //управление количеством и ценой продукта//
  $('.product-interface').each(function () {
    let btnDown = $(this).find('.count-minus'),
      btnUp = $(this).find('.count-plus'),
      input = $(this).find('.count-input'),
      countBtn = $(this).find('.count-btn'),
      price = $(this).children('.product-price'),
      productBtn = $(this).find('.product-btn');

    //======уменьшает кол-во на 1====//
    $(btnDown).on('click', function () {
      let inputVal = parseFloat(input.val());
      inputVal -= 1;
      if (inputVal < 1) {
        return inputVal = 1;
      }
      input.val(inputVal);
    });
    //======увеличивает кол-во на 1====//
    $(btnUp).on('click', function () {
      let inputVal = parseFloat(input.val());
      inputVal += 1;
      input.val(inputVal);
    });
    //======изменяет цену в зависимости от кол-ва====//
    $(countBtn).on('click', function () {
      let summ = input.val() * input.data('price');
      $(price).html(summ + '₴');
      $(productBtn).attr('data-price', summ);
      $(productBtn).attr('data-quantity', input.val());
    });
  });

  $('#modalOrder').on('click', function () {
    $('.order-modal').removeClass('modal-visible');
  });
  $('.modal-second').on('click', function () {
    $('.order-modal').removeClass('modal-visible');
    $('.modal').addClass('modal-visible');
  })

  //открытие модального окна(корзины)//
  function modalWindow(target, modale, modalOut) {
    $(target).on('click', (event) => {
      event.preventDefault();
      $(modalOut).addClass('modal-visible');
      generalPrice();
    });

    //закрытие модального окна(корзины)//
    $('.modal__content-close ').on('click', () => {
      $(modalOut).removeClass('modal-visible');
      modalEmpty();

    })
    //закрытие модального окна путем нажатия на область вне модального окна//
    $(window).on('mouseup', function (event) {
      let modal = $(modale)
      if (event.target != modal[0] && modal.has(event.target).length === 0) {
        $(modalOut).removeClass('modal-visible');
      }
    })
  }
  modalWindow('.modal__order-block-btn', '.modal__order-content', '.order-modal');
  modalWindow('.header__cart-btn', '.modal__content', '.modal');
  modalWindow('.reviews-main__btn', '.modal__review-content', '.review-modal');



  //удаление товара из корзины//
  function deleteFromCart() {
    $('.modal__product-item').each(function () {
      let close = $(this).find('.modal__product-item-close'),
        item = $(this);
      $(close).on('click', function () {
        $(item).remove();
        generalPrice();
      });
    });
  }
  deleteFromCart();

  //изображение при пустой корзине//
  function modalEmpty() {
    if ($('.modal__product-block').children().length == 0) {
      $('.modal__product-block').addClass('modal__product-block-empty');
      $('.modal__order-block').addClass('modal__order-block-empty');
      $('.modal__empty-block').addClass('modal__empty-block-active');
    }
    else {
      $('.modal__product-block').removeClass('modal__product-block-empty');
      $('.modal__order-block').removeClass('modal__order-block-empty');
      $('.modal__empty-block').removeClass('modal__empty-block-active');
    }

  }
  modalEmpty();

  //звездочный рейтинг//
  const ratingItems = document.querySelectorAll('.star-main-item');
  const ratingItemsArray = Array.from(ratingItems);
  ratingItemsArray.forEach(item => {
    item.onclick = () => {
      const { star } = item.dataset;
      item.parentNode.dataset.totalStar = star;
    }
  });

  /*берем значение общей цены из корзины и переносим в мод.окно 
  с оформление заказ*/
  const modalOrderBtn = document.querySelector('.modal__order-block-btn');
  modalOrderBtn.onclick = () => {
    let modalPrice = document.querySelector('.modal__order-block-price').innerHTML;
    let costItemSpan = document.querySelector('.cost-item__span');
    costItemSpan.innerHTML = modalPrice;
  }

  /*переносим значение звезд в модальное окно с отзывом */
  $('.reviews-main__btn').on('click', function () {
    let revMainStar = $('.reviews__main-stars').attr('data-total-star');
    let starItem = '<p class="star-main-item"><i class="fas fa-star gradient-icon"></i></p>';
    for (let star = 0; star < (revMainStar - 1); star++) {
      starItem += '<p class="star-main-item"><i class="fas fa-star gradient-icon"></i></p>';
    };
    $('#modalReviewStar').html(starItem);
  })

  //маска для ввода номера телефона
  $('#phoneInput').inputmask({ "mask": "+38(999)-999-99-99" });
  $('#dataCardInput').inputmask({ 'mask': "9999 - 9999 - 9999 - 9999" })

  //добавляем отзыв в слайдер с отзывами
  $('#modalReviewBtn').on('click', function () {
    let reviewStars = $('.reviews-modal__main-stars').html();
    let reviewName = $('.review-name').val();
    let reviewText = $('#reviewTextarea').val();
    let starItem = '<p class="star-item"><i class="fas fa-star gradient-icon"></i></p>';
    for (let star = 0; star < (reviewStars - 1); star++) {
      starItem += '<p class="star-item"><i class="fas fa-star gradient-icon"></i></p>';
    };
    $('.reviews__slider').slick('slickAdd', `<div class="reviews__slider-item">
      <div class="reviews__slider-item__inner">
        <div class="reviews__item-content">
          <div class="reviews__name-date">
            <h5 class="reviews__name">${reviewName}</h5>
            <p class="reviews__date">25.07.2020</p>
          </div>
          <div class="reviews__stars">
            ${reviewStars}
          </div>
          <div class="reviews__text">
            ${reviewText}
          </div>
        </div>
      </div>`);
    $('.review-modal').removeClass('modal-visible');
    $('.review-name').val('');
    $('#reviewTextarea').val('');
    $('.reviews__main-stars').attr('data-total-star', 0);
  })

});