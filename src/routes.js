import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks/'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title || !description) return res.writeHead(400).end("Campos faltando")

            const task = {
                id: randomUUID(),
                title: title,
                description: description, 
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }
            
            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks/list'),
        handler: (req, res) => {
            const tasks = database.select('tasks')

            return res.writeHead(200).end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if (!title || !description) return res.writeHead(400).end("Campos não valido")
            
            database.update('tasks', id, {
                title,
                description,
                updated_at: new Date()
            })
            
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)
            
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.select('tasks', { id })[0]

            database.update('tasks', id, {
                title: task.title,
                description: task.description,
                created_at: task.created_at,
                completed_at: new Date(),
                updated_at: new Date()
            })

            return res.writeHead(204).end()
        }
    },
]