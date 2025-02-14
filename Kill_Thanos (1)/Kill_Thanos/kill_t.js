const WidthMap = 1500;
const Height = 800;

// 캔버스 이름/2d로
let canvas=document.getElementById("gameCanvas");
let ctx=canvas.getContext("2d");

// 게임 시작 화면
let Start_Img = document.getElementById("Start_TK");
let btn_start=document.getElementById("btn");

// 인트로
let intro=document.getElementById("intro_TK");
let intro_video=document.getElementById("intro_mp4_TK");

// 클리어 수정
let clear_video=document.getElementById("clear_mp4_TK");
let clear_boss=document.getElementById("Video_img_clear");

// 게임 오버 수정
let over_video=document.getElementById("over_mp4_TK");
let over_player=document.getElementById("Video_img_over");

// let life=5;
let life=document.getElementsByClassName("life");

// 보스 시간 / 시간에 따라 줄어들도록 
let Boss_time=document.getElementById("time_limit");
let bossTimer=0; 
let Reality_stone=false;

// 보스 hp
let Boss_Hp=document.getElementById("life_boss");

// 게임 화면 조정 후 주석 해제
intro_video.style.objectFit="cover";

// 게임 화면 조정 후 동영상 diplay 해제
function StartMap() {
	Start_Img.style.display = "none";
	intro_video.play();

	setTimeout(function(){
        timerBoss();
		intro.style.display ="none";
        intro_video.style.display ="none";
	},6000);
}

 let timeRemaining = 100;  // 100%에서 시작
 function timerBoss(){
    let timerInterval = setInterval(function() {
     if (timeRemaining <= 0) {
         clearInterval(timerInterval); // 타이머 종료
         // 보스 등장 함수 호출
         // start_Boss_PhaseA();
        } else {
            timeRemaining -= 1; // 1%씩 감소
 
            // 타이머 색상이 위에서부터 사라지도록 설정
            Boss_time.style.backgroundImage = `linear-gradient(to top, red ${timeRemaining}%, white ${timeRemaining}%)`;
        }
    }, 5);  // 1초마다 감소
 }

 // 보스 HP를 깎는 함수
// 보스 체력 UI를 보스 HP에 맞게 줄어들도록 수정
function bossDamage(boss) {
    let bossHpElement = document.getElementById("boss_Hp");

    // 보스 체력 비율 계산 (현재 HP / 최대 HP)
    let hpPercentage = (boss.hp / boss.maxHp) * 100;
    hpPercentage = Math.max(0, hpPercentage); // 0% 이하로는 가지 않도록 제한

    // UI 반영
    bossHpElement.style.width = `${hpPercentage}%`;
    bossHpElement.style.backgroundColor = `linear-gradient(to right, red ${hpPercentage}%, white ${100 - hpPercentage}%)`;

    console.log(`보스 체력: ${boss.hp} / ${boss.maxHp} (${hpPercentage}%)`);

    // 보스 체력이 0이면 게임 종료
    if (boss.hp <= 0) {
        setTimeout(() => {
            alert("보스를 처치했습니다!");
            boss.onDeath(); // 보스 사망 처리
        }, 1000);
    }
}
// 아이언맨 HP 
const hpIcon = ['HP_1', 'HP_2', 'HP_3', 'HP_4', 'HP_5'];

// 데미지를 받아오는 함수 
function Damage(damageCount) { 
    // 데미지만큼 HP 아이콘을 숨김
    for (let i = 0; i < damageCount; i++) {
        // HP에  hpIcon[damageCount]를 받아오고 데미지만큼만 깎임 
        const HP = hpIcon[i];
        const life = document.getElementById(HP);
        
        // 아이콘을 숨김
        if (life) {
            life.style.display = 'none';
        }
    }
}

let bullets = []; //보스 총알 저장
let meteo = []; // 메테오 저장
let soulBullets = []; //소울 스톤 총알
let isRotating = false; // 회전 상태 저장
let rotationAngle = 0; // 회전 각도
let selectedStone = null; // 선택된 스톤 저장
let stoneGlow = 0;
let glowing = false;
let isInverted = false;  // 마인드 스톤 활성화 여부

