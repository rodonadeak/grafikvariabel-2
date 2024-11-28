let chart = null;

function parseGeneralEquation(equation) {
    equation = equation.replace(/\s+/g, '').replace('<=','≤').replace('>=','≥');
    
    const compareSymbols = ['=', '≤', '≥', '<', '>'];
    let symbol = '=';
    for (let comp of compareSymbols) {
        if (equation.includes(comp)) {
            symbol = comp;
            break;
        }
    }

    const [left, right] = equation.split(symbol);
    
    return { left, right, symbol };
}

function solveForY(equation) {
    const parsed = parseGeneralEquation(equation);
    const left = parsed.left;
    const right = parsed.right;

    // Rearrange to y = ...
    if (left.includes('x')) {
        // Move x terms to one side
        const terms = left.match(/[+-]?\d*x?/g).filter(term => term);
        const constantTerms = terms.filter(term => !term.includes('x'));
        const xTerms = terms.filter(term => term.includes('x'));

        // Combine constant terms
        const constant = constantTerms.reduce((sum, term) => sum + (term ? parseFloat(term) : 0), 0);
        
        // Combine x coefficients
        const xCoeff = xTerms.reduce((sum, term) => {
            if (term === 'x') return sum + 1;
            if (term === '-x') return sum - 1;
            return sum + parseFloat(term);
        }, 0);

        // Solve for y: y = (-ax - c) / b
        return `y = ${xCoeff !== 0 ? `(-${xCoeff}x ${constant >= 0 ? '- ' : '+ '}${Math.abs(constant)})/${Math.abs(1)}` : constant}`;
    } else if (left.includes('y')) {
        // Already in y terms, just rearrange
        return `y = ${right}`;
    }
    
    throw new Error('Cannot solve equation');
}

function solveAndGraph() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    const eq1Input = document.getElementById('equation1').value;
    const eq2Input = document.getElementById('equation2').value;
    const solutionDiv = document.getElementById('solution');
    const result1Div = document.getElementById('result1');
    const result2Div = document.getElementById('result2');

    // Clear previous chart
    if (chart) chart.destroy();

    try {
        // Solve for y representation
        const eq1 = solveForY(eq1Input);
        const eq2 = solveForY(eq2Input);

        // Show solutions
        result1Div.innerHTML = `Hasil Persamaan 1: ${eq1}`;
        result2Div.innerHTML = `Hasil Persamaan 2: ${eq2}`;

        // Prepare datasets
        const datasets = [
            { 
                label: 'Equation 1', 
                data: generatePoints(eq1),
                type: 'line',
                borderColor: 'blue',
                fill: false,
                pointRadius: 0
            },
            { 
                label: 'Equation 2', 
                data: generatePoints(eq2),
                type: 'line',
                borderColor: 'red',
                fill: false,
                pointRadius: 0
            }
        ];

        // Create chart
        chart = new Chart(ctx, {
            type: 'scatter',
            data: { datasets },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'center',
                        min: -10,
                        max: 10
                    },
                    y: {
                        type: 'linear',
                        position: 'center',
                        min: -10,
                        max: 10
                    }
                }
            }
        });

        solutionDiv.innerHTML = `Graphed Equations: ${eq1Input}, ${eq2Input}`;
    } catch (error) {
        solutionDiv.innerHTML = `Error: ${error.message}`;
    }
}

function generatePoints(equation) {
    const points = [];
    
    // Ensure equation is in y = ... form
    if (!equation.includes('y =')) {
        throw new Error('Equation must be in y = ... form');
    }

    // Extract right side of equation
    const expr = equation.split('y =')[1].trim();

    for (let x = -10; x <= 10; x += 0.5) {
        try {
            // Replace x with actual value
            const yExpr = expr.replace(/x/g, `(${x})`);
            const y = math.evaluate(yExpr);
            points.push({x, y});
        } catch (error) {
            console.error('Point generation error', error);
        }
    }

    return points;
}
