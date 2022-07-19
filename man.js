const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const player = $('.player');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const ramdomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{
            name: 'i love my life',
            singer: 'đang cập nhật',
            path: './mp3/love.mp3',
            img: './img/love.jpg'
        },
        {
            name: 'tình yêu khủng long',
            singer: 'đang cập nhật',
            path: './mp3/tinh_yeu_kl.mp3',
            img: './img/tinh_yeu_kl.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `  
            <div class="song ${index === this.currentIndex?'active':''}" data-index="${index}">
                <div class="thumb" style="background-image: url(${song.img})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            },
        })
    },
    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
                const srollTop = document.documentElement.scrollTop || window.scrollY;
                const newcWidth = cdWidth - srollTop;

                cd.style.width = newcWidth > 0 ? newcWidth + 'px' : 0;
                cd.style.opacity = newcWidth / cdWidth;
            }
            //xử lí CD quay / dừng
        const cdAnimate = cdThumb.animate(
            [{ transform: 'rotate(360deg)' }], {
                duration: 70000,
                iterations: Infinity
            })
        cdAnimate.pause();
        //xử lí play
        playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause();

                } else {

                    audio.play();

                }

            }
            // khi song được  play
        audio.onplay = function() {
                _this.isPlaying = true;
                player.classList.add('playing');
                cdAnimate.play();
            }
            // khi song bị pause
        audio.onpause = function() {
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdAnimate.pause();
            }
            // khi tiếng độ bài hát thay đổi
        audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 10000);
                    progress.value = progressPercent;
                }

            }
            // xử lí khi tua song
        progress.onchange = function(e) {
                const seekTime = audio.duration / 10000 * e.target.value;
                audio.currentTime = seekTime;
            }
            //next song
        nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.randomSong();
                } else {
                    _this.nextSong();
                }

                audio.play();

                _this.render();
                _this.scrollToActiveSong();
            } //prev song
        prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.randomSong();
                } else {
                    _this.prevSong();
                }

                audio.play();
                _this.render();
            }
            //random ong 
        ramdomBtn.onclick = function(e) {
                _this.isRandom = !_this.isRandom;
                ramdomBtn.classList.toggle('active', _this.isRandom);

            }
            // next song khi audio ended
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play();

                } else {

                    nextBtn.click();
                }

            }
            //repeat
        repeatBtn.onclick = function(e) {
                _this.isRepeat = !_this.isRepeat;
                repeatBtn.classList.toggle('active', _this.isRepeat);
            }
            //click on playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();

                }
            }

        }

    },
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();

    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();

    },
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 500)
    },
    start: function() {
        //định nghĩa các thuột tính cho object
        this.defineProperties();
        //lắng nghe và xử lí cấc sự kiện
        this.handleEvent();
        //tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();
        // render danh sách bài hát
        this.render();
    }
}
app.start();