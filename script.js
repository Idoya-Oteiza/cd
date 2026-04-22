const fechasPartidos = {
    'primer': { fecha: "April 26, 2026 18:30:00", info: "Cabanillas vs Idoya | Sábado 18:30h | San Roque" },
    'segundo': { fecha: "April 25, 2026 17:00:00", info: "Izarra vs Idoya | Sábado 17:00h | Merkatondoa" },
    'juvenil': { fecha: "April 26, 2026 12:00:00", info: "Idoya vs Iruña | Domingo 12:00h | Iturtxipia" },
    'cadete': { fecha: "April 25, 2026 16:00:00", info: "Idoya vs Asdefor | Sabado 16:00h | Iturtxipia" }
};

let countdownInterval; 

function cambiarCategoria(categoria) {
    const fotosCabecera = {
        'primer': 'https://i.postimg.cc/P5MsyMCN/Screenshot-2026-04-16-21-42-48.png',
        'segundo': 'https://i.postimg.cc/8CnYXXNB/Screenshot-2026-04-16-21-42-29.png',
        'juvenil': 'https://i.postimg.cc/8cLn51WL/Screenshot-2026-04-16-21-43-31.png',
        'cadete': 'https://i.postimg.cc/284PjxFJ/Screenshot-2026-04-16-21-42-40.png'
    };

    const equipos = document.querySelectorAll('.team-container');
    equipos.forEach(eq => eq.classList.add('hidden'));

    const equipoActivo = document.getElementById('cat-' + categoria);
    if (equipoActivo) {
        equipoActivo.classList.remove('hidden');
        
        // Aplicar fotos al fondo
        if (fotosCabecera[categoria]) {
            document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${fotosCabecera[categoria]}')`;
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        }
        
        mostrarSeccion('inicio');
        iniciarCronometro(categoria);
    }
}

function mostrarSeccion(seccionId) {
    const equipoActivo = document.querySelector('.team-container:not(.hidden)');
    if (!equipoActivo) return;

    const secciones = equipoActivo.querySelectorAll('.view-section');
    secciones.forEach(sec => sec.classList.add('hidden'));

    const destino = equipoActivo.querySelector('#' + seccionId);
    if (destino) {
        destino.classList.remove('hidden');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function iniciarCronometro(cat) {
    if (countdownInterval) clearInterval(countdownInterval);

    const config = fechasPartidos[cat];
    const container = document.getElementById('cat-' + cat);
    
    if (!container || !config) return;

    const infoTxt = container.querySelector('.reloj-info');
    const dSpan = container.querySelector('.days');
    const hSpan = container.querySelector('.hours');
    const mSpan = container.querySelector('.minutes');
    const sSpan = container.querySelector('.seconds');

    if (infoTxt) infoTxt.innerText = config.info;

    const target = new Date(config.fecha).getTime();

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = target - now;

        if (diff < 0) {
            clearInterval(countdownInterval);
            if (container.querySelector('.reloj-display')) {
                container.querySelector('.reloj-display').innerHTML = "<h3 style='color:#00ff88'>¡PARTIDO EN JUEGO! ⚽</h3>";
            }
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        if (dSpan) dSpan.innerText = d.toString().padStart(2, '0');
        if (hSpan) hSpan.innerText = h.toString().padStart(2, '0');
        if (mSpan) mSpan.innerText = m.toString().padStart(2, '0');
        if (sSpan) sSpan.innerText = s.toString().padStart(2, '0');
    }, 1000);
}


document.addEventListener('DOMContentLoaded', () => {

    cambiarCategoria('primer');

    const todasLasSeccionesJugadores = document.querySelectorAll('.view-section[id="jugadores"]');
    todasLasSeccionesJugadores.forEach((seccion, index) => {
        const searchContainer = document.createElement('div');
        searchContainer.style = 'padding: 0 20px 30px 20px; max-width: 1300px; margin: 0 auto;';
        const inputId = `buscadorJugadores_${index}`;
        
        searchContainer.innerHTML = `
            <input type="text" id="${inputId}" class="input-buscador-dinamico" 
            placeholder="🔍 Buscar en este equipo..." 
            style="width: 100%; padding: 15px; border-radius: 12px; background: #111; border: 1px solid #0055ff; color: white; outline: none;">
        `;
        
        const grid = seccion.querySelector('.players-dark-grid');
        if (grid) {
            grid.parentNode.insertBefore(searchContainer, grid);
            document.getElementById(inputId).addEventListener('keyup', (e) => {
                const filtro = e.target.value.toLowerCase();
                const tarjetas = seccion.querySelectorAll('.player-box:not(.coach-box)');
                tarjetas.forEach(t => {
                    t.style.display = t.innerText.toLowerCase().includes(filtro) ? 'flex' : 'none';
                });
            });
        }
    });

    const colorearTodosLosResultados = () => {
        const todasLasFilas = document.querySelectorAll('.view-section[id="resultados"] tbody tr');
        todasLasFilas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            if (celdas.length < 3) return;
            const rivalCelda = celdas[1].innerText;
            const marcador = celdas[2].innerText;
            
            if (marcador.includes('-') && !marcador.includes('Pendiente')) {
                const partes = marcador.split('-');
                const gol1 = parseInt(partes[0].trim());
                const gol2 = parseInt(partes[1].trim());
                const idoyaEsVisitante = rivalCelda.includes('(V)');
                
                let victoria = idoyaEsVisitante ? (gol2 > gol1) : (gol1 > gol2);
                let empate = (gol1 === gol2);

                if (empate) { celdas[2].style.color = '#ffffff'; } 
                else if (victoria) { 
                    celdas[2].style.color = '#00ff88'; 
                    celdas[2].style.fontWeight = 'bold'; 
                } 
                else { celdas[2].style.color = '#ff4444'; }
            }
        });
    };
    colorearTodosLosResultados();

    const btnEfecto = document.createElement('button');
    btnEfecto.innerHTML = '🏟️';
    btnEfecto.style = 'position: fixed; bottom: 20px; left: 20px; z-index: 9999; padding: 15px; border-radius: 50%; border: none; background: #cc0000; cursor: pointer; font-size: 1.5rem; transition: 0.3s;';
    document.body.appendChild(btnEfecto);

    let efectoActivo = false;
    btnEfecto.onclick = () => {
        efectoActivo = !efectoActivo;
        document.body.style.textShadow = efectoActivo ? '0 0 8px #0055ff' : 'none';
        btnEfecto.style.background = efectoActivo ? '#0055ff' : '#cc0000';
    };

    // Botones de Pizarra en Menús
    const menus = document.querySelectorAll('.shortcut-menu');
    menus.forEach(menu => {
        const btnPizarra = document.createElement('button');
        btnPizarra.className = 'action-card';
        btnPizarra.style.borderColor = 'gold';
        btnPizarra.innerHTML = `
            <div class="icon">📋</div>
            <span class="card-label">PIZARRA</span>
            <small>Diseña tu táctica</small>
        `;
        menu.appendChild(btnPizarra);
        btnPizarra.onclick = () => abrirPizarra(menu.closest('.team-container'));
    });
});

