let interval;
let timeout;
const numberDisplay = document.getElementById("number");
const button = document.getElementById("toggleButton");

// 使用する数字のリスト
const numberList = [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00];

button.addEventListener("click", function(e) {
  explode(e.pageX, e.pageY);
    if (button.textContent === "スタート") {
        button.textContent = "ストップ";
        let speed = 100; // 初期の変更速度
        clearTimeout(timeout); // 前の遅延をクリア
        interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * numberList.length);
            numberDisplay.textContent = numberList[randomIndex];
        }, speed);
    } else {
        button.style.display = 'none';
        button.textContent = "スタート";
        clearInterval(interval);

        // 徐々に遅くしながら最終的に確定
        let speed = 100;
        function slowDown() {
            if (speed < 1000) {
                speed += 200; // だんだん遅くする
                timeout = setTimeout(() => {
                    const randomIndex = Math.floor(Math.random() * numberList.length);
                    numberDisplay.textContent = numberList[randomIndex];
                    slowDown(); // 次の遅延呼び出し
                }, speed);
            } else {
              button.style.display = 'inline';
            }
        }
        slowDown();
    }
});

// click event
// $('.Button').on('click', function(e) {
//     console.log("a");
//   explode(e.pageX, e.pageY);
// });

document.addEventListener("touchstart", function(){}, true);

// symbols
function explode(x, y) {
  
  var symbolArray = [
    '#donut',
    '#circle',
    '#tri_hollow',
    '#triangle',
    '#square',
    '#squ_hollow'
  ];
  
  var particles = 10, 
      explosion = $('.Button-wrapper');
      
  for (var i = 0; i < particles; i++) {
    
    var randomSymbol = Math.floor(Math.random()*symbolArray.length);
    // positioning x,y of the particles
    var x = (explosion.width() / 2) + rand(80, 150) * Math.cos(2 * Math.PI * i / rand(particles - 10, particles + 10)),
        y = (explosion.height() / 2) + rand(80, 150) * Math.sin(2 * Math.PI * i / rand(particles - 10, particles + 10)),
        deg = rand(0, 360) + 'deg',
        scale = rand(0.5, 1.1),
        // particle element creation
        elm = $(
          '<svg class="Symbol" style="top:' + y + 'px; left:' + x + 'px; transform: scale(' + scale + ') rotate(' + deg + ');">' + 
          '<use xlink:href="' + symbolArray[randomSymbol] + '" />' + 
          '</svg>'
         );

    if (i == 0) { // only need to target one of the symbols.
      // css3 animation end detection
      elm.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
        elm.siblings('svg').remove().end().remove(); // remove particles when animation is over.
      });
    }
    explosion.prepend(elm);
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max + 1)) + min;
}

$('#wave').wavify({
  height: 60,
  bones: 3,
  amplitude: 40,
  color: '#0bd',
  speed: .25
});

