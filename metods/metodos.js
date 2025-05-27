let tamaño = 3; // Tamaño actual de la matriz
let pasos = []; // Para guardar cada paso del proceso

// Cuando carga la página, crear la matriz inicial
window.onload = function() {
    crearMatriz();
    ejemplo1(); // Cargar un ejemplo por defecto
};

// Crear la matriz de entrada según el tamaño seleccionado
function crearMatriz() {
    tamaño = parseInt(document.getElementById('size').value);
    const contenedor = document.getElementById('matriz');
    
    let html = '';
    
    // Etiquetas de las variables (x1, x2, x3, etc.)
    html += '<div class="d-flex justify-content-center mb-2">';
    for (let j = 0; j < tamaño; j++) {
        html += `<div class="etiqueta-variable" style="width: 70px;">x${j + 1}</div>`;
    }
    html += '<div style="width: 20px;"></div>'; // Espacio para separador
    html += '<div class="etiqueta-variable" style="width: 70px;">= b</div>';
    html += '</div>';
    
    // Crear las filas de la matriz
    for (let i = 0; i < tamaño; i++) {
        html += '<div class="fila-matriz">';
        
        // Coeficientes de las variables
        for (let j = 0; j < tamaño; j++) {
            html += `<input type="number" class="input-matriz" id="a${i}${j}" value="0" step="any">`;
        }
        
        // Separador visual para la matriz aumentada
        html += '<div class="separador"></div>';
        
        // Término independiente
        html += `<input type="number" class="input-matriz" id="b${i}" value="0" step="any">`;
        
        html += '</div>';
    }
    
    contenedor.innerHTML = html;
}

// Ejemplo 1: Sistema 3x3 sencillo
function ejemplo1() {
    if (tamaño !== 3) {
        document.getElementById('size').value = 3;
        crearMatriz();
    }
    
    // Sistema: 2x + y - z = 8, -3x - y + 2z = -11, -2x + y + 2z = -3
    const valores = [
        [2, 1, -1, 8],
        [-3, -1, 2, -11],
        [-2, 1, 2, -3]
    ];
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById(`a${i}${j}`).value = valores[i][j];
        }
        document.getElementById(`b${i}`).value = valores[i][3];
    }
}

// Ejemplo 2: Sistema 2x2 sencillo
function ejemplo2() {
    document.getElementById('size').value = 2;
    crearMatriz();
    
    // Sistema: 2x + 3y = 7, x - y = 1
    const valores = [
        [2, 3, 7],
        [1, -1, 1]
    ];
    
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            document.getElementById(`a${i}${j}`).value = valores[i][j];
        }
        document.getElementById(`b${i}`).value = valores[i][2];
    }
}

// Limpiar todos los campos
function limpiar() {
    for (let i = 0; i < tamaño; i++) {
        for (let j = 0; j < tamaño; j++) {
            document.getElementById(`a${i}${j}`).value = 0;
        }
        document.getElementById(`b${i}`).value = 0;
    }
    
    // Limpiar resultados
    document.getElementById('resultados').innerHTML = '<div class="text-center text-muted"><p>Los resultados aparecerán aquí</p></div>';
    document.getElementById('pasos').innerHTML = '<div class="text-center text-muted"><p>El proceso detallado aparecerá aquí</p></div>';
}

// Obtener la matriz desde los inputs
function obtenerMatriz() {
    const matriz = [];
    
    for (let i = 0; i < tamaño; i++) {
        const fila = [];
        
        // Obtener coeficientes
        for (let j = 0; j < tamaño; j++) {
            const valor = parseFloat(document.getElementById(`a${i}${j}`).value) || 0;
            fila.push(valor);
        }
        
        // Obtener término independiente
        const b = parseFloat(document.getElementById(`b${i}`).value) || 0;
        fila.push(b);
        
        matriz.push(fila);
    }
    
    return matriz;
}

// Función principal para resolver el sistema
function resolver() {
    try {
        // Obtener la matriz de los inputs
        const matriz = obtenerMatriz();
        
        // Aplicar Gauss-Jordan
        const resultado = gaussJordan(matriz);
        
        // Mostrar resultados
        mostrarResultados(resultado);
        mostrarPasos();
        
    } catch (error) {
        mostrarError(error.message);
    }
}