function abrirPizarra(equipoPadre) {
    const overlay = document.createElement('div');
    overlay.style = 'position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(5,5,5,0.98); z-index:10001; overflow-y:auto; padding: 10px; font-family: sans-serif;';
    
    const nombres = Array.from(equipoPadre.querySelectorAll('.player-box:not(.coach-box) strong'))
                            .map(n => n.innerText.replace(/\(C\)/g, '').trim());

    overlay.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; max-width:800px; margin: 0 auto 15px;">
            <h3 style="color:white; margin:0; font-size: 1.2rem;">PIZARRA: ${equipoPadre.id.replace('cat-', '').toUpperCase()}</h3>
            <button id="cerrarPizarra" style="background:#cc0000; color:white; border:none; padding:8px 20px; border-radius:5px; cursor:pointer; font-weight:bold;">SALIR</button>
        </div>
        <div style="display:flex; justify-content:center; align-items:flex-start; gap:20px; max-width:1000px; margin: 0 auto;">
            <div style="display:flex; flex-direction:column; gap:10px;">
                <div id="campo" style="background:#2d5a27; width:400px; height:550px; border:3px solid white; border-radius:5px; position:relative; box-shadow: 0 0 30px rgba(0,0,0,0.5); overflow:hidden;">
                    <div style="position:absolute; top:50%; left:0; width:100%; height:2px; background:white;"></div>
                    <div style="position:absolute; top:50%; left:50%; width:80px; height:80px; border:2px solid white; border-radius:50%; transform:translate(-50%, -50%);"></div>
                    <div style="position:absolute; top:0; left:20%; width:60%; height:80px; border:2px solid white; border-top:none;"></div>
                    <div style="position:absolute; bottom:0; left:20%; width:60%; height:80px; border:2px solid white; border-bottom:none;"></div>
                </div>
                <div id="banquillo" style="background:#1a1a1a; width:400px; height:80px; border:2px dashed #444; border-radius:5px; position:relative; display:flex; align-items:center; justify-content:center; gap:5px; padding:5px;">
                    <span style="position:absolute; top:-10px; left:10px; background:#050505; color:#555; font-size:10px; padding:0 5px;">BANQUILLO</span>
                </div>
            </div>
            <div style="background:#111; width:220px; padding:12px; border-radius:10px; border:1px solid #333; height:640px; display:flex; flex-direction:column;">
                <input type="text" id="pizarraSearch" placeholder="🔍 Buscar..." style="width:100%; padding:8px; margin-bottom:10px; border-radius:5px; background:#222; border:1px solid #444; color:white; font-size:11px;">
                <div id="lista-pizarra" style="flex-grow:1; overflow-y:auto; display:flex; flex-direction:column; gap:5px;">
                    ${nombres.map(n => `<div class="p-item" draggable="true" style="background:#1a1a1a; color:white; padding:6px 8px; border-radius:4px; cursor:grab; font-size:10px; border-left:2px solid #0055ff;">${n}</div>`).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const searchInput = overlay.querySelector('#pizarraSearch');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        overlay.querySelectorAll('.p-item').forEach(item => {
            item.style.display = item.innerText.toLowerCase().includes(term) ? 'block' : 'none';
        });
    });

    document.getElementById('cerrarPizarra').onclick = () => {
        overlay.remove();
        document.body.style.overflow = 'auto';
    };

    const campo = overlay.querySelector('#campo');
    const banquillo = overlay.querySelector('#banquillo');
    let itemSeleccionado = null;

    overlay.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('p-item') || e.target.classList.contains('ficha-jugador')) {
            itemSeleccionado = e.target;
            e.dataTransfer.setData("text", e.target.innerText);
        }
    });

    [campo, banquillo].forEach(zona => {
        zona.ondragover = (e) => e.preventDefault();
        zona.ondrop = (e) => {
            e.preventDefault();
            const rect = zona.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (itemSeleccionado && itemSeleccionado.classList.contains('ficha-jugador')) {
                zona.appendChild(itemSeleccionado);
                itemSeleccionado.style.left = (x - 35) + "px";
                itemSeleccionado.style.top = (y - 12) + "px";
            } else if (itemSeleccionado && itemSeleccionado.classList.contains('p-item')) {
                const ficha = document.createElement('div');
                ficha.className = 'ficha-jugador';
                ficha.innerText = e.dataTransfer.getData("text");
                ficha.draggable = true;
                ficha.style = `position:absolute; background:#0055ff; color:white; padding:4px 8px; border-radius:3px; font-size:9px; font-weight:bold; cursor:move; border:1px solid white; z-index:10; white-space:nowrap;`;
                ficha.style.left = (x - 35) + "px";
                ficha.style.top = (y - 12) + "px";
                ficha.ondblclick = () => ficha.remove();
                zona.appendChild(ficha);
            }
            itemSeleccionado = null;
        };
    });
}

