const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let isSpaceStoneActive = false;
let thanosVisible = true;
let blackHoleSize = 0;
let safeZones = [];
let currentZone = 0;
let timer = 0;
let explosionTriggered = false;
let explosionSize = 0;
let explosionPhase = 0;
let explosionDelay = 120; // 💥 폭발 전 추가 대기 시간 (1초 증가)

// 타노스 초기 위치
let thanos = { x: canvas.width / 2, y: 100, size: 50 };

// 플레이어 (안전 구역 확인 용도)
let player = { x: canvas.width / 2, y: canvas.height - 50, size: 30 };

// 스페이스 스톤 패턴 시작
function activateSpaceStone() {
    if (isSpaceStoneActive) return;

    isSpaceStoneActive = true;
    thanosVisible = false;
    blackHoleSize = 10;
    safeZones = generateSafeZones();
    currentZone = 0;
    timer = 0;
    explosionTriggered = false;
    explosionSize = 0;
    explosionPhase = 0; // 첫 번째 폭발부터 시작
}

// 안전 구역 생성
function generateSafeZones() {
    let zones = [];
    for (let i = 0; i < 3; i++) {
        let x = Math.random() * (canvas.width - 200) + 100;
        let y = Math.random() * (canvas.height - 200) + 100;
        zones.push({ x, y });
    }
    return zones;
}

// 게임 루프
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 타노스 그리기
    if (thanosVisible) {
        ctx.fillStyle = "purple";
        ctx.beginPath();
        ctx.arc(thanos.x, thanos.y, thanos.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // 블랙홀 효과
    if (isSpaceStoneActive) {
        // 블랙홀 확대
        if (blackHoleSize < 200) {
            blackHoleSize += 5;
        }

        // 블랙홀 그리기
        ctx.fillStyle = "rgba(0, 0, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, blackHoleSize, 0, Math.PI * 2);
        ctx.fill();

        // 안전 구역 표시 (순서대로 깜빡이게)
        for (let i = 0; i < safeZones.length; i++) {
            if (i === currentZone) {
                let alpha = Math.abs(Math.sin(timer / 30)); // 깜빡이는 효과
                ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
            } else {
                ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
            }
            ctx.beginPath();
            ctx.arc(safeZones[i].x, safeZones[i].y, 50, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3초마다 안전 구역 변경
        timer++;
        if (timer % 120 === 0 && currentZone < safeZones.length) {
            currentZone++;
        }

        // 3번째 안전 구역이 끝나면 폭발 시작 (💥 1초 대기 추가)
        if (currentZone >= safeZones.length && !explosionTriggered) {
            if (explosionDelay > 0) {
                explosionDelay--; // 1초 대기
            } else {
                explosionTriggered = true;
                explosionSize = 1;
                explosionPhase = 0;
            }
        }
    }

    // 3단계 폭발 애니메이션
    if (explosionTriggered) {
        explosionSize += 8; // 💥 폭발 확산 속도 조정

        ctx.fillStyle = `rgba(255, 0, 0, ${1 - explosionSize / canvas.width})`;
        ctx.beginPath();
        ctx.arc(safeZones[explosionPhase].x, safeZones[explosionPhase].y, explosionSize, 0, Math.PI * 2);
        ctx.fill();

        // 첫 번째 폭발 후 두 번째 폭발로 이동 (💥 폭발 후 1초 대기 추가)
        if (explosionSize >= canvas.width * 1.5) {
            explosionSize = 1;
            explosionPhase++;

            if (explosionPhase >= 3) {
                deactivateSpaceStone();
            } else {
                explosionDelay = 60; // 💥 다음 폭발 전 1초 대기
            }
        }
    }

    // 플레이어 그리기
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(gameLoop);
}

// 스페이스 스톤 종료
function deactivateSpaceStone() {
    isSpaceStoneActive = false;
    thanosVisible = true;
    explosionTriggered = false;
    explosionDelay = 60; // 다음 패턴을 위해 초기화
}

// 키 입력 처리
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        activateSpaceStone();
    }
    if (e.code === "ArrowLeft") {
        player.x -= 20;
    }
    if (e.code === "ArrowRight") {
        player.x += 20;
    }
    if (e.code === "ArrowUp") {
        player.y -= 20;
    }
    if (e.code === "ArrowDown") {
        player.y += 20;
    }
    if (e.code === "KeyT") {
        location.reload(); // 강제 리셋 (디버깅용)
    }
});

// 게임 시작
gameLoop();
