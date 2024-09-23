function updateSimulationCount() {
    const input = document.getElementById('numberInput').value;
    document.getElementById('simulationCount').innerText = `模拟次数：${input}`;
}

function enterSimulation(type) {
    const count = parseInt(document.getElementById('numberInput').value);
    if (isNaN(count) || count <= 0) {
        alert('请输入一个有效的数字');
        return;
    }

    let redCount = 0;
    let greenCount = 0;

    document.getElementById('result').innerHTML = `
        <div class="flex flex-col items-center mt-4">
            <div class="box-container">
                <div class="circle"></div>
                <img src="box.png" alt="box" class="w-32 h-32">
            </div>
            <p class="mt-2" id="currentSimulationCount">模拟次数：0</p>
            <div class="w-full mt-2">
                <div class="bar bg-red-500 red-bar" style="width: 0%"></div>
                <p class="text-red-500 red-count">红色的次数：0</p>
            </div>
            <div class="w-full mt-2">
                <div class="bar bg-green-500 green-bar" style="width: 0%"></div>
                <p class="text-green-500 green-count">绿色的次数：0</p>
            </div>
        </div>
    `;

    const circle = document.querySelector('.circle');
    const redBar = document.querySelector('.red-bar');
    const greenBar = document.querySelector('.green-bar');
    const redCountText = document.querySelector('.red-count');
    const greenCountText = document.querySelector('.green-count');
    const currentSimulationCount = document.getElementById('currentSimulationCount');

    function updateUI() {
        const redPercentage = (redCount / count) * 100;
        const greenPercentage = (greenCount / count) * 100;

        redBar.style.width = `${redPercentage}%`;
        greenBar.style.width = `${greenPercentage}%`;
        redCountText.innerText = `红色的次数：${redCount}`;
        greenCountText.innerText = `绿色的次数：${greenCount}`;
        currentSimulationCount.innerText = `模拟次数：${redCount + greenCount}`;
    }

    function simulate(i) {
        if (i >= count) return;

        setTimeout(() => {
            if (type === '1红1绿') {
                if (Math.random() < 0.5) {
                    redCount++;
                    circle.style.backgroundColor = 'red';
                } else {
                    greenCount++;
                    circle.style.backgroundColor = 'green';
                }
            } else if (type === '3红1绿') {
                if (Math.random() < 0.75) {
                    redCount++;
                    circle.style.backgroundColor = 'red';
                } else {
                    greenCount++;
                    circle.style.backgroundColor = 'green';
                }
            }

            updateUI();
            simulate(i + 1);
        }, 5);
    }

    simulate(0);
}
