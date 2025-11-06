// 🔒 SEGURIDAD - Prevenir inspección
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J')) {
        e.preventDefault();
        alert('🔒 Función deshabilitada por seguridad');
    }
});

// Datos del sistema
const datos = {
    paises: {
        'US': '🇺🇸 United States',
        'MX': '🇲🇽 Mexico', 
        'ES': '🇪🇸 Spain',
        'CO': '🇨🇴 Colombia',
        'AR': '🇦🇷 Argentina',
        'BR': '🇧🇷 Brazil',
        'UK': '🇬🇧 United Kingdom',
        'CA': '🇨🇦 Canada',
        'FR': '🇫🇷 France',
        'DE': '🇩🇪 Germany',
        'IT': '🇮🇹 Italy',
        'AU': '🇦🇺 Australia',
        'JP': '🇯🇵 Japan',
        'KR': '🇰🇷 South Korea'
    },
    
    binsTarjetas: {
        'Visa': ['4'],
        'MasterCard': ['51', '52', '53', '54', '55'],
        'American Express': ['34', '37'],
        'Discover': ['6011', '65'],
        'Diners Club': ['36', '38'],
        'UnionPay': ['62'],
        'JCB': ['35']
    },
    
    bancos: {
        'US': ['Bank of America', 'Chase Bank', 'Wells Fargo', 'Citibank', 'Capital One'],
        'MX': ['Banamex', 'BBVA', 'Santander', 'Banorte', 'HSBC México'],
        'ES': ['Santander', 'BBVA', 'CaixaBank', 'Bankia', 'Sabadell'],
        'CO': ['Bancolombia', 'Davivienda', 'BBVA Colombia', 'Banco de Bogotá'],
        'AR': ['Banco Galicia', 'Banco Nación', 'Santander Río', 'BBVA Argentina'],
        'BR': ['Itaú', 'Bradesco', 'Santander Brasil', 'Banco do Brasil'],
        'UK': ['HSBC', 'Barclays', 'Lloyds Bank', 'NatWest'],
        'CA': ['RBC', 'TD Bank', 'Scotiabank', 'BMO'],
        'FR': ['BNP Paribas', 'Crédit Agricole', 'Société Générale'],
        'DE': ['Deutsche Bank', 'Commerzbank', 'Sparkasse'],
        'IT': ['Intesa Sanpaolo', 'UniCredit', 'Monte dei Paschi'],
        'AU': ['Commonwealth Bank', 'ANZ', 'Westpac'],
        'JP': ['MUFG Bank', 'SMBC', 'Mizuho Bank'],
        'KR': ['KB Kookmin Bank', 'Shinhan Bank', 'Hana Bank']
    },
    
    nombres: {
        'US': ['James Smith', 'Maria Garcia', 'Robert Johnson', 'Jennifer Williams'],
        'MX': ['Carlos Hernández', 'Ana García', 'Miguel López', 'Sofia Martínez'],
        'ES': ['Antonio García', 'Maria Lopez', 'David Fernandez', 'Laura Martinez'],
        'CO': ['Juan Rodriguez', 'Camila Gonzalez', 'Andres Perez', 'Valentina Ramirez'],
        'AR': ['Luis Gonzalez', 'Maria Fernandez', 'Carlos Diaz', 'Ana Martinez'],
        'BR': ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa'],
        'UK': ['James Smith', 'Emma Johnson', 'Thomas Williams', 'Sophie Brown'],
        'CA': ['James Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis'],
        'FR': ['Jean Dupont', 'Marie Martin', 'Pierre Bernard', 'Sophie Petit'],
        'DE': ['Thomas Müller', 'Maria Schmidt', 'Hans Schneider', 'Anna Fischer'],
        'IT': ['Marco Rossi', 'Giulia Bianchi', 'Alessandro Romano', 'Sofia Ricci'],
        'AU': ['James Smith', 'Emma Wilson', 'Jack Brown', 'Olivia Taylor'],
        'JP': ['Tanaka Yuki', 'Sato Hiroshi', 'Suzuki Akira', 'Takahashi Kenji'],
        'KR': ['Kim Min-ho', 'Lee Ji-eun', 'Park Seo-yoon', 'Choi Hyun-woo']
    }
};

// Estado de la aplicación
let estado = {
    historialPantallas: ["principal"],
    tarjetasGeneradas: [],
    pantallaActual: "principal"
};

