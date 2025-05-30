let interval;
let timeout;
const numberDisplay = document.getElementById("number");
const button = document.getElementById("toggleButton");
let randomIndex;
let count = 0;
const dbName = "weightDB";
const storeName = "weightCount";
let rotatingAudio;


button.addEventListener("click", async function(e) {
  const db = await openDatabase();
  explode(e.pageX, e.pageY);
    if (button.textContent === "スタート") {
        rotatingAudio = new Audio("mp3/Rotating.mp3");
        rotatingAudio.loop = true;
        rotatingAudio.play();
        removeImage()
        button.textContent = "ストップ";
        let speed = 100; // 初期の変更速度
        clearTimeout(timeout); // 前の遅延をクリア
        interval = setInterval(() => {
          const randomIndex = getRandomStepValue(1.5, 3.0, 0.1);
          numberDisplay.textContent = randomIndex;
        }, speed);
    } else {
        if (rotatingAudio) {
          rotatingAudio.pause();
          rotatingAudio.currentTime = 0;
        }
        const stopAudio = new Audio("mp3/Stop.mp3");
        stopAudio.play();
        button.style.display = 'none';
        button.textContent = "スタート";
        clearInterval(interval);

        // 徐々に遅くしながら最終的に確定
        let speed = 100;
        function slowDown() {
            if (speed < 1000) {
              const slowlyAudio = new Audio("mp3/Slowly.mp3");
              slowlyAudio.play();
                speed += 200; // だんだん遅くする
                timeout = setTimeout(() => {
                    randomIndex = getRandomStepValue(1.5, 3.0, 0.1);
                    numberDisplay.textContent = randomIndex;
                    slowDown(); // 次の遅延呼び出し
                }, speed);
            } else {
              button.style.display = 'inline';
              // const namHistory = document.getElementById("history");

              count++;
              saveWeight(db, count, randomIndex);
              const confirmedAudio = new Audio("mp3/Confirmed.mp3");
              confirmedAudio.play();
              if (Number(randomIndex) * 10 % 6 == 0){
                if (confirmedAudio) {
                  confirmedAudio.pause();
                  confirmedAudio.currentTime = 0;
                }
                addImage()
                const spAudio = new Audio("mp3/Special.mp3");
                spAudio.play();
              }

              // namHistory.scrollTop = namHistory.scrollHeight;
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

function getRandomStepValue(min, max, step) {
  const steps = Math.floor((max - min) / step) + 1;
  const randomStep = Math.floor(Math.random() * steps);
  const value = min + (randomStep * step);
  return parseFloat(value.toFixed(1))
}

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

function addImage() {
  const imageBox = document.getElementById('imageBox');
  imageBox.classList.add('active');
  imageBox.style.transition = '';
}

function removeImage() {
  const imageBox = document.getElementById('imageBox');
  if (imageBox.classList.contains('active')) {
    imageBox.classList.remove('active');
    imageBox.style.transition = 'none';
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore(storeName, { keyPath: 'id' }); // keyPathを'id'に設定
      };
      request.onsuccess = (event) => {
          resolve(event.target.result);
      };
      request.onerror = (event) => {
          reject(event.target.error);
      };
  });
}

// IndexedDBにデータを保存
function saveWeight(db, count, weight) {
  return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const data = { id: getTodayDateString(), count: count, weight: weight};
      const request = store.put(data);
      request.onsuccess = () => {
          resolve(request.result);
      };
      request.onerror = (event) => {
          reject(event.target.error);
      };
  });
}

function getTodayDateString() {
  const today = new Date();
  const hour = String(today.getHours()).padStart(2, '0');
  const minute = String(today.getMinutes()).padStart(2, '0');
  const secound = String(today.getSeconds()).padStart(2, '0');
  return `${hour}:${minute}:${secound}`;
}
