//初期設定
let cullentSlider = 0;
let appearPC = 5;
let appearSP = 3;
let nextSlider;
let serialNumber;
let itemWidth, spacer;

// let supportTouch = 'ontouchend' in document;
// console.log(supportTouch)

//要素の取得
const wrapper = document.getElementById('wrapper');
const list = document.getElementById('works_list');
const slider = document.getElementById('slider');
const bg = document.getElementById('detail');
const details = document.querySelectorAll('.detail_items');

//一覧選択
const textItems = document.querySelectorAll('#works_nav_list li a');
for (let i = 0; i < textItems.length; i++){
    textItems[i].addEventListener('click', function(){
        nextSlider = i;
        let nowLeft = -(cullentSlider * itemWidth) + spacer + 'px';
        let nextLeft = -(i * itemWidth) + spacer + 'px';
        slideMove(nowLeft, nextLeft);
        return false;
    })
}

//ループ用に要素を複製
const sliderItems = document.querySelectorAll('.works_list_item');
let maxID = sliderItems.length - 1;

const clone = document.getElementById('works_list').innerHTML;
list.insertAdjacentHTML('beforeend', clone);
list.insertAdjacentHTML('afterbegin', clone);
const allItems = document.querySelectorAll('.works_list_item');
sliderItems[0].classList.add('current');

for (let i = 0; i < allItems.length; i++){
    allItems[i].addEventListener('mousedown', function(){
        serialNumber = i;
        return false;
    })
    allItems[i].addEventListener('touchstart', function(){
        serialNumber = i;
        return false;
    })
}


//レスポンシブ対応
let appear;
const resizeWindow = () => {
    appear = (window.innerWidth > 768) ? appearPC : appearSP;
    itemWidth = Math.floor((slider.clientWidth / appear) * 10) / 10;
    console.log(itemWidth);
    spacer = -((itemWidth * sliderItems.length) - (itemWidth * (appear - 1) / 2));

    for (let i = 0; i < allItems.length; i++){
        allItems[i].style.width = itemWidth + 'px';
    }

    slider.style.height = allItems[0].clientHeight + 'px';
    list.style.width = itemWidth * sliderItems.length * 3 + 'px';
    list.style.left = -(cullentSlider * itemWidth) + spacer + 'px';
}
window.addEventListener('resize', resizeWindow);
resizeWindow();


//クリックで移動
const clickItem = (data) => {
    switch(data){
        case 'prev':
            nextSlider = cullentSlider - 1;
            if (nextSlider < 0) nextSlider = maxID;
            serialNumber = cullentSlider + maxID;
            break;
        case 'next':
            nextSlider = cullentSlider + 1;
            if (nextSlider > maxID) nextSlider = 0;
            serialNumber = cullentSlider + sliderItems.length + 1;
            break;
        default :
            nextSlider = Math.floor(serialNumber % sliderItems.length);
            loop = Math.floor(serialNumber / sliderItems.length);
    }

    let val = cullentSlider + sliderItems.length - serialNumber;
    let nowLeft = -((nextSlider + val) * itemWidth) + spacer + 'px';
    let nextLeft = -(nextSlider * itemWidth) + spacer + 'px';

    slideMove(nowLeft, nextLeft);
}

//ドラッグで移動
let marginX, moveLeft, firstleft;
let moveFlag = false;

//ドラッグ開始
list.addEventListener('mousedown', function(e){
    if( e.button == 0 ){
        eventStart(e.clientX);
    }
});
list.addEventListener('touchstart', function(e){
    e.preventDefault();
    let eventX = Math.round(e.touches[0].clientX);
    eventStart(eventX);
});
const eventStart = (x) => {
    let sliderX = slider.getBoundingClientRect().left;
    let beforeX = list.getBoundingClientRect().left;
    return marginX = beforeX - sliderX - x,
    firstleft = x + marginX,
    moveLeft = x + marginX,
    moveFlag = true;
}

//ドラッグ中
wrapper.addEventListener('mousemove', function(e){
    if(moveFlag){
        eventMove(e.clientX);
    }
});
wrapper.addEventListener('touchmove', function(e){
    if(moveFlag){
        let eventX = Math.round(e.touches[0].clientX);
        eventMove(eventX);
    }
});
const eventMove = (x) => {
    moveLeft = x + marginX;
    if(moveLeft > 0){
        moveLeft = 0;
    } else if( moveLeft < -(allItems.length - appear) * itemWidth ){
        moveLeft = -(allItems.length - appear) * itemWidth;
    }
    list.style.left = moveLeft + 'px';
    return moveLeft;
}

//ドラッグ終了
wrapper.addEventListener('mouseup', function(){
    eventEnd();
});
wrapper.addEventListener('touchend', function(){
    eventEnd();
});
const eventEnd = () => {
    if(moveFlag){
        if(Math.abs(firstleft - moveLeft) < 20){
            clickItem();
        } else {
            let val = Math.round((firstleft - moveLeft) / itemWidth);
            nextSlider = cullentSlider + val;

            //最初 ←→ 最後のスライドへループ
            if(nextSlider < 0){
                nextSlider = sliderItems.length + cullentSlider + val;
            } else if(nextSlider > maxID){
                nextSlider = nextSlider - sliderItems.length;
            }

            let nowLeft = moveLeft + 'px';
            let nextLeft = -((cullentSlider + val) * itemWidth) + spacer + 'px';

            slideMove(nowLeft, nextLeft);
        }
    }
}

//スライダーを移動
const slideMove = (now, next) => {
    sliderItems[cullentSlider].classList.remove('current');
    let animate = list.animate({
        left: [now, next],
        easing: 'ease-out'
    }, 200)
    animate.onfinish = function(){
        list.style.left = -(nextSlider * itemWidth) + spacer + 'px';
        sliderItems[nextSlider].classList.add('current');
        detailChange(nextSlider);
        cullentSlider = nextSlider;
        moveFlag = false;
    }
}

//詳細内容変更
const detailChange = (num) => {
    let src = details[num].querySelector('.thumb_img').src;
    let thumb = 'url("'+ src +'")';
    bg.style.backgroundImage = thumb;
    for (let i = 0; i < sliderItems.length; i++){
        if( i == num ){
            details[i].style.display = 'block';
            setTimeout(function(){
                details[i].classList.add('current');
            }, 0)
        } else {
            details[i].style.display = 'none';
            details[i].classList.remove('current');
        }
    }
}

const prev = document.getElementById('prev');
const next = document.getElementById('next');
prev.onclick = function(){
    clickItem('prev');
}
next.onclick = function(){
    clickItem('next');
}


// スムーススクロール
const anchor = document.querySelectorAll('a[href^="#"]');
const smoothScroll = (href) => {
    let target = document.getElementById(href.replace('#', ''));
    const rect = target.getBoundingClientRect().top;
    const header = document.getElementsByTagName('header');
    const offset = window.pageYOffset;
    // 移動先のポジション取得
    const position = rect + offset - header[0].clientHeight;
    // window.scrollToでスクロール
    window.scrollTo({
        top: position,
        behavior: 'smooth',
    });
}
for (let i = 0; i < anchor.length; i++){
    anchor[i].addEventListener('click', (e) => {
        e.preventDefault();
        // href属性の取得
        let href = anchor[i].getAttribute('href');
        if(href!='#') smoothScroll(href);
    });
}