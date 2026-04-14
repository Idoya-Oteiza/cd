document.addEventListener('DOMContentLoaded', () => {

    const sectionJugadores = document.querySelector('#jugadores');
    if (sectionJugadores) {
        const searchContainer = document.createElement('div');
        searchContainer.style = 'padding: 0 20px 30px 20px; max-width: 1300px; margin: 0 auto;';
        searchContainer.innerHTML = `
            <input type="text" id="buscadorJugadores" 
            placeholder="🔍 Buscar por nombre, posición o año..." 
            style="width: 100%; padding: 15px; border-radius: 12px; background: #111; border: 1px solid #0055ff; color: white; outline: none;">
        `;
        const gridJugadores = sectionJugadores.querySelector('.players-dark-grid');
        gridJugadores.parentNode.insertBefore(searchContainer, gridJugadores);

        document.getElementById('buscadorJugadores').addEventListener('keyup', (e) => {
            const filtro = e.target.value.toLowerCase();
            const tarjetas = document.querySelectorAll('.player-box:not(.coach-box)');
            tarjetas.forEach(t => {
                t.style.display = t.innerText.toLowerCase().includes(filtro) ? 'flex' : 'none';
            });
        });
    }

    const colorearResultados = () => {
        const filas = document.querySelectorAll('#resultados tbody tr');
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            if (celdas.length < 3) return;
            const rivalCelda = celdas[1].innerText;
            const marcador = celdas[2].innerText;
            if (marcador.includes('-') && !marcador.includes('Pendiente')) {
                const partes = marcador.split('-');
                const gol1 = parseInt(partes[0].trim());
                const gol2 = parseInt(partes[1].trim());
                const idoyaEsVisitante = rivalCelda.includes('(V)');
                let victoria = false;
                let empate = (gol1 === gol2);
                if (idoyaEsVisitante) { if (gol2 > gol1) victoria = true; } 
                else { if (gol1 > gol2) victoria = true; }
                if (empate) { celdas[2].style.color = '#ffffff'; } 
                else if (victoria) { celdas[2].style.color = '#00ff88'; celdas[2].style.fontWeight = 'bold'; } 
                else { celdas[2].style.color = '#ff4444'; }
            }
        });
    };
    colorearResultados();

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

    const shortcutMenu = document.querySelector('.shortcut-menu');
    if (shortcutMenu) {
        const btnPizarra = document.createElement('button');
        btnPizarra.className = 'action-card';
        btnPizarra.style.borderColor = 'gold';
        btnPizarra.innerHTML = `
            <div class="icon">📋</div>
            <span class="card-label">PIZARRA</span>
            <small>Diseña tu táctica</small>
        `;
        shortcutMenu.appendChild(btnPizarra);
        btnPizarra.onclick = abrirPizarra;
    }

    function abrirPizarra() {
        const overlay = document.createElement('div');
        overlay.style = 'position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(5,5,5,0.98); z-index:10001; overflow-y:auto; padding: 10px; font-family: sans-serif;';
        
        const nombres = Array.from(document.querySelectorAll('.player-box:not(.coach-box) strong'))
                             .map(n => n.innerText.replace(/\(C\)/g, '').trim());

        overlay.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; max-width:800px; margin: 0 auto 15px;">
                <h3 style="color:white; margin:0; font-size: 1.2rem;">PIZARRA CD IDOYA</h3>
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
                        <span style="position:absolute; top:-10px; left:10px; background:#050505; color:#555; font-size:10px; padding:0 5px;">BANQUILLO (5-6 SUPLENTES)</span>
                    </div>
                </div>

                <div style="background:#111; width:220px; padding:12px; border-radius:10px; border:1px solid #333; height:640px; display:flex; flex-direction:column;">
                    <input type="text" id="pizarraSearch" placeholder="🔍 Buscar..." 
                    style="width:100%; padding:8px; margin-bottom:10px; border-radius:5px; background:#222; border:1px solid #444; color:white; font-size:11px;">
                    
                    <div id="lista-pizarra" style="flex-grow:1; overflow-y:auto; display:flex; flex-direction:column; gap:5px;">
                        ${nombres.map(n => `<div class="p-item" draggable="true" style="background:#1a1a1a; color:white; padding:6px 8px; border-radius:4px; cursor:grab; font-size:10px; border-left:2px solid #0055ff;">${n}</div>`).join('')}
                    </div>
                </div>

            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Lógica del buscador interno
        document.getElementById('pizarraSearch').addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            document.querySelectorAll('.p-item').forEach(item => {
                item.style.display = item.innerText.toLowerCase().includes(val) ? 'block' : 'none';
            });
        });

        document.getElementById('cerrarPizarra').onclick = () => {
            overlay.remove();
            document.body.style.overflow = 'auto';
        };

        const campo = document.getElementById('campo');
        const banquillo = document.getElementById('banquillo');
        let itemSeleccionado = null;

        document.addEventListener('dragstart', (e) => {
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
                    ficha.style = `position:absolute; background:#0055ff; color:white; padding:4px 8px; border-radius:3px; font-size:9px; font-weight:bold; cursor:move; border:1px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.4); white-space:nowrap; z-index:10;`;
                    ficha.style.left = (x - 35) + "px";
                    ficha.style.top = (y - 12) + "px";
                    ficha.ondblclick = () => ficha.remove();
                    zona.appendChild(ficha);
                }
                itemSeleccionado = null;
            };
        });
    }
});

function mostrarSeccion(id) {
    const secciones = document.querySelectorAll('.view-section');
    secciones.forEach(s => s.classList.add('hidden'));
    const destino = document.getElementById(id);
    if (destino) {
        destino.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}