// Script para extraer y chunkear PDFs en astrology_books
// Requisitos: npm install pdf-parse
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const PDF_FOLDER = path.join(__dirname, '../astrology_books');
const OUTPUT_FILE = path.join(__dirname, '../astrology_books/chunks.json');
const CHUNK_SIZE = 250; // palabras por chunk

function splitIntoChunks(text, chunkSize) {
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        if (chunk.trim().length > 0) {
            chunks.push(chunk);
        }
    }
    return chunks;
}

async function processPDF(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text.replace(/\n{2,}/g, '\n');
    return splitIntoChunks(text, CHUNK_SIZE);
}

async function main() {
    const files = fs.readdirSync(PDF_FOLDER)
        .filter(f => f.toLowerCase().endsWith('.pdf'));
    const allChunks = [];
    for (const filename of files) {
        const fullPath = path.join(PDF_FOLDER, filename);
        console.log(`Procesando: ${filename}`);
        try {
            const chunks = await processPDF(fullPath);
            chunks.forEach((chunk, idx) => {
                allChunks.push({
                    book: filename.replace('.pdf', ''),
                    chunk_index: idx,
                    text: chunk
                });
            });
            console.log(`  Extraídos ${chunks.length} fragmentos.`);
        } catch (err) {
            console.error(`  Error con ${filename}:`, err.message);
        }
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allChunks, null, 2), 'utf-8');
    console.log(`\nListo: ${allChunks.length} fragments guardados en ${OUTPUT_FILE}`);
}

main();
