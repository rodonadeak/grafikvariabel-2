let chartInstance;

function plotGraph() {
    const input = document.getElementById('equations').value;
    const equations = input.split('\n');
    const datasets = [];
    const ctx = document.getElementById('linearGraph').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    let yMax = 0;
    let yMin = 0;

    equations.forEach((eq, index) => {
        const parts = eq.split(/=|>=|<=|>|</);
        const lhs = parts[0].trim();
        const rhs = parseFloat(parts[1].trim());
        const inequality = eq.match(/>=|<=|>|</); // null jika ini persamaan

        const matchX = lhs.match(/([-+]?\d*\.?\d*)x/);
        const matchY = lhs.match(/([-+]?\d*\.?\d*)y/);

        const coefX = matchX ? parseFloat(matchX[1] || '1') : 0;
        const coefY = matchY ? parseFloat(matchY[1] || '1') : 0;

        const yFunction = x => (rhs - coefX * x) / coefY;

        const data = [];
        for (let x = 0; x <= 10; x += 0.5) {
            const y = yFunction(x);
            data.push({ x: x, y: y });
            if (y > yMax) yMax = y;
            if (y < yMin) yMin = y;
        }

        datasets.push({
            label: `Garis ${index + 1}: ${eq}`,
            data: data,
            borderColor: getRandomColor(),
            fill: false,
        });

        if (inequality) {
            const areaData = [];
            for (let x = 0; x <= 10; x += 0.5) {
                const yBoundary = yFunction(x);
                let yAreaMin, yAreaMax;

                if (inequality[0] === '<' || inequality[0] === '<=') {
                    yAreaMax = yBoundary;
                    yAreaMin = yMin < 0 ? yMin : 0;
                } else if (inequality[0] === '>' || inequality[0] === '>=') {
                    yAreaMin = yBoundary;
                    yAreaMax = yMax;
                }

                areaData.push({ x: x, y: yAreaMin });
                areaData.push({ x: x, y: yAreaMax });
            }

            datasets.push({
                label: `Area ${index + 1}: ${eq}`,
                data: areaData,
                borderColor: getRandomColor(),
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                fill: true,
            });
        }
    });

    const yRange = Math.ceil(Math.max(Math.abs(yMax), Math.abs(yMin)) * 1.1);
    const xRange = 10;

    chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: xRange
                },
                y: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: yRange
                }
            }
        }
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
