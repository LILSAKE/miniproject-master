// Импортируем библиотеку fastify для развертывания веб-сервера
const fastify = require('fastify')({
    logger: true // Эта штука нужна, чтобы в терминале отображались логи запросов
})
var Pool = require('pg-pool')
var pool = new Pool({
    database: 'postgres',
    user: 'postgres',
    password: '123456789',
    port: 5432,
    ssl: false,
    max: 20, // set pool max size to 20
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
})

pool.on('error', (error, client) => {
    console.error(error)
    process.exit(-1)
})
pool.on('connect', client => {
    console.log('New client')
})
pool.on('remove', client => {
    console.log('Client pool removed')
})

// Блок кода, который нужен для исправления ошибки с CORS
fastify.register(require('@fastify/cors'), (instance) => {
    return (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: true
        };

        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(req.headers.origin)) {
            corsOptions.origin = false
        }

        // callback expects two parameters: error and options
        callback(null, corsOptions)
    }
})

// Создание маршрута для get запроса
fastify.get('/get',async function (request, reply) {//(/folder/update)
    const client = await pool.connect()
    let data = null
    try {
        const users = await client.query(`select * from users`)//delete * from users returning id
        console.log(users.rows);
        data = users.rows
    }
    catch(e) {
        console.log(e);
    }
    finally {
        client.release()
    }
    reply.send({ data })
})

fastify.post('/update',async function (request, reply) {//(/folder/update)
    const client = await pool.connect()
    let data = null 
    try {
        const users = await client.query(`update users set "name" = $1 where "id" = $2`, [request.body.name, request.body.id]);//delete * from users returning id||
        console.log(users.rows);
        data = users.rows
    }
    catch(e) {
        console.log(e);
    }
    finally {
        client.release()
    }
    reply.send({ data })
})


fastify.post('/insert',async function (request, reply) {//(/folder/update)
    const client = await pool.connect()
    let data = null 
    try {
        const users = await client.query(`insert into users ("name") values ($1)`, [request.body.name]);//delete * from users returning id||
        console.log(users.rows);
        data = users.rows
    }
    catch(e) {
        console.log(e);
    }
    finally {
        client.release()
    }
    reply.send({ data })
})


fastify.post('/delete',async function (request, reply) {//(/folder/update)
    const client = await pool.connect()
    let data = null 
    try {
        const users = await client.query(`delete from users where id = 2 returning id = $1`, [request.body.id]);//delete * from users returning id||
        console.log(users.rows);
        data = users
    }
    catch(e) {
        console.log(e);
    }
    finally {
        client.release()
    }
    reply.send({ data })
})




// Создание маршрута для post запроса
fastify.post('/post',function (request, reply) {
    console.log(`Тело запроса: `,JSON.stringify(request.body))
    reply.send(request.body)
})

// Создание запроса с использование path параметров
fastify.get('/:id',function (request, reply) {
    console.log(`Path параметры, переданные в запросе: `,JSON.stringify(request.params))
    reply.send(request.params)
})

// Создание запроса с использованием query параметров
fastify.get('/query',function (request, reply) {
    console.log(`Query параметры, переданные в запросе`, JSON.stringify(request.query))
    reply.send(request.query)
})

// Запускаем сервер на порту 3000
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})

// --Добавление информации 
// insert into users ("name") values ('имя') returning "id", "name"
// --Обновление информации 
// update users set "name" = 'Новое значение' where "id" = 5
// --Удаление
// delete from users where id = 5 returning id