//----------플레이어
let bulletList = []; //총알을 저장할 리스트
let playerItemList = []; //아이템을 먹었을 때 저장할 리스트 
let bossAttack = []; //보스에 대해서 공격을 저장할 리스트

//아이언맨 이미지.
const IronManImage = new Image();
// IronManImage.onload = () =>console.log('이미지가 구현되었습니다.');
IronManImage.src = "images/IronMan1.png";

//아이언맨 총알에 대한 이미지.
const PlayerBulletImage = new Image();
// PlayerBulletImage.onload = () => console.log("이미지 구현");
PlayerBulletImage.src = "images/Playerbullet.png";

// 타노스 이미지
const ThanosImage = new Image();
ThanosImage.src = "images/Thanos.png";

// 건틀렛 이미지
const gauntletImage = new Image();
gauntletImage.src = "images/gauntlet.png";

//스페이스 스톤 효과
const spaceEffect = new Image();
spaceEffect.src = "images/space_effect.png";

//이미지 구현
const PlayerBullet2 = new Image();
PlayerBullet2.src ="images/Playerbullet2.png";

// 인피니티 스톤 효과 이미지
const stoneImages = {
    mind: new Image(),
    reality: new Image(),
    soul: new Image(),
    time: new Image(),
    power: new Image(),
    space: new Image()
};


stoneImages.mind.src = "images/mind.png";
stoneImages.reality.src = "images/reality.png";
stoneImages.soul.src = "images/soul.png";
stoneImages.time.src = "images/time.png";
stoneImages.power.src = "images/power.png";
stoneImages.space.src = "images/space.png";


// 인피니티 스톤 크기
const stoneSize = 100;


// 건틀렛 크기
const gauntletWidth = 595 * 0.2;
const gauntletHeight = 1119 * 0.2;


// 타노스 크기
const ThanosWidth = 571 * 0.7;
const ThanosHeight = 389 * 0.7;


let ThanosX = canvas.width / 2 - ThanosWidth / 2; // 중앙 정렬


//아이언맨 객체
const Player  = {
    x : canvas.width /2-20, //캔버스 안에 플레이어 x좌표 
    y : canvas.height-170, //캔버스 안에 플레이어 y좌표
    width : 360 *0.2,    // 이미지 너비
    height : 450 *0.2,     //이미지 높이
    hp: 5,//플레이어의 기본 체력
    speed : 2,                 //플레이어의 기본 스피드값
    moveLeft: false,          // 왼쪽으로 옮겨질지에 대한 여부값
    moveRight :false,         //오른쪽으로 옮겨질지에 대한 여부값
    moveUp:false,             // 위쪽으로 옮겨질지 대한 여부값
    moveDown:false,          // 아래쪽으로 옮겨질지 대한 여부값
    cooldown: 10,           //쿨다운 값은 임의의 설정한 거니까 이 부분은 회의를 통해서 설정할 예정.
    damageCount : null,   // 공격 받은 값 
    skillLevel : 1,//skill 기본레벨
    maxexp: 50, //가설정
    playerAttack: 3
  };

  //아이언맨 캔버스 위에 이미지 그려주는 함수
  function Playerdrawing(){ 
    ctx.drawImage(IronManImage, Player.x, Player.y, Player.width, Player.height);
};

function PlayerUpdate() {
    let direction = isInverted ? -1 : 1; // reverse 상태에 따라 방향 반전

    if (Player.moveLeft && Player.x > 0) {
        Player.x -= Player.speed * direction;
    }
    if (Player.moveRight && Player.x + Player.width < canvas.width) {
        Player.x += Player.speed * direction;
    }
    if (Player.moveUp && Player.y > 0) {
        Player.y -= Player.speed * direction;
    }
    if (Player.moveDown && Player.y + Player.height < canvas.height) {
        Player.y += Player.speed * direction;
    }
}

