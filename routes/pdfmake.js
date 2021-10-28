const express = require('express');
// const { pdfMake } = require('pdfmake/build/vfs_fonts');
const router = express.Router();
const PdfPrinter = require('pdfmake');
const fs = require('fs');
// const path = require('path');
// const vfsFonts = require('vfs_fonts')

const fonts = {
	Roboto: {
		normal: Buffer.from(
		require("pdfmake/build/vfs_fonts.js").pdfMake.vfs["Roboto-Regular.ttf"],
		"base64"
		),
		bold: Buffer.from(
		require("pdfmake/build/vfs_fonts.js").pdfMake.vfs["Roboto-Medium.ttf"],
		"base64"
		),
	},
};

const printer = new PdfPrinter(fonts);    
    
class pdfDatos {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
    }   
}

let pdfDatos1 = new pdfDatos();

let reporteValvula = {
    "Orden_De_Trabajo": "",
    "Tipo_Reporte": "",
    "Folio_Reporte": "",
    "Cliente": "",
    "Fecha_Reporte": "",
    "Valvula": {
        "Valvula": "",
        "Tag_Valvula": "",
        "Tipo_Valvula": "",
        "Direccion": "",
        "Ubicacion": "",        
        "Tipo_Direccion": ""  
    },
    "Grafico": "",
    "cValor1": 1,
    "cValor2": 2,
    "Unidad": "",
    "Equipo_Patron": [
        {
            "Equipo_Patron": "",
            "Marca": "",
            "Modelo": "",
            "Apreciacion": "",
            "Rango": "",
            "Numero_Serie": "",
            "Certificado": "",
            "Fecha_Vencimiento": ""
        }
    ],
    "Usuario_Instrumentista": {
        "Usuario": "",
        "Puesto": "",
        "Cuadrilla": "",
        "Correo": "",
        "FirmaBase64": ""
        
    },
    "Usuario_Supervisor": {
        "Usuario": "",
        "Puesto": ""
    },
    "Evidencia": [
        {
            "Orden": 1,
            "Tipo_Imagen": 1,
            "imgBase64": ""
        }
    ],
    "ID_Captura_Reporte": ""
}

router.post('/pdf', async function (req, res) {
    // pdfDatos1 = req.body;
    //reporteValvula = req.body;
    reporteValvula = req.body
    // res.send(reporteValvula);

    console.log('Reporte Valvula', reporteValvula.Usuario_Instrumentista.FirmaBase64);
    // console.log('prueba1');

    let imgFirmaUE = reporteValvula.Usuario_Instrumentista.FirmaBase64;
    let testImageDataUrl = `data:image/png;base64,${imgFirmaUE}`;
    var docDefinition1 = {
        content: [
            `Usuario: ${pdfDatos1.nombre} pdfmake (since it\'s based on pdfkit) supports JPEG and PNG format`,
            `Edad: ${pdfDatos1.edad} If no width/height/fit is provided, image original size will be used`,
            {
                image: testImageDataUrl,
            },
            'If you specify width, image will scale proportionally',
            {
                image: testImageDataUrl,
                width: 150
            },
            'If you specify both width and height - image will be stretched',
            {
                image: testImageDataUrl,
                width: 150,
                height: 150,
            },
            'You can also fit the image inside a rectangle',
            {
                image: testImageDataUrl,
                fit: [100, 100],
                pageBreak: 'after'
            },
            'You can also cover the image inside a rectangle',
            {
                image: testImageDataUrl,
                cover: { width: 100, height: 100, valign: "bottom", align: "right" },
                pageBreak: 'after'
            },
            'Images can be also provided in dataURL format\n(the one below was taken from http://www.clipartbest.com/clipart-dT7zx5rT9)',
            {
                image: testImageDataUrl,
                width: 200
            },
            'or be defined in the "images" dictionary, which can be referenced by name:',
            {
                image: 'bee',
                width: 200
            },
            'and opacity is supported:',
            {
                image: testImageDataUrl,
                width: 150,
                opacity: 0.5
            },
        ],
        images: {
            bee: testImageDataUrl
        }
    };

    // var now = new Date();
    let pdfDoc1 = printer.createPdfKitDocument(docDefinition1);
    pdfDoc1.pipe(fs.createWriteStream('pdfs/images.pdf'));
    pdfDoc1.end();
    // console.log(new Date() - now);

    
    fbase64().then((resultado) => {
        // console.log('resultado base64', resultado);
        res.send({
            '$content-type': 'application/pdf', 
            '$content': resultado.toString('base64'),
            'reporteValvula': reporteValvula
        });
    }, (error) => {
        console.log('error', error)
    });

    
    /* if (a === true) {
        setTimeout(() => {
            let file  = fs.readFileSync('pdfs/images.pdf', {encoding: 'base64'});
            fs.writeFileSync('pdfs/archivo.txt', file);
            console.log(file);
            console.log('Se convirtio el archivo a base64');
        }, 1000);
        
    } else {
        console.log('Pendiente generar pdf')
    } */
        

    // let main = () => {
    //     console.log('Convertir archivo a base64'); 
    // }
    // main();
    
    // const archivopdf = 'pdfs/images.pdf';
    // const binaryData = fs.readFileSync(archivopdf);
    // const base64string = Buffer.from(binaryData).toString('base64');

    // console.log(base64string);
});

let fbase64 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let file  = fs.readFileSync('pdfs/images.pdf', { encoding: 'base64' });
            fs.writeFileSync('pdfs/archivo.txt', file);
            // console.log(file);
            // console.log('Se convirtio el archivo a base64');
            resolve(file); 
        }, 1000);
    })
}

module.exports = router;