// Implementación del método de Gauss-Jordan (simplificado)
function gaussJordan(matriz) {
    const n = matriz.length;
    pasos = []; // Limpiar pasos anteriores
    
    // Hacer una copia de la matriz para no modificar la original
    const A = matriz.map(fila => [...fila]);
    
    // Guardar matriz inicial
    pasos.push({
        titulo: "Matriz inicial",
        matriz: A.map(fila => [...fila]),
        operacion: "Matriz aumentada [A|b]"
    });
    
    // Proceso de eliminación
    for (let i = 0; i < n; i++) {
        
        // Paso 1: Hacer que el elemento diagonal sea 1
        const pivote = A[i][i];
        
        if (Math.abs(pivote) < 0.000001) {
            throw new Error(`No se puede resolver: pivote cero en fila ${i + 1}`);
        }
        
        // Dividir toda la fila por el pivote
        for (let j = 0; j <= n; j++) {
            A[i][j] = A[i][j] / pivote;
        }
        
        pasos.push({
            titulo: `Paso ${pasos.length}`,
            matriz: A.map(fila => [...fila]),
            operacion: `Dividir fila ${i + 1} entre ${redondear(pivote)}`
        });
        
        // Paso 2: Hacer ceros en el resto de la columna
        for (let k = 0; k < n; k++) {
            if (k !== i && A[k][i] !== 0) {
                const factor = A[k][i];
                
                // Restar múltiplo de la fila i a la fila k
                for (let j = 0; j <= n; j++) {
                    A[k][j] = A[k][j] - factor * A[i][j];
                }
                
                pasos.push({
                    titulo: `Paso ${pasos.length}`,
                    matriz: A.map(fila => [...fila]),
                    operacion: `F${k + 1} = F${k + 1} - (${redondear(factor)}) × F${i + 1}`
                });
            }
        }
    }
    
    // Extraer la solución (última columna)
    const solucion = [];
    for (let i = 0; i < n; i++) {
        solucion.push(A[i][n]);
    }
    
    return solucion;
}

// Mostrar los resultados
function mostrarResultados(solucion) {
    let html = '<h6 class="mb-3">Solución del sistema:</h6>';
    
    for (let i = 0; i < solucion.length; i++) {
        html += '<div class="resultado-item">';
        html += `<strong>x<sub>${i + 1}</sub> = <span class="valor-solucion">${redondear(solucion[i])}</span></strong>`;
        html += '</div>';
    }
    
    // Verificación (opcional)
    html += '<div class="mt-3">';
    html += '<small class="text-muted">💡 Puedes verificar sustituyendo estos valores en las ecuaciones originales</small>';
    html += '</div>';
    
    document.getElementById('resultados').innerHTML = html;
}

// Mostrar los pasos del proceso
function mostrarPasos() {
    let html = '';
    
    pasos.forEach(paso => {
        html += '<div class="paso">';
        html += `<div class="titulo-paso">${paso.titulo}</div>`;
        html += `<div class="operacion">${paso.operacion}</div>`;
        html += '<div class="matriz-paso">';
        html += mostrarMatrizHTML(paso.matriz);
        html += '</div>';
        html += '</div>';
    });
    
    document.getElementById('pasos').innerHTML = html;
}

// Convertir matriz a HTML para mostrar
function mostrarMatrizHTML(matriz) {
    const n = matriz.length;
    let html = '<table class="mx-auto">';
    
    for (let i = 0; i < n; i++) {
        html += '<tr>';
        
        // Coeficientes
        for (let j = 0; j < n; j++) {
            html += `<td>${redondear(matriz[i][j])}</td>`;
        }
        
        // Separador
        html += '<td style="border: none; padding: 0 10px;">|</td>';
        
        // Término independiente
        html += `<td class="columna-resultado">${redondear(matriz[i][n])}</td>`;
        
        html += '</tr>';
    }
    
    html += '</table>';
    return html;
}

// Redondear números para mostrar mejor
function redondear(numero) {
    if (Math.abs(numero) < 0.000001) return 0;
    return Math.round(numero * 1000000) / 1000000;
}

// Mostrar errores
function mostrarError(mensaje) {
    const html = `<div class="error">❌ Error: ${mensaje}</div>`;
    document.getElementById('resultados').innerHTML = html;
    document.getElementById('pasos').innerHTML = '<div class="text-center text-muted"><p>No se pudo completar el proceso</p></div>';
}