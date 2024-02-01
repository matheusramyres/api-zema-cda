const express = require('express');
const cors = require('cors');
const PDFPrinter = require('pdfmake');
var json2xls = require('json2xls');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(json2xls.middleware);
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
                        [
                            {text: "ID_PESSOA", style: "columnsTitle"},
                            {text: "NOME_PESSOA", style: "columnsTitle"},
                            {text: "DEPARTAMENTO", style: "columnsTitle"},
                        ],
                        ...usersArray
                    ],
                }
            }
        ],
        styles: {
            columnsTitle: {
                fontSize: 14,
                bold: true,
                color: "#fff",
                fillColor: "#5164a8"
            }
        }
    }
    const pdfDoc = printer.createPdfKitDocument(docDefinitions);

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

app.get('/generateXls', async (req, res)=>{
    res.xls('relatorio-ponto-encontro.xls', newUsers);
});

app.get('/produtos/:pagina', async(req, res)=>{
    const productPages = fs.readFileSync(path.resolve(`./produtos${req.params.pagina}.json`), 'utf8');
    const newProdutos = JSON.parse(productPages);
    res.json(newProdutos).status(200);
})


app.listen(3333, ()=>{
    console.log('listen: http://localhost:3333');
});
