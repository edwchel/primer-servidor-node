const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs')
const PdfPrinter = require('pdfmake')
// const bodyParser = require('body-parser');
// const path = require('path');

const storageStrategy = multer.memoryStorage()
const upload  = multer({ storage: storageStrategy })

const app = express();
app.use(express.json());

const pdfRoute = require('./routes/pdfmake');
app.use(pdfRoute);

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({extended:true}));

// ------------- Ejemplo PDF 1 -------------------
const fonts = require('./fonts');
const styles = require('./styles');
const {content} = require('./pdfContent');

let docDefinition = {
	content: content,
	styles: styles
}

const printer = new PdfPrinter(fonts);

let pdfDoc = printer.createPdfKitDocument(docDefinition);
// pdfDoc.pipe(fs.createWriteStream("pdfs/pdfTest.pdf"));
// pdfDoc.end();

// ----------- POST Usuarios ------------------------
const users = [
    { name: 'Alejandro', edad: 26},
    { name: 'Alex', edad: 28}
];

app.get('/usuarios', (req, res) => {
    res.status(200).send(users)
});

app.post('/usuarios' , (req , res)=>{
    const usuario = req.body;
    users.push(usuario);
    res.status(201).send(usuario)
   console.log(usuario)
})

// ------------- Ejemplo PDF 1 Final -------------------

//  ---------- POST USUARIO FINAL

app.get('/', function(req, res) {
    res.send('Hola Mundo Herokuu!!!');
})

app.post('/imagen', upload.single('imagen'), async function(req, res) {

    const body = req.body;
    const imagen = req.file;

    console.log(req.file)

    const processedImage = sharp(imagen.buffer);
    const resizedImage = processedImage.resize(800, 800, {
        fit: "contain",
        background: "#FFF"
    });
    
    let resizedImageBuffer
    try {
        resizedImageBuffer = await resizedImage.toBuffer()
    } catch (error) {
        console.log({error})
    }

    fs.writeFileSync('nuevaruta/prueba.png', resizedImageBuffer)

    console.log(resizedImageBuffer);

    res.send({
        '$content-type': 'image/png', 
        '$content': resizedImageBuffer.toString('base64')
    })
    // res.send({resizedImage: resizedImageBuffer});
})

const PORT = process.env.PORT || 7101

console.log({PORT});

app.listen(PORT, function() {
console.log("Servidor Escuchando en el puerto", PORT)

});