function checkPlayerHit() {
    bullets.forEach((bullet, index) => {
        if (
            bullet.x > Player.x + 20 &&
            bullet.x < Player.x + Player.width - 20 &&
            bullet.y > Player.y + 20 &&
            bullet.y < Player.y + Player.height-20
        ) {
            // 피격 시 체력 감소
            Player.hp--;
            console.log(`플레이어 피격 판정 남은 체력: ${Player.hp}`);

            // HP UI 업데이트
            updatePlayerHP();

            // 총알 제거
            bullets.splice(index, 1);

            // 체력이 0이면 게임 오버 처리
            if (Player.hp <= 0) {
                gameOver();
            }
        }
    });
}

function checkPlayerSoulHit() {
    soulBullets.forEach((bullet, index) => {
        if (!bullet.hasExploded) {
            //폭발 전 소울 스톤 총알과 충돌 판정
            if (
                bullet.x > Player.x &&
                bullet.x < Player.x + Player.width &&
                bullet.y > Player.y &&
                bullet.y < Player.y + Player.height
            ) {
                if (!bullet.isHit) { // 피격 판정이 한 번만 실행되도록T
                    Player.hp = Math.max(0, Player.hp - 1);
                    updatePlayerHP();
                    bullet.isHit = true;  // 중복 판정 방지
                    soulBullets.splice(index, 1);  // 맞으면 제거

                    if (Player.hp <= 0) {
                        gameOver();
                    }
                }
            }
        } else {
            //폭발 후 생성된 소용돌이 총알과 충돌 판정
            let numBullets = 10;
            let radius = bullet.explosionTime;
            for (let i = 0; i < numBullets; i++) {
                let angle = (Math.PI * 2 * i) / numBullets;
                let bulletX = bullet.x + Math.cos(angle + bullet.angle) * radius;
                let bulletY = bullet.y + Math.sin(angle + bullet.angle) * radius;

                if (
                    bulletX > Player.x &&
                    bulletX < Player.x + Player.width &&
                    bulletY > Player.y &&
                    bulletY < Player.y + Player.height
                ) {
                    if (!bullet.isHit) { //피격 판정이 한 번만 실행되도록
                        Player.hp = Math.max(0, Player.hp - 1);
                        updatePlayerHP();
                        bullet.isHit = true;  //중복 판정 방지

                        if (Player.hp <= 0) {
                            gameOver();
                        }
                    }
                }
            }
        }
    });
}

function updatePlayerHP() {
    for (let i = 0; i < hpIcon.length; i++) {
        let heart = document.getElementById(hpIcon[i]);
        if (i >= Player.hp) {
            heart.style.display = "none"; // 남은 체력보다 많은 하트 숨김
        } else {
            heart.style.display = "inline"; // 체력이 남아있는 하트 표시
        }
    }
}

function gameOver() {
    console.log("게임 오버!");
    over_video.style.objectFit="cover";
    over_video.style.display="flex";
    intro_video.style.display="none";
    intro.style.display="flex";
    over_video.play();
    setTimeout(()=>{
      location.reload(); // 게임 재시작(새로 고침)
      alert("💀 게임 오버! 💀");
    },8000);
   // location.reload(); // 게임 재시작(새로 고침)
}

//플레이어 총알 클래스
class Pbullet {
   
    constructor(x,y,dx,dy){
        this.x = x; 
        this.y = y;

        //이동 좌표
        this.dx = dx;
        this.dy = dy;
        
        //이미지 사이즈
        this.width= 10;
        this.height = 20;
    }

    move(){
        
        this.x += this.dx;
        this.y += this.dy;

    }
   
    //그림 그리는 좌표
    draw(ctx){
    ctx.drawImage(PlayerBulletImage,this.x,this.y,PlayerBulletImage.width,PlayerBulletImage.height);}
    }

function shoot(){
  if (Player.cooldown <= 0) {
   let newBullet = new Pbullet(Player.x-110,Player.y-170,0,-7);
   bulletList.push(newBullet);
   }
     
     Player.cooldown = 10; 
}

function doubleshot(){
    if (Player.cooldown <= 0){
        //총알 객체가 구현될 수 있겠금 만들기 
        let newBullet1 = new Pbullet(Player.x-110,Player.y-170,1,-7);
        let newBullet2 = new Pbullet(Player.x-110,Player.y-170,-1,-7);
        bulletList.push(newBullet1);
        bulletList.push(newBullet2);
    }
}

