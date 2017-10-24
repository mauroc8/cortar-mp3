
function detectar_pistas(texto) {
	var líneas = texto.trim().split("\n").map(a => a.trim()).filter(a => a !== "");;
	var duración = / ?[^ \n\d]*((\d?\d\:)?\d?\d\:\d\d)[^ \n\d]* ?/;
	
	return líneas.map(function(línea) {
		
		var match = línea.match(duración);
		
		if(match) {
			return {
				nombre: línea.replace(duración, "").replace(/\//g, "-"),
				inicio: match[1]
			};
		} else {
			return {
				nombre: línea,
				excepción: "No se pudo encontrar tiempo de inicio"
			};
		}
	});
}


function crear_comando(pistas, nombre_archivo) {
	pistas = pistas.filter(pista => Boolean(pista.inicio));
	return pistas.map(function(pista, i) {
		return "ffmpeg -i \"" + escapar_quots(nombre_archivo) + "\" -vn " +
			   "-acodec copy -ss " + pista.inicio +
			   (pistas[i+1] ? " -to " + pistas[i+1].inicio : "") +
			   " \"" + escapar_quots(pista.nombre).replace(/\//g, "-") + ".mp3\""
	}).join(" && ");
}

function escapar_quots(texto) {
	return texto.replace(/\"/g, "\\\"");
}