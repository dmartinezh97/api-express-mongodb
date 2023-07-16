function limpiarEspacios(str) {
    return str.replace(/[^a-zA-Z-]/g, '');
}

function convertirTituloASlug(cadena) {
    // Reemplazar los espacios múltiples por un solo espacio
    cadena = cadena.replace(/\s+/g, ' ');
    // Reemplazar los espacios por guiones
    cadena = cadena.replace(/\s/g, '-');

    return cadena.toLowerCase();
}

function randomString() {
    const randomString = Math.random().toString(36).substring(2); // Genera una cadena aleatoria
    return randomString;
}

module.exports = {
    limpiarEspacios,
    convertirTituloASlug,
    randomString
}