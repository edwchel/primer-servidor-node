const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs')

const storageStrategy = multer.memoryStorage()
const upload  = multer({ storage: storageStrategy })

const app = express();
app.use(express.json());

app.get('/', function(req, res) {
    res.send('Hola Mundo Heroku!!');
})

app.post('/imagen', upload.single('imagen'), async function(req, res) {

    const body = req.body;
    const imagen = req.file;

    const processedImage = sharp(imagen.buffer);
    const resizedImage = processedImage.resize(800, 800, {
        fit: "contain",
        background: "#FFF"
    });
    const resizedImageBuffer = await resizedImage.toBuffer()

    fs.writeFileSync('nuevaruta/prueba.png', resizedImageBuffer)

    console.log(resizedImageBuffer);
    res.send({resizedImage: resizedImageBuffer});
})

const PORT = process.env.PORT || 6101

console.log({PORT});

app.listen(PORT, function() {
    console.log("Servidor Escuchando en el puerto", PORT)
});