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

fastify.post('/folders/insert',async function (request, reply) {//(/folder/update)
    let data = {
        message: 'error',
        statusCode: 400
    }
    const urlName = 'folders/insert'
    const client = await pool.connect()

    try {
        const folders = await client.query(`insert into folders ("folderName", "folderColor") values ($1, $2) returning "folderId"`, [request.body.folderName, request.body.folderColor]);//delete * from users returning id||
        if(folders.rowCount > 0 && folders.rows.length > 0){
            data.message = folders.rows[0]
            data.statusCode = 200
        }
        else{
            console.log("Произошла ошибка");
        }
        
        console.log(folders);
    }
    catch(e) {
        console.log(e);
    }
    finally {
        client.release()
        console.log(urlName, "client relese");
    }
    reply.send({ answer:data })
})

// fastify.get('/folders/get',async function (request, reply) {//(/folder/update)
//     const client = await pool.connect()
//     let data = null
//     try {
//         const folders = await client.query(`select * from folders`)//delete * from users returning id
//         console.log(folders.rows);
//         data = folders.rows
//     }
//     catch(e) {
//         console.log(e);
//     }
//     finally {
//         client.release()
//     }
//     reply.send({ answer:data })
// })

fastify.post('/folders/delete',async function (request, reply) {//(/folder/update)
    const client = await pool.connect()
    let data = null 
    try {
        const folders = await client.query(`delete from folders where "folderId" = 1 returning "folderId" = $1`, [request.body.folderId]);//delete * from users returning id||
        console.log(folders.rows);
        data = folders
    }
    catch(e) {
        console.log(e);
    }
    finally {
        client.release()
    }
    reply.send({ answer:data })
})

fastify.post('/folders/update',async function (request, reply) {//(/folder/update)
    let data = {
        message: 'error',
        statusCode: 400
    }
    const urlName = 'folders/update'
    const client = await pool.connect()

    try {
        const folders = await client.query(`update folders set "folderName" = $1 where "folderId" = $2 returning *`, [request.body.folderName, request.body.folderId]);//delete * from users returning id||
        if(folders.rowCount > 0 && folders.rows.length > 0){
            data.message = folders.rows[0]
            data.statusCode = 200
        }
        else{
            console.log("Произошла ошибка");
        }
        
        console.log(folders);
    }
    catch(e) {
        console.log(e);
    }
    finally {
        client.release()
        console.log(urlName, "client relese");
    }
    reply.send({ answer:data })
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


// получение всех
fastify.get('/folders/get', async function (request, reply) {
    let data = {
        message:'error',
        statusCode:400
    }
    const urlName = '/folder/show'
    const client = await pool.connect()
    try {
        const folders = await client.query(`select "folderId","folderName","folderColor" from folders`);
        data.message = folders.rows
        data.statusCode = 200
    } catch (e) {
        console.log(e);
    }
    finally{
        client.release()
        console.log();
    }
    reply.send(data)
})
