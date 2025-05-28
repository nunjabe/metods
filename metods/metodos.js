// Función para evaluar expresiones matemáticas
function evaluate(expr, x) {
    let expression = expr.replace(/\^/g, '**')
                       .replace(/sin\(/g, 'Math.sin(')
                       .replace(/cos\(/g, 'Math.cos(')
                       .replace(/tan\(/g, 'Math.tan(')
                       .replace(/log\(/g, 'Math.log(')
                       .replace(/sqrt\(/g, 'Math.sqrt(')
                       .replace(/x/g, `(${x})`);
    
    try {
        return eval(expression);
    } catch (error) {
        throw new Error('Función inválida');
    }
}

// Función para calcular la derivada numérica
function derivative(func, x) {
    const h = 1e-8;
    return (evaluate(func, x + h) - evaluate(func, x - h)) / (2 * h);
}

// Función principal para resolver usando Newton-Raphson
function solve() {
    try {
        const func = document.getElementById('functionInput').value.trim();
        const x0 = parseFloat(document.getElementById('initialGuess').value);
        const tol = parseFloat(document.getElementById('tolerance').value);
        
        if (!func) throw new Error('Ingresa una función');
        if (isNaN(x0) || isNaN(tol)) throw new Error('Valores inválidos');
        
        let x = x0;
        let iterations = [];
        
        for (let i = 0; i < 20; i++) {
            const fx = evaluate(func, x);
            const fpx = derivative(func, x);
            
            if (Math.abs(fpx) < 1e-15) {
                throw new Error('Derivada muy pequeña');
            }
            
            const xNew = x - fx / fpx;
            const error = Math.abs(xNew - x);
            
            iterations.push({
                n: i + 1,
                x: x.toFixed(6),
                xNew: xNew.toFixed(6),
                error: error.toExponential(2)
            });
            
            if (error < tol) {
                showResult(xNew, iterations, true);
                return;
            }
            
            x = xNew;
        }
        
        showResult(x, iterations, false);
        
    } catch (error) {
        showError(error.message);
    }
}

// Función para mostrar los resultados
function showResult(root, iterations, converged) {
    const html = `
        <div class="result-box">
            <h6>Resultado</h6>
            <p><strong>Raíz:</strong> ${root.toFixed(8)}</p>
            <p><strong>Iteraciones:</strong> ${iterations.length}</p>
            <p><strong>Estado:</strong> ${converged ? 'Convergió' : 'No convergió'}</p>
            
            <div class="table-responsive mt-3">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>n</th>
                            <th>xₙ</th>
                            <th>xₙ₊₁</th>
                            <th>Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${iterations.map(iter => `
                            <tr>
                                <td>${iter.n}</td>
                                <td>${iter.x}</td>
                                <td>${iter.xNew}</td>
                                <td>${iter.error}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('result').innerHTML = html;
}

// Función para mostrar errores
function showError(message) {
    document.getElementById('result').innerHTML = `
        <div class="error-box">
            <strong>Error:</strong> ${message}
        </div>
    `;
}

// Función para cargar ejemplos predefinidos
function setExample(func, x0) {
    document.getElementById('functionInput').value = func;
    document.getElementById('initialGuess').value = x0;
}

// Auto-resolver al cargar la página
window.onload = () => solve();

// Resolver cuando se presiona Enter
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') solve();
});
