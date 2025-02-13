// 캔버스 이름/2d로
let canvas=document.getElementById("gameCanvas");
let ctx=canvas.getContext("2d");

// 게임 시작 화면
let Start_Img = document.getElementById("Start_TK");
let btn_start=document.getElementById("btn");

// 인트로
let intro=document.getElementById("intro_TK");
let intro_video=document.getElementById("intro_mp4_TK");

// UI
let GameSkill=document.getElementById("Game_Skill");
let item_Time=document.getElementById("skill_time");
let Skill=document.getElementById("Skill_icon");

// 아이템
let SkillA = document.getElementById("Skill_A");
let SkillB = document.getElementById("Skill_B");

// let life=5;
let life=document.getElementsByClassName("life");

// 보스 시간 / 시간에 따라 줄어들도록 
let Boss_time=document.getElementById("time_limit");
let bossTimer=0; 
let Reality_stone=false;

// 보스 hp
let Boss_Hp=document.getElementById("life_boss");

// 레벨
let game_LV=document.getElementById("LV_bar");
let lv_Skill=0;

// 게임 화면 조정 후 주석 해제
intro_video.style.objectFit="cover";

// 게임 화면 조정 후 동영상 diplay 해제
function StartMap() {
	Start_Img.style.display = "none";
	intro_video.play();

	setTimeout(function(){
        timerBoss();
		intro.style.display ="none";
	},6000);
}

function LV() {
    // 레벨이 4면 스킬 1 레벨이 10이면 스킬 2 
    if (lv_Skill==4) {
       Skill.style.display="none";
       SkillA.style.display="block";
    }if (lv_Skill==10) {
       SkillB.style.display="block";
    }
 }
let timeRemaining = 100;  // 100%에서 시작
 function timerBoss(){
    let timerInterval = setInterval(function() {
     if (timeRemaining <= 0) {
         clearInterval(timerInterval); // 타이머 종료
         // 보스 등장 함수 호출
         // start_Boss_PhaseA();
        } else {
            timeRemaining -= 10; // 1%씩 감소
 
            // 타이머 색상이 위에서부터 사라지도록 설정
            Boss_time.style.backgroundImage = `linear-gradient(to top, red ${timeRemaining}%, white ${timeRemaining}%)`;
        }
    }, 1000);  // 1초마다 감소
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
let glowing = true;
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


//운석 이미지
const meteoImage = new Image();
meteoImage.src = "images/meteo.png";


//스페이스 스톤 효과
const spaceEffect = new Image();
spaceEffect.src = "images/space_effect.png";

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
    speed : 1,                 //플레이어의 기본 스피드값
    moveLeft: false,          // 왼쪽으로 옮겨질지에 대한 여부값
    moveRight :false,         //오른쪽으로 옮겨질지에 대한 여부값
    moveUp:false,             // 위쪽으로 옮겨질지 대한 여부값
    moveDown:false,          // 아래쪽으로 옮겨질지 대한 여부값
    cooldown: 10,           //쿨다운 값은 임의의 설정한 거니까 이 부분은 회의를 통해서 설정할 예정.
    damageCount : null,   // 공격 받은 값 
    playerAttack: 1, // 여기서 player의 기본 공격력
  };

  //아이언맨 캔버스 위에 이미지 그려주는 함수
function Playerdrawing(){ 
    // console.log("그려짐");
    ctx.drawImage(IronManImage,Player.x,Player.y,Player.width,Player.height);
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
            bullet.x > Player.x &&
            bullet.x < Player.x + Player.width &&
            bullet.y > Player.y &&
            bullet.y < Player.y + 30
        ) {
            // 피격 시 체력 감소
            Player.hp--;
            console.log(`플레이어 피격! 남은 체력: ${Player.hp}`);

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
    alert("💀 게임 오버! 💀");
    location.reload(); // 게임 재시작(새로 고침)
}


 // 타노스의 소울스톤일 때에 대한 설정.
// function takeDamage(attackName) {
//     if (attackName === "soulstone") { // 소울스톤 공격인지 확인
//         let damage = 5; // 받는 피해량

//         for (let i = 0; i < Player.hp.length; i++) {
//             if (Player.hp[i] > 0) { 
//                 Player.hp[i] -= damage; // 데미지를 적용
//                 if (Player.hp[i] < 0) { // HP가 0 이하가 되지 않도록 처리
//                     Player.hp[i] = 0;
//                 }
//                 break; // 첫 번째로 체력이 있는 곳에만 적용하고 루프 종료
//             }
//         }
//     }
// }

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

function bAdiscern(){
    if (bossAttack) { // 보스가 공격했을 때 실행!
        damageCount++; // 보스 공격 횟수 증가

        for (let i = 0; i < hp.length; i++) { // HP 리스트 확인
             if (hp[i] == 0) {  // 만약 체력이 0이면
             hp.splice(i, 1); // 리스트에서 제거
             i--; // 인덱스를 줄여서 다음 요소를 건너뛰지 않도록 함
        }
      }
   }
    else if(!bossAttack){ }
}