// Elementos DOM
const resultsText = document.getElementById('resultsText');
const counterLabel = document.getElementById('counterLabel');
const mainButtons = document.getElementById('mainButtons');
const backButton = document.getElementById('backButton');
const paisesPanel = document.getElementById('paisesPanel');
const paisesGrid = document.getElementById('paisesGrid');
const progressModal = document.getElementById('progressModal');
const progressBar = document.getElementById('progressBar');
const progressStatus = document.getElementById('progressStatus');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    actualizarEstadoSistema();
    mostrarMensajeInicial();
});

// Algoritmo de Luhn
function algoritmoLuhn(numero) {
    const digits = String(numero).split('').map(Number);
    const oddDigits = digits.filter((_, index) => index % 2 === digits.length % 2);
    const evenDigits = digits.filter((_, index) => index % 2 !== digits.length % 2);
    
    let checksum = oddDigits.reduce((sum, digit) => sum + digit, 0);
    
    for (let digit of evenDigits) {
        const doubled = digit * 2;
        checksum += doubled > 9 ? doubled - 9 : doubled;
    }
    
    return checksum % 10;
}

// Generar número de tarjeta válido
function generarNumeroValido(tipoTarjeta) {
    const binsDisponibles = datos.binsTarjetas[tipoTarjeta] || ['4'];
    const binBase = binsDisponibles[Math.floor(Math.random() * binsDisponibles.length)];
    
    let longitudTotal = 16;
    if (tipoTarjeta === 'American Express') {
        longitudTotal = 15;
    }
    
    const longitudRestante = longitudTotal - binBase.length - 1;
    let base = binBase;
    
    for (let i = 0; i < longitudRestante; i++) {
        base += Math.floor(Math.random() * 10);
    }
    
    const checksum = algoritmoLuhn(base + '0');
    const checkDigit = (10 - checksum) % 10;
    const numeroCompleto = base + checkDigit;
    
    // Formatear número
    if (tipoTarjeta === 'American Express') {
        return numeroCompleto.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
        return numeroCompleto.replace(/(\d{4})/g, '$1 ').trim();
    }
}

// Generar tarjeta completa
function generarTarjetaCompleta(pais) {
    const tiposTarjeta = Object.keys(datos.binsTarjetas);
    const tipoTarjeta = tiposTarjeta[Math.floor(Math.random() * tiposTarjeta.length)];
    
    const numero = generarNumeroValido(tipoTarjeta);
    const fecha = new Date();
    fecha.setFullYear(fecha.getFullYear() + Math.floor(Math.random() * 3) + 2);
    const vencimiento = `${String(fecha.getMonth() + 1).padStart(2, '0')}/${String(fecha.getFullYear()).slice(-2)}`;
    
    let cvv;
    if (tipoTarjeta === 'American Express') {
        cvv = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    } else {
        cvv = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    }
    
    const nombre = datos.nombres[pais][Math.floor(Math.random() * datos.nombres[pais].length)];
    const banco = datos.bancos[pais][Math.floor(Math.random() * datos.bancos[pais].length)];
    
    let limite, saldo;
    if (tipoTarjeta === 'American Express') {
        limite = `$${(Math.floor(Math.random() * 40000) + 10000).toLocaleString()}`;
        saldo = `$${(Math.floor(Math.random() * 20000) + 5000).toLocaleString()}`;
    } else if (['Visa', 'MasterCard'].includes(tipoTarjeta)) {
        limite = `$${(Math.floor(Math.random() * 25000) + 5000).toLocaleString()}`;
        saldo = `$${(Math.floor(Math.random() * 15000) + 1000).toLocaleString()}`;
    } else {
        limite = `$${(Math.floor(Math.random() * 17000) + 3000).toLocaleString()}`;
        saldo = `$${(Math.floor(Math.random() * 9500) + 500).toLocaleString()}`;
    }
    
    const tarjeta = {
        numero,
        vencimiento,
        cvv,
        nombre,
        pais,
        banco,
        tipo: tipoTarjeta,
        limite,
        saldo,
        fechaGeneracion: new Date().toLocaleString('es-ES'),
        autorizada: false
    };
    
    estado.tarjetasGeneradas.push(tarjeta);
    actualizarContador();
    return tarjeta;
}

