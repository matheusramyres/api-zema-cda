const express = require('express');
const PDFPrinter = require('pdfmake');
const fs = require('fs');

const app = express();
app.use(express.json());
const users = [
    {id_pessoa: 2311, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 2'},
    {id_pessoa: 2312, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 3'},
    {id_pessoa: 2313, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 4'},
    {id_pessoa: 2314, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 5'},
    {id_pessoa: 2315, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 6'},
    {id_pessoa: 2316, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 7'},
    {id_pessoa: 2317, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 8'},
    {id_pessoa: 2318, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 9'},
    {id_pessoa: 2319, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 10'},
    {id_pessoa: 2320, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 11'},
    {id_pessoa: 2321, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 12'},
    {id_pessoa: 2322, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 13'},
    {id_pessoa: 2323, nome_pessoa: 'JOSE ARNALDO DA SILVA', departamento: '	TI - ERP 14'},
];

app.get('/users', (req, res)=>{

    res.json(users).status(200);
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
    for await (let user of users){
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
