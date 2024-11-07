let chartInstance;

function plotGraph() {
    const input = document.getElementById('equations').value;
    const equations = input.split('\n');
    const datasets = [];
    const ctx = document.getElementById('linearGraph').getContext('2d');

    let xMin = Infinity;
    let xMax = -Infinity;

    if (chartInstance) {
        chartInstance.destroy();
    }

    equations.forEach((eq, index) => {
        let parts, operator, a, b, c;

        if (eq.includes('=')) {
            parts = eq.split('=');
            operator = '=';
        } else if (eq.includes('<=')) {
            parts = eq.split('<=');
            operator = '<=';
        } else if (eq.includes('>=')) {
            parts = eq.split('>=');
            operator = '>=';
        } else if (eq.includes('<')) {
            parts = eq.split('<');
            operator = '<';
        } else if (eq.includes('>')) {
            parts = eq.split('>');
            operator = '>';
        } else {
            return;
        }

        const lhs = parts[0].trim();
        const rhs = parseFloat(parts[1].trim());
        const match = lhs.match(/(-?\d*)x\s*([\+\-]\s*\d+)?/);

        if (match) {
            a = parseFloat(match[1] || '1');
            b = match[2] ? parseFloat(match[2].replace(/\s+/g, '')) : 0;
            c = rhs;
        } else {
            return;
        }

        if (operator === '=') {
            const xValue = (c - b) / a;
            xMin = Math.min(xMin, xValue);
            xMax = Math.max(xMax, xValue);

            datasets.push({
                label: `Garis ${index + 1}: ${eq}`,
                data: [{ x: xValue, y: -10 }, { x: xValue, y: 10 }],
                borderColor: getRandomColor(),
                fill: false,
                borderWidth: 2,
            });
        } else {
            const areaData = [];
            const start = operator.includes('<') ? -10 : (c - b) / a;
            const end = operator.includes('>') ? 10 : (c - b) / a;

            for (let x = start; x <= end; x += 0.1) {
                areaData.push({ x: x, y: 0 });
            }

            xMin = Math.min(xMin, start);
            xMax = Math.max(xMax, end);

            datasets.push({
                label: `Area ${index + 1}: ${eq}`,
                data: areaData,
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: getRandomColor(),
                fill: true,
                pointRadius: 0,
            });
        }
    });

    chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            responsive: true,
            scales: {
                x: { 
                    type: 'linear', 
                    position: 'bottom', 
                    min: xMin - 5,
                    max: xMax + 5, 
                    title: { display: true, text: 'Nilai x' }
                },
                y: { 
                    type: 'linear', 
                    display: false 
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