window.addEventListener("keydown", (e) => {
    let direction = isInverted ? -1 : 1; // 반전 여부에 따라 방향 조정

    if (e.key === "a") {
        Player.moveLeft = true;
        Player.x -= Player.speed * direction;
    } else if (e.key === "d") {
        Player.moveRight = true;
        Player.x += Player.speed * direction;
    } else if (e.key === "w") {
        Player.moveUp = true;
        Player.y -= Player.speed * direction;
    } else if (e.key === "s") {
        Player.moveDown = true;
        Player.y += Player.speed * direction;
    }
    else if (e.key === "j") {
        shoot();
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
  
  
    else if(e.key=='f'){

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
            let numBullets = 12;
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

// 보스 클래스
class Boss {
    constructor(x, y) {
        this.x = x; // 보스 X 좌표
        this.y = y; // 보스 Y 좌표
        this.maxHp = 100; // 보스 체력
        this.hp = this.maxHp; // 현재 체력
        this.phase = 1; // 보스 페이즈
        this.attackPattern = ["mind", "soul", "time", "power", "reality","space"]; // 인피니티 스톤 패턴
        this.width = ThanosWidth;
        this.height = ThanosHeight;
        this.movePattern = Math.floor(Math.random() * 3) + 1;
        this.shootCooldown = 0;
        this.meteorCooldown = 0;
        this.soulCooldown = 0;
    }

    damaged(p_x, p_y) {
        let hitbox = this.getHitbox();
        if (p_x > hitbox.xMin && p_x < hitbox.xMax && 
            p_y > hitbox.yMin && p_y < hitbox.yMax) {
            
            this.hp = Math.max(0, this.hp - Player.playerAttack);
            console.log(`보스 피격! 현재 체력: ${this.hp}`);
            
            // 체력 UI 반영
            bossDamage(this);

            if (this.hp <= 0) {
                this.onDeath();
                location.reload();
            }
        }
    }

    isHit(p_x, p_y) {
        let hitbox = this.getHitbox();
        return (p_x >= hitbox.xMin && p_x <= hitbox.xMax &&
                p_y >= hitbox.yMin && p_y <= hitbox.yMax);
    }

    // 보스의 피격 박스 계산
    getHitbox() {
        return {
            xMin: this.x + 30,
            xMax: this.x + this.width - 30,
            yMin: this.y + 20,
            yMax: this.y + this.height
        };
    }
    
    
    // 보스가 죽었을 때 실행할 함수
    onDeath() {
        console.log("보스가 쓰러졌습니다!");
        //location.reload();
        // 여기에 보스 사망 애니메이션 또는 다음 페이즈 로직 추가 가능
    }
    

    // 보스 이동


    // 보스 이동 패턴 1 (좌우 이동)
    move1() {
        if (this.x > 0 && this.x < canvas.width){
            this.x += Math.sin(Date.now() / 1000) * 1;
        }
        // console.log(this.x);
    }


    // 보스 이동 패턴 2 (위아래 이동)
    move2() {
        if (this.y > 0 && this.y < -canvas.height/2){
            this.y += Math.sin(Date.now() / 500) * 1;
        }
    }

    // 보스 이동 패턴 3 (대각선 이동)
    move3() {
        this.x += Math.sin(Date.now() / 500) * 1;
        this.y += Math.cos(Date.now() / 500) * 1;
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
            this.shootCooldown = 400;
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

            this.soulCooldown = 300; // 다음 공격까지 쿨타임 설정
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
    // useSpaceStone(){
        
    // }

    useMindStone(){
        if (isInverted) return; // 이미 적용 중이면 실행 안 함

        isInverted = true; // 움직임 반전 활성화
        console.log("마인드 스톤 발동! 움직임 반전됨!");
    
        setTimeout(() => {
            isInverted = false; // 5초 후 정상 상태 복귀
            console.log("마인드 스톤 효과 종료!");
        }, 5000);
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


        //타노스 그리기
        ctx.drawImage(ThanosImage, this.x, this.y, this.width, this.height);

        ctx.save();
        
        // 보스가 맞았을 때 빨간색 효과
        if (this.isHitEffect) {
            ctx.filter = "brightness(1.5)"; // 밝게 효과 추가
        }
    
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
        setTimeout(() => {
            this.movePattern = 1;
            // console.log(this.movePattern);
        }, 5000);
   
        setTimeout(() => {
            this.movePattern = 2;
            // console.log(this.movePattern);
        }, 10000);
   
        setTimeout(() => {
            this.movePattern = 3;
            // console.log(this.movePattern);
        }, 15000);


        if (this.movePattern === 1) {
            this.move1();
        }
        else if (this.movePattern === 2) { 
            this.move2();
        }
        else {
            this.move3();
        }
        
        this.shoot();


        if (selectedStone === "power") {
            this.usePowerStone();
        }
        if (selectedStone === "soul") {
            this.useSoulStone();
        }
        if (selectedStone === "reality") {
            this.useRealityStone();
        }
        // if (selectedStone === "space"){
        //     this.useSpaceStone();
        // }
        if (selectedStone === "mind"){
            this.useMindStone();
        }
        if (selectedStone === "time") {
            this.hp += 10;
        }
    }
}


// 보스 객체 생성
let boss = new Boss(canvas.width / 2 - ThanosWidth / 2, 50);
let mete = new Meteorite(canvas.width / 2 - ThanosWidth / 2, 50);


// 임시 이벤트 (회전 및 스톤 선택)
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        isRotating = true;
        selectedStone = null;
    }
});
 
window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        isRotating = false;
        rotationAngle = 0;
        boss.chooseRandomStone();
    }
});


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


function gameLoop() {
    if (!boss.isUsingRealityStone) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // 회전 초기화 (리얼리티 스톤이 없을 때만)
    }
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
    
    checkBulletCollision();
    if (timeRemaining<=0) {

        boss.update();
        boss.draw();

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

        if (isRotating) {
            rotationAngle += 10;
        }

        glow();
    }
    checkPlayerHit();

    requestAnimationFrame(gameLoop);
}

// 게임 시작
gameLoop();