function abrirFicha(nombre, posicion, partidos, titular, amarillas, rojas, goles, equipo) {
    if (document.querySelector('.modal-jugador')) return;

    const modal = document.createElement('div');
    modal.className = 'modal-jugador';
    
    modal.innerHTML = `
        <div class="ficha-detalle">
            <h3 style="margin: 0 0 5px 0; color: #0055ff; font-size: 1.5rem;">${nombre}</h3>
            <div style="font-size: 0.9rem; color: #666; margin-bottom: 15px; text-transform: uppercase;">${posicion} (${equipo})</div>
            
            <div class="stats-grid-detalle">
                <div class="stat-item">
                    <span>${partidos}</span>
                    <label>Partidos</label>
                </div>
                <div class="stat-item">
                    <span>${titular}</span>
                    <label>Titular</label>
                </div>
                <div class="stat-item">
                    <span style="color: #ffd700;">${amarillas}</span>
                    <label>Amarillas</label>
                </div>
                <div class="stat-item">
                    <span style="color: #ff4444;">${rojas}</span>
                    <label>Rojas</label>
                </div>
                <div class="stat-item item-goles" style="grid-column: span 2; border-color: #0055ff;">
                    <span style="color: #0055ff;">${goles}</span>
                    <label>${posicion.toLowerCase().includes('portero') ? 'Goles Encajados' : 'Goles'}</label>
                </div>
            </div>
            
            <button onclick="this.closest('.modal-jugador').remove()" 
                    style="margin-top: 20px; background: none; border: 1px solid #444; color: #888; padding: 8px 20px; border-radius: 5px; cursor: pointer; font-size: 0.9rem; width: 100%;">
                Cerrar
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}