function threeShoot(){
    if (Player.cooldown <= 0){
      let newBullet3 = new Pbullet(Player.x-110,Player.y-170,1,-7);
      let newBullet4 = new Pbullet(Player.x-110,Player.y-170,0,-7);
      let newBullet5 = new Pbullet(Player.x-110,Player.y-170,-1,-7);
      bulletList.push(newBullet3);
      bulletList.push(newBullet4);
      bulletList.push(newBullet5);
     } 
 }

let i = 1;

 function whatShot(){
    console.log(i);
    setTimeout(()=>{
        i = 2;
    },30000); //1분뒤

    setTimeout(()=>{
        i = 3;
    },60000); //2분뒤

    if (i == 1){
        shoot();
    }
    else if (i == 2){
        doubleshot()
    }
    else if (i == 3){
        threeShoot()
    }
 }

window.addEventListener("keydown", (e) => {
    let direction = isInverted ? -1 : 1; // 반전 여부에 따라 방향 조정

    if (e.key === "a" && Player.x > 1) {
        Player.moveLeft = true;
        Player.x -= Player.speed * direction;
    } else if (e.key === "d" && Player.x < canvas.width - Player.width) {
        Player.moveRight = true;
        Player.x += Player.speed * direction;
    } else if (e.key === "w" && Player.y > 1) {
        Player.moveUp = true;
        Player.y -= Player.speed * direction;
    } else if (e.key === "s" && Player.y < canvas.height - Player.height) {
        Player.moveDown = true;
        Player.y += Player.speed * direction;
    }
});

//키보드를 뗐을 때       
window.addEventListener("keyup", (e)=>{
  
    if(e.key =="a"){
      Player.moveLeft = false;}
    //오른쪽으로 움직였을 때
    else if(e.key == "d"){
      Player.moveRight = false;}
    
    // 상위쪽으로 올라갈 때
    else if(e.key == "w"){
      Player.moveUp =false;}
  
     // 하 
    else if(e.key== "s") {
      Player.moveDown = false;}
  
  
    else if(e.key=='j'){
       whatShot();
      }
});
  

