import fs from 'fs'
import { parse } from 'csv-parse'
import fetch from 'node-fetch';

const csvFilePath = './csv/dados.csv'

const stream = fs.createReadStream(csvFilePath).pipe(parse({
    delimiter: ',',
    from_line: 2
}))

for await(const [title, description] of stream) {
    const response = await fetch('http://localhost:3333/tasks/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    })

    if (!response.ok) console.log('Deu errado')

    console.log(`Criada tarefa com título: ${title} e descrição: ${description}`)
}