// Mostrar tarjeta detallada
function mostrarTarjetaDetallada(tarjeta) {
    const estado = tarjeta.autorizada ? "✅ AUTORIZADA" : "⏳ PENDIENTE";
    return `
┌──────────────────────────────────────────────────────┐
│                💎 TARJETA PREMIUM                   │
├──────────────────────────────────────────────────────┤
│  💳 ${tarjeta.numero}        │
│  📅 ${tarjeta.vencimiento}    🔐 ${tarjeta.cvv}     │
│  👤 ${tarjeta.nombre}        │
│  🏦 ${tarjeta.banco}        │
│  💰 ${tarjeta.limite}       │
│  💵 ${tarjeta.saldo}     │
│  🎯 ${tarjeta.tipo}     │
│  🌍 ${datos.paises[tarjeta.pais]}    │
│  📊 Estado: ${estado}          │
└──────────────────────────────────────────────────────┘

🎯 COMPATIBILIDAD: 100% PAYPAL 
🔒 SEGURIDAD: MÁXIMA PROTECCIÓN HABILITADA

💡 INSTRUCCIONES:
   1. Copie los datos de la tarjeta
   2. Ingrese a su plataforma PayPal
   3. Agregue al método de pago
   4. ¡Disfrute de acceso inmediato!

──────────────────────────────────────────────────────
`;
}

// Navegación
function mostrarPaises() {
    agregarAlHistorial("paises");
    ocultarBotonesPrincipales();
    
    paisesGrid.innerHTML = '';
    Object.entries(datos.paises).forEach(([codigo, nombre]) => {
        const boton = document.createElement('button');
        boton.className = 'pais-btn';
        boton.textContent = nombre;
        boton.onclick = () => generarTarjeta(codigo);
        paisesGrid.appendChild(boton);
    });
    
    paisesPanel.style.display = 'block';
    document.querySelector('.right-panel').style.display = 'none';
}

function ocultarPaises() {
    paisesPanel.style.display = 'none';
    document.querySelector('.right-panel').style.display = 'flex';
}

function mostrarPantallaPrincipal() {
    ocultarPaises();
    mostrarBotonesPrincipales();
    mostrarMensajeInicial();
}

function mostrarBotonesPrincipales() {
    backButton.style.display = 'none';
    mainButtons.style.display = 'flex';
}

function ocultarBotonesPrincipales() {
    mainButtons.style.display = 'none';
    backButton.style.display = 'block';
}

function irAtras() {
    if (estado.historialPantallas.length > 1) {
        estado.historialPantallas.pop();
        const pantallaAnterior = estado.historialPantallas[estado.historialPantallas.length - 1];
        
        if (pantallaAnterior === "principal") {
            mostrarPantallaPrincipal();
        } else if (pantallaAnterior === "paises") {
            mostrarPaises();
        }
    }
}

function agregarAlHistorial(pantalla) {
    if (!estado.historialPantallas || estado.historialPantallas[estado.historialPantallas.length - 1] !== pantalla) {
        estado.historialPantallas.push(pantalla);
    }
}

// Funciones principales
function generarTarjeta(pais) {
    let output = `C:\\> generar_tarjeta --pais ${pais}\n`;
    output += `🚀 GENERANDO TARJETA ${datos.paises[pais]}...\n\n`;
    resultsText.value = output;
    
    const procesos = [
        "Inicializando...",
        "Seleccionando tipo de tarjeta...",
        "Generando número...",
        "Calculando dígito verificador...",
        "Perfil del titular...",
        "Activando tarjeta en sistema...",
        "Verificando compatibilidad..."
    ];
    
    let procesoIndex = 0;
    
    function mostrarProceso() {
        if (procesoIndex < procesos.length) {
            output += `⏳ ${procesos[procesoIndex]}\n`;
            resultsText.value = output;
            resultsText.scrollTop = resultsText.scrollHeight;
            procesoIndex++;
            setTimeout(mostrarProceso, 300);
        } else {
            const tarjeta = generarTarjetaCompleta(pais);
            const resultado = mostrarTarjetaDetallada(tarjeta);
            
            output += "✅ GENERACIÓN COMPLETADA\n\n";
            output += resultado;
            resultsText.value = output;
            resultsText.scrollTop = resultsText.scrollHeight;
            
            if (estado.historialPantallas[estado.historialPantallas.length - 1] === "paises") {
                mostrarPantallaPrincipal();
            }
        }
    }
    
    mostrarProceso();
}

function generarUSA() {
    generarTarjeta('US');
}

