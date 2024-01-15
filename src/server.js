const express = require('express');
const cors = require('cors');
const PDFPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
const users = fs.readFileSync(path.resolve('./pessoas.json'), 'utf8');
const newUsers = JSON.parse(users);

app.get('/users', (req, res)=>{
    res.json(newUsers).status(200);
});

app.get('/makePdfUser', async (req, res)=>{
    
    var fonts = {
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique'
        }
    };
    const printer = new PDFPrinter(fonts);

    const usersArray = [];
    for await (let user of newUsers){
        const row = new Array();
        row.push(user.id_pessoa);
        row.push(user.nome_pessoa);
        row.push(user.departamento);
        
        usersArray.push(row);
    }
    const docDefinitions = {
        defaultStyle: { font: 'Helvetica' },
        content: [
            {
                table: {
                    body:[
                        ['id_pessoa', 'nome_pessoa', 'departamento'],
                        ...usersArray
                    ]
                }
            }
        ]
    }
    const pdfDoc = printer.createPdfKitDocument(docDefinitions);
    // pdfDoc.pipe(fs.createWriteStream('Relatorio.pdf'));

    const chunks = [];
    pdfDoc.on('data',(chunk)=>{
        chunks.push(chunk);
    });

    pdfDoc.end();

    pdfDoc.on('end',()=>{
        const result = Buffer.concat(chunks);
        res.end(result);
    });

      
});



app.listen(3333, ()=>{
    console.log('listen: 3333');
});
