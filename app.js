const express = require('express')
const path = require('path')
const app = express()
const port = 3030

console.log(path.join(__dirname, '/components/'))

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/landing.html'))
})

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/game.html'))
})

app.get('/consent', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/consent.html'))
})

app.get('/information', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/information.html'))
})

app.get('/debrief', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/debrief.html'))
})

app.get('/tutorial', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/tutorial.html'))
})

app.post('/api/save/', (req, res) => {
    res.send(`POST`)
})

app.use('*/css', express.static('static/css'));
app.use('*/imgs', express.static('static/imgs'));
app.use('*/src', express.static('src'));
app.use('*/lib', express.static('lib'));
app.use('*/components', express.static('components'));
app.use('*/utils', express.static('utils'));