
function $(a, b) {
	return b ? a.querySelector(b) : document.querySelector(a);
}

function $$(a, b) {
	return Array.prototype.slice.call(
		b ? a.querySelectorAll(b) : document.querySelectorAll(a)
	);
}

function event(a, b, c) {
	if(a instanceof Array) {
		a.forEach(function(e) { e.addEventListener(b, c); });
	} else {
		a.addEventListener(b, c);
	}
}

function elt(str) {
	var div = document.createElement('div');
	div.innerHTML = str;
	return div.firstChild;
}

/*----------  Paso 1  ----------*/

event($("#insertar-texto"), "submit", function(event) {
	event.preventDefault();
	
	crear_lista(detectar_pistas($(this, "textarea").value));
	
	this.classList.toggle("oculto");
	$("#arreglar-datos").classList.toggle("oculto");
});

/*----------  Paso 2  ----------*/

function crear_lista(pistas) {
	
	var ul = $("#arreglar-datos ul");
	
	while(ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}
	
	pistas.forEach(function(pista) {
		var li = elt("<li></li>");
		if(pista.inicio) {
			li.appendChild(elt('<input class="inicio-pista" type="text" value="' +
			                   pista.inicio + '">'));
			li.appendChild(elt('<input class="nombre-pista" type="text" value="' +
			                   escapar_html(pista.nombre) + '">'));
		} else {
			li.appendChild(elt('<p><b class="error">Error.</b> ' + pista.excepción +
			                   ' en <i>' + escapar_html(pista.nombre) + '</i></p>'));
		}
		ul.appendChild(li);
	});
	
}

function escapar_html(texto) {
	return texto.replace(/\&/g, "&amp;")
			    .replace(/\</g, "&lt;")
			    .replace(/\>/g, "&gt;")
			    .replace(/\'/g, "&apos;")
			    .replace(/\"/g, "&quot;");
}

event($("#arreglar-datos button"), "click", function(event) {
	event.preventDefault();
	$("#arreglar-datos").classList.toggle("oculto");
	$("#insertar-texto").classList.toggle("oculto");
});

event($("#arreglar-datos"), "submit", function(event) {
	event.preventDefault();
	
	$("#resultado textarea").value = crear_comando(obtener_pistas($$("#arreglar-datos li")),
	                                               $("#nombre-archivo").value);
	
	if($("#borrar-original").checked) {
		$("#resultado textarea").value += " && rm \"" + escapar_quots($("#nombre-archivo").value) + "\"";
	}
	
	$("#arreglar-datos").classList.toggle("oculto");
	$("#resultado").classList.toggle("oculto");
});

/*----------  Paso 3  ----------*/

function obtener_pistas(lista) {
	
	var numerar = $("#numerar").checked;
	
	return lista.filter(li => Boolean($(li, "input")))
				.map(function(li, i) {
					var inputs = $$(li, "input");
					return {
						inicio: inputs[0].value,
						nombre: (numerar ? zero_pad(i+1) + " - " : "") + inputs[1].value
					};
				});
}

function zero_pad(n) {
	var txt = String(n);
	return txt.length === 1 ? "0" + txt : txt;
}

event($("#resultado button"), "click", function(event) {
	event.preventDefault();
	$("#resultado").classList.toggle("oculto");
	$("#arreglar-datos").classList.toggle("oculto");
});

event($("#resultado"), "submit", function(event) {
	event.preventDefault();
	
	$("#insertar-texto textarea").value = "";
	$("#nombre-archivo").value = "";
	
	$("#resultado").classList.toggle("oculto");
	$("#insertar-texto").classList.toggle("oculto");
});