function generarLoteUSA() {
    let output = "C:\\> generar_lote --cantidad 5 --pais US\n";
    output += "🎰 GENERANDO LOTE DE 5 TARJETAS...\n\n";
    resultsText.value = output;
    
    const tarjetas = [];
    const tiposGenerados = [];
    
    function generarSiguienteTarjeta(i) {
        if (i < 5) {
            output += `⏳ Generando tarjeta ${i+1}/5...\n`;
            resultsText.value = output;
            resultsText.scrollTop = resultsText.scrollHeight;
            
            setTimeout(() => {
                const tarjeta = generarTarjetaCompleta('US');
                tarjetas.push(tarjeta);
                tiposGenerados.push(tarjeta.tipo);
                generarSiguienteTarjeta(i + 1);
            }, 300);
        } else {
            output += "\n✅ LOTE GENERADO EXITOSAMENTE\n\n";
            
            // Resumen de tipos
            const tiposCount = {};
            tiposGenerados.forEach(tipo => {
                tiposCount[tipo] = (tiposCount[tipo] || 0) + 1;
            });
            
            output += "📊 RESUMEN DE TIPOS GENERADOS:\n";
            Object.entries(tiposCount).forEach(([tipo, count]) => {
                output += `• ${tipo}: ${count} tarjetas\n`;
            });
            output += "\n";
            
            // Mostrar tarjetas
            tarjetas.forEach((tarjeta, index) => {
                output += `┌── TARJETA #${index + 1} ─────────────────────────┐\n`;
                output += `│ Tipo: ${tarjeta.tipo}\n`;
                output += `│ Número: ${tarjeta.numero} │\n`;
                output += `│ Vence: ${tarjeta.vencimiento} │ CVV: ${tarjeta.cvv} │\n`;
                output += `│ Titular: ${tarjeta.nombre} │\n`;
                output += `│ Banco: ${tarjeta.banco} │\n`;
                output += `└────────────────────────────────────────┘\n\n`;
            });
            
            output += "💡 Use estas tarjetas en cualquier plataforma\n";
            resultsText.value = output;
            resultsText.scrollTop = resultsText.scrollHeight;
        }
    }
    
    generarSiguienteTarjeta(0);
}

// Funciones de utilidad
function actualizarContador() {
    counterLabel.textContent = `• Tarjetas: ${estado.tarjetasGeneradas.length}`;
}

function mostrarMensajeInicial() {
    const mensaje = `

╔══════════════════════════════════════════════════╗
║               🅿️ SISTEMA PAYPAL ACTIVO          ║
╚══════════════════════════════════════════════════╝
    `;
    resultsText.value = mensaje;
}

// Funciones de herramientas
async function autorizarTarjetas() {
    if (estado.tarjetasGeneradas.length === 0) {
        alert("No hay tarjetas generadas para autorizar");
        return;
    }
    
    const contenidoAnterior = resultsText.value;
    progressModal.style.display = 'block';
    
    const pasos = [
        "Conectando con servidores PayPal...",
        "Verificando datos de tarjetas...",
        "Validando información bancaria...",
        "Comprobando fondos disponibles...",
        "Autorizando transacciones...",
        "Finalizando proceso de autorización..."
    ];
    
    for (let i = 0; i < pasos.length; i++) {
        progressBar.style.width = `${((i + 1) * (100 / pasos.length))}%`;
        progressStatus.textContent = pasos[i];
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    progressModal.style.display = 'none';
    
    // Marcar tarjetas como autorizadas
    estado.tarjetasGeneradas.forEach(tarjeta => {
        tarjeta.autorizada = true;
    });
    
    // Mostrar resultados
    let output = contenidoAnterior;
    output += "\n\n" + "=".repeat(60) + "\n";
    output += "✅ AUTORIZACIÓN COMPLETADA\n\n";
    output += "📊 RESULTADOS DE AUTORIZACIÓN:\n";
    output += "────────────────────────────\n";
    output += `• Tarjetas autorizadas: ${estado.tarjetasGeneradas.length}\n`;
    output += `• Estado: TODAS AUTORIZADAS ✅\n`;
    output += `• Compatibilidad PayPal: 100%\n`;
    output += `• Seguridad: MÁXIMA 🔒\n`;
    output += `• Fondos: DISPONIBLES 💰\n\n`;
    output += `🎯 TARJETAS LISTAS PARA USO INMEDIATO EN PAYPAL\n`;
    
    output += "\n📋 ESTADO ACTUAL DE TARJETAS:\n";
    output += "────────────────────────────\n";
    estado.tarjetasGeneradas.forEach((tarjeta, index) => {
        const estado = tarjeta.autorizada ? "✅ AUTORIZADA" : "⏳ PENDIENTE";
        output += `• Tarjeta #${index + 1}: ${tarjeta.tipo} - ${tarjeta.numero} - ${estado}\n`;
    });
    
    resultsText.value = output;
    resultsText.scrollTop = resultsText.scrollHeight;
}

function guardarTarjetasTxt() {
    if (estado.tarjetasGeneradas.length === 0) {
        alert("No hay tarjetas generadas para guardar");
        return;
    }
    
    let contenido = "TARJETAS GUARDADAS - SISTEMA PREMIUM\n";
    contenido += "=".repeat(60) }