//보스 총알 클래스
class Bullet {
    constructor(x, y, angle, speed) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.time = 0;
        this.size = 8;
    }

    move() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    draw() {
        ctx.fillStyle = "pink";
        ctx.beginPath();
        ctx.arc(this.x, this.y-30, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

//운석 클래스
class Meteorite {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 20 + 30; // 크기 랜덤
        this.dy = Math.random() * 3 + 1; // 속도 랜덤
        this.exploded = false; // 폭발 여부 체크
        this.explosionTime = 0; // 폭발 후 유지 시간
    }

    move() { //아래로만 떨어짐
        if (!this.exploded) {
            this.y += this.dy;
        }
    }

    explode() { // 터졌을때
        let numBullets = 10; // 폭발 시 발사할 총알 개수
        for (let i = 0; i < numBullets; i++) {
            let angle = (Math.PI * 2 * i) / numBullets; // 360도 방향으로 총알 배치
            let speed = 2;
            bullets.push(new Bullet(this.x, this.y, angle, speed)); // 폭발 총알 추가
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.fillStyle = "brown";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        else {
            if (this.explosionTime === 0) {
                this.explode();
            }

            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();

            this.explosionTime++;
            if (this.explosionTime > 100) {
                return true; // 폭발 후 제거
            }
        }
        return false;
    }

    checkCollision() {
        if (this.y + this.size >= canvas.height) {
            this.exploded = true; // 바닥에 닿으면 폭발
            return true;
        }
        return false;
    }
}

// 스페이스 스톤 효과 및 안전구역
class SpaceStoneEffect {
    constructor() {
        this.active = false;  // 효과 활성화 여부
        this.rotation = 0;    // 회전 각도
        this.safeZone = null; // 랜덤한 안전구역
        this.flashing = false; // 폭발 직전 반짝이는 효과
        this.flashingTime = 0; // 반짝이는 시간 (0~3초 동안)
    }

    // 스페이스 스톤 발동
    activate() {
        if (this.active) return; // 이미 실행 중이면 중복 실행 방지

        this.active = true;
        this.rotation = 0;
        this.flashing = false;
        this.flashingTime = 0;

        // 랜덤한 위치에 안전구역 생성 (하나만 생성되도록 수정)
        this.safeZone = {
            x: Math.random() * (canvas.width - 150),
            y: Math.random() * (canvas.height - 150),
            size: 150
        };

        console.log("안전구역 생성:", this.safeZone);

        // 2.5초 후 빨간색 경고 효과 시작
        setTimeout(() => this.flashing = true, 2500);

        // 5초 후 폭발 실행
        setTimeout(() => this.explode(), 5000);
    }

    // 폭발 처리
    explode() {
        if (!this.active) return;

        if (
            Player.x + Player.width < this.safeZone.x || 
            Player.x > this.safeZone.x + this.safeZone.size ||
            Player.y + Player.height < this.safeZone.y || 
            Player.y > this.safeZone.y + this.safeZone.size
        ) {
            // 플레이어가 안전구역 밖이면 체력 감소
            Player.hp = Math.max(0, Player.hp - 1);
            console.log("폭발 피격", Player.hp);
            updatePlayerHP();

            if (Player.hp <= 0) {
                gameOver();
            }
        }

        // 효과 종료 (새로운 안전구역 생성 가능)
        this.active = false;
        this.safeZone = null;
        this.flashing = false;
    }

    // 효과 업데이트 (회전)
    update() {
        if (!this.active) return;
        this.rotation += 5;

        // 반짝이는 효과 지속 시간
        if (this.flashing) {
            this.flashingTime += 1;
            if (this.flashingTime > 30) { // 0.5초 정도 반짝이면 원래대로
                this.flashing = false;
            }
        }
    }

    // 효과 그리기
    draw() {
        if (!this.active) return;

        //스페이스 스톤 회전 효과
        ctx.save();
        ctx.translate(boss.x + boss.width / 2, boss.y + boss.height / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.drawImage(spaceEffect, -50, -50, 100, 100);
        ctx.restore();

        //맵 전체를 빨간색으로 칠함
        if (this.flashing) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 폭발
        if (!this.safeZone) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 안전구역 표시
        if (this.safeZone) {
            ctx.fillStyle = "rgba(0, 100, 255, 0.5)";
            ctx.fillRect(this.safeZone.x, this.safeZone.y, this.safeZone.size, this.safeZone.size);
        }
    }
}


//소울 스톤
class SoulBullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.dy = 1;
        this.hasExploded = false;
        this.explosionTime = 0;
        this.angle = 0;
    }

    move() {
        if (!this.hasExploded) {
            this.y += this.dy;
            if (this.y >= canvas.height/2) {
                this.hasExploded = true;
            }
        }
    }

    draw() {
        if (!this.hasExploded) {
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

        }
        else {
            let numBullets = 8;
            let radius = this.explosionTime;
            for (let i = 0; i < numBullets; i++) {
                let set_angle = (Math.PI * 2 * i) / numBullets;
                let bulletX = this.x + Math.cos(set_angle + this.angle) * radius;
                let bulletY = this.y + Math.sin(set_angle + this.angle) * radius;
                ctx.fillStyle = "orange";
                ctx.beginPath();
                ctx.arc(bulletX, bulletY, 6, 0, Math.PI * 2);
                ctx.fill();
            }
            this.angle += 0.005;

            this.explosionTime++;

            if (this.explosionTime > 1000) {
                return true;
            }
        }
        return false;
    }
}

// 스페이스 스톤 효과 객체 생성
let spaceStoneEffect = new SpaceStoneEffect();

// 보스 클래스
class Boss {
    constructor(x) {
        this.x = x; // 보스 X 좌표
        this.y = -ThanosHeight
        this.maxHp = 299; // 보스 체력
        this.hp = this.maxHp; // 현재 체력
        this.attackPattern = ["mind", "soul", "time", "power", "reality","space"]; // 인피니티 스톤 패턴
        this.width = ThanosWidth;
        this.height = ThanosHeight;
        this.shootCooldown = 0;
        this.meteorCooldown = 0;
        this.soulCooldown = 0;
        this.isTimeStoneUsed = false;


        //보스 등장 변수
        this.isAppearing = true;
        this.appearSpeed = 1; // 등장 속도

        //이동 속도
        this.moveSpeedX = 1;
        this.moveSpeedY = 0;

        //보스 이동 방향
        this.moveDirectionX = 1; // 1: 오른쪽, -1: 왼쪽
        this.moveDirectionY = 1; // 1: 아래, -1: 위
    }

    adjustMovementPattern() {
        let hpRatio = this.hp / this.maxHp;

        if (hpRatio > 0.7) {
            // 체력 70% 이상: 천천히 좌우 이동
            this.moveSpeedX = 0.5;
            this.moveSpeedY = 0;
        } else{
            this.moveSpeedX = 1;
            this.moveSpeedY = 0.5;
        }
    }
    damaged(p_x, p_y) {
        let hitbox = this.getHitbox();
        if (p_x > hitbox.xMin && p_x < hitbox.xMax && 
            p_y > hitbox.yMin && p_y < hitbox.yMax) {
            
            this.hp = Math.max(0, this.hp - Player.playerAttack);
            console.log(`보스 피격! 현재 체력: ${this.hp}`);
            
            // 체력 UI 반영
            bossDamage(this);
    
            //피격 반짝거림 효과
            this.isHitEffect = true;
            setTimeout(() => {
                this.isHitEffect = false;
            }, 200); // 0.2초 후 원래 색상으로 복구
    
            if (this.hp <= 0) {
                this.onDeath();
            }
        }
    }
    
    isHit(p_x, p_y) {
        let hitbox = this.getHitbox();
        return (p_x >= hitbox.xMin && p_x <= hitbox.xMax &&
                p_y >= hitbox.yMin+100 && p_y <= hitbox.yMax);
    }

    // 보스의 피격 박스 조정
    getHitbox() {
        return {
            xMin: this.x - 120,
            xMax: this.x + this.width -200,
            yMin: this.y,
            yMax: this.y + this.height
        };
    }
    
    // 보스가 죽었을 때 실행할 함수
    onDeath() {
        console.log("보스가 쓰러졌습니다!");
        clear_video.style.objectFit="cover";
        clear_video.style.display="block";
        intro_video.style.display="none";
        intro.style.display="block";
        clear_video.play();
         setTimeout(()=>{
          alert("게임 클리어!");
          location.reload();
         },8000);
    }


    // 보스 이동
    // 보스 이동 패턴 1 (좌우 이동)

    move() {
        if (this.isAppearing) {
            //보스가 처음 등장
            this.y += this.appearSpeed;
            if (this.y >= 50) {
                this.isAppearing = false;
            }
            return;
        }
        this.adjustMovementPattern(); // 체력에 따라 이동 패턴 조정
        // 좌우 이동
        this.x += this.moveSpeedX * this.moveDirectionX;
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            this.moveDirectionX *= -1; // 벽에 닿으면 방향 반전
        }
    }
    // 기본 총알
    shoot() {
        if (this.shootCooldown <= 0) {
            let numBullets = 15; // << 한 번에 발사할 총알 개수
            for (let i = 0; i < numBullets; i++) {
                let angle = (Math.PI * 2 * i) / numBullets; //총알 각도
                let speed = 1; // 총알 속도
                bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height, angle, speed));
            }
            this.shootCooldown = 500;
        } else {
            this.shootCooldown--;
        }
    }

    //파워스톤사용
    usePowerStone() {
        if (this.meteorCooldown <= 0) {
            for (let i = 0; i < 5; i++) {
                let meteorX = Math.random() * canvas.width;
                meteo.push(new Meteorite(meteorX, -50));
            }
            this.meteorCooldown = 1000;
        } else {
            this.meteorCooldown--;
        }
    }

    //소울스톤 사용
    useSoulStone() {
        if (this.soulCooldown <= 0) {
            soulBullets.push(new SoulBullet(this.x + this.width / 2, this.y + this.height));

            this.soulCooldown = 500; // 다음 공격까지 쿨타임 설정
        } else {
            this.soulCooldown--;
        }
    }

    //리얼리티 스톤
    useRealityStone() {
        if (this.isUsingRealityStone) return; // 중복 실행 방지
        this.isUsingRealityStone = true;
    
        let duration = 20000; //20초
        let startTime = Date.now();
        let rotationAngle = 0;
        let rotationSpeed = Math.PI / 1000; //회전 속도 조절 (값을 키우면 빨라짐)
    
        let interval = setInterval(() => {
            let elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                clearInterval(interval);
                ctx.setTransform(1, 0, 0, 1, 0, 0); // 원래 상태 복구
                this.isUsingRealityStone = false;
                return;
            }
    
            //캔버스를 중심으로 회전
            ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotationAngle);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
            rotationAngle += rotationSpeed; // 회전 속도 적용
        }, 10);
    }
    //스페이스 스톤사용
    useSpaceStone(){
        if (!spaceStoneEffect.active) {
            spaceStoneEffect.activate();
        }      
    }
    //마인드스톤 사용
    useMindStone(){
        if (isInverted) return; // 이미 적용 중이면 실행 안 함

        isInverted = true; // 움직임 반전 활성화
    
        setTimeout(() => {
            isInverted = false; // 5초 후 정상 상태 복귀
        }, 5000);
    }
    //타임스톤 사용
    useTimeStone() {
        if (!this.isTimeStoneUsed) {
            this.isTimeStoneUsed = true; //한 번만 실행되도록 설정
            let healAmount = this.maxHp * 0.1; // 보스 체력 20% 회복
            this.hp = Math.min(this.maxHp, this.hp + healAmount);
            
            // 체력 UI 업데이트
            bossDamage(this);
        }
    }
    // 랜덤 스톤 선택
    chooseRandomStone() {
        const randomIndex = Math.floor(Math.random() * this.attackPattern.length);
        selectedStone = this.attackPattern[randomIndex]; // 스톤 고정
        console.log(`선택된 스톤: ${selectedStone}`);
        return selectedStone;
    }
    // 보스 & 건틀렛 그리기
    draw() {
        ctx.save(); // 현재 캔버스 상태 저장

        // 건틀렛 회전
        let gauntletX = this.x + 240;
        let gauntletY = this.y - 20;
        ctx.translate(gauntletX + gauntletWidth / 2, gauntletY + gauntletHeight / 2);
        ctx.rotate(rotationAngle * Math.PI / 180); // 각도를 라디안 값으로 변환
        ctx.translate(-gauntletX - gauntletWidth / 2, -gauntletY - gauntletHeight / 2);
        ctx.drawImage(gauntletImage, gauntletX, gauntletY, gauntletWidth, gauntletHeight);
        ctx.restore(); // 캔버스 상태 복원

        ctx.save(); // 현재 캔버스 상태 저장

        // 보스가 맞았을 때
        if (this.isHitEffect) {
        ctx.filter = "brightness(1.5)"; // 밝게 효과 추가
        }

        //타노스 그리기
        ctx.drawImage(ThanosImage, this.x, this.y, this.width, this.height);
        ctx.restore();

        //선택된 스톤을 건틀렛 위에 표시
        if (selectedStone) {
            ctx.globalAlpha = stoneGlow;
            if (selectedStone === "mind"){
                ctx.drawImage(stoneImages[selectedStone],gauntletX+1,gauntletY+30,stoneSize,stoneSize);
            }
            else if (selectedStone === "power"){
                ctx.drawImage(stoneImages[selectedStone],gauntletX+30,gauntletY+5,stoneSize,stoneSize);
            }
            else if (selectedStone === "reality"){
                ctx.drawImage(stoneImages[selectedStone],gauntletX-8,gauntletY+5,stoneSize,stoneSize);
            }
            else if (selectedStone === "space"){
                ctx.drawImage(stoneImages[selectedStone],gauntletX+12,gauntletY+5,stoneSize,stoneSize);
            }
            else if (selectedStone === "time"){
                ctx.drawImage(stoneImages[selectedStone],gauntletX+60,gauntletY+55,stoneSize,stoneSize);
            }
            else if (selectedStone === "soul"){
                ctx.drawImage(stoneImages[selectedStone],gauntletX-23,gauntletY+5,stoneSize,stoneSize);
            }
            ctx.globalAlpha = 1;
        }
    }


    // 보스 상태 업데이트
    update() {
        this.move();
        this.shoot();
        if (this.hp%20 === 0 && this.hp > 0) {
            if (!this.isRotating) {
                this.isRotating = true;
                this.rotationStartTime = Date.now();
            }
        }
        if (this.isRotating) {
            let elapsedTime = Date.now() - this.rotationStartTime;
            if (elapsedTime < 2000) {
                rotationAngle += 10;
            } else {
                this.isRotating = false;
                this.chooseRandomStone();
                rotationAngle = 0;
            }
        }
        if (selectedStone === "power") {
            this.usePowerStone();
        }
        else if (selectedStone === "soul") {
            this.useSoulStone();
        }
        else if (selectedStone === "reality") {
            this.useRealityStone();
        }
        if (selectedStone === "space"){
            this.useSpaceStone();
        }
        else if (selectedStone === "mind"){
            this.useMindStone();
        }
        else if (selectedStone === "time") {
            this.useTimeStone();
        }
    }
}

