// Función para evaluar expresiones matemáticas
function evaluarFuncion(expresion, x) {
    // Reemplazar x con el valor y ^ con **
    let expr = expresion.replace(/x/g, x).replace(/\^/g, '**');
    // Evaluar de forma segura
    try {
        return Function('"use strict"; return (' + expr + ')')();
    } catch (e) {
        throw new Error('Error en la función');
    }
}

// Método de Newton-Raphson CORREGIDO
function newtonRaphson(f, df, x0, tolerancia, maxIter) {
    let iteraciones = [];
    let x = x0;
    let errorFinal = 0;
    
    for (let i = 0; i < maxIter; i++) {
        let fx = evaluarFuncion(f, x);
        let dfx = evaluarFuncion(df, x);
        
        // Verificar que la derivada no sea cero
        if (Math.abs(dfx) < 1e-10) {
            throw new Error('La derivada es cero. Cambiar valor inicial.');
        }
        
        let xNuevo = x - (fx / dfx);
        let error = Math.abs(xNuevo - x);
        
        // Guardar datos de la iteración
        iteraciones.push({
            n: i,
            x: x,
            fx: fx,
            dfx: dfx,
            xNuevo: xNuevo,
            error: error
        });
        
        // Actualizar el error final
        errorFinal = error;
        
        // Verificar convergencia
        if (error < tolerancia) {
            return {
                raiz: xNuevo,
                iteraciones: iteraciones,
                convergio: true,
                errorFinal: errorFinal
            };
        }
        
        x = xNuevo;
    }
    
    return {
        raiz: x,
        iteraciones: iteraciones,
        convergio: false,
        errorFinal: errorFinal
    };
}

// Manejar el envío del formulario CORREGIDO
document.getElementById('newtonForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Ocultar resultados anteriores
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('tabla').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    
    try {
        // Obtener valores del formulario
        let funcion = document.getElementById('funcion').value;
        let derivada = document.getElementById('derivada').value;
        let x0 = parseFloat(document.getElementById('x0').value);
        let tolerancia = parseFloat(document.getElementById('tolerancia').value);
        let maxIter = parseInt(document.getElementById('maxIter').value);
        
        // Ejecutar método de Newton-Raphson
        let resultado = newtonRaphson(funcion, derivada, x0, tolerancia, maxIter);
        
        document.getElementById('raiz').textContent = resultado.raiz.toFixed(6);
        document.getElementById('iteraciones').textContent = resultado.iteraciones.length;
        
        document.getElementById('error').textContent = resultado.errorFinal.toFixed(8);
        
        if (!resultado.convergio) {
            document.getElementById('resultado').innerHTML += 
                '<div class="alert alert-warning mt-2">No convergió en el máximo de iteraciones</div>';
        }
        
        // Crear tabla de iteraciones
        let tablaBody = document.getElementById('tablaBody');
        tablaBody.innerHTML = '';
        
        resultado.iteraciones.forEach(function(iter) {
            let fila = `
                <tr>
                    <td>${iter.n}</td>
                    <td>${iter.x.toFixed(6)}</td>
                    <td>${iter.fx.toFixed(6)}</td>
                    <td>${iter.dfx.toFixed(6)}</td>
                    <td>${iter.xNuevo.toFixed(6)}</td>
                    <td>${iter.error.toFixed(8)}</td>
                </tr>
            `;
            tablaBody.innerHTML += fila;
        });
        
        // Mostrar resultados
        document.getElementById('resultado').style.display = 'block';
        document.getElementById('tabla').style.display = 'block';
        
    } catch (error) {
        document.getElementById('errorMsg').textContent = error.message;
        document.getElementById('error').style.display = 'block';
    }
});