// 보스 객체 생성
let boss = new Boss(canvas.width / 2 - ThanosWidth / 2, 50);
let mete = new Meteorite(canvas.width / 2 - ThanosWidth / 2, 50);

//돌 반짝반짝
function glow(){
    if (glowing){
        stoneGlow += 0.05;
        if (stoneGlow >= 3){
            glowing = false;
        }
    }
    else{
        stoneGlow -= 0.05;
        if (stoneGlow <=0.05){
            glowing = true;
        }
    }
}

// 총알이 보스에 맞았는지 확인하는 함수
function checkBulletCollision() {
    bulletList.forEach((bullet, index) => {
        if (boss.isHit(bullet.x, bullet.y)) {
            boss.damaged(bullet.x, bullet.y); // 보스에게 데미지 적용
            bulletList.splice(index, 1); // 맞은 총알 삭제
        }
    });
}

//메인루프
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
   
    //플레이어에 대한 쿨 다운을 
    Player.cooldown -= 4;
    PlayerUpdate();
    Playerdrawing();

    // 기본 총알
    bulletList.forEach((bullet, index) => {
        bullet.move();
        bullet.draw(ctx);
    
        if (bullet.y + bullet.height < 0) {
          bulletList.splice(index, 1);}
        });

    if (timeRemaining<=0) {
        if (!boss.isUsingRealityStone) {
            ctx.setTransform(1, 0, 0, 1, 0, 0); // 회전 초기화 (리얼리티 스톤이 없을 때만)
        }
        boss.update();
        boss.draw();

        checkBulletCollision();

        spaceStoneEffect.update();
        spaceStoneEffect.draw();

        // 기본 총알
        bullets.forEach((Pbullet) => {
            Pbullet.move();
            Pbullet.draw();
        });

        //운석
        meteo.forEach((mete, index) => {
            mete.move();

            if (mete.checkCollision() && !mete.exploded) {
                mete.exploded = true;
            }

            if (mete.exploded && mete.explosionTime >= 20) {
                meteo.splice(index, 1); // 폭발 후 제거
            } else {
                mete.draw();
            }
        });

        //소울 스톤
        soulBullets.forEach((bullet, index) => {
            bullet.move();
            if (bullet.draw()) {
                soulBullets.splice(index, 1); // 폭발 후 제거
            }
        });

        //glow() 실행 조건
        if (!isRotating && selectedStone) {
            glowing = true;
            glow();
        }
        else{
            glowing = false;
        }    
    }

    checkPlayerHit();
    checkPlayerSoulHit()

    requestAnimationFrame(gameLoop);
}

// 게임 시작
gameLoop();