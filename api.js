const wss = new (require('ws')).Server({ port: 1111 })
const store = []
wss.on('connection', ws => {
  ws.on('message', m => {
    if (m.length <= 4) return store.length > +m && ws.send('0000' + JSON.stringify(store.slice(+m || 0)))
    if (+m.slice(0, 4) !== store.length) return console.log('ID not valid', +m.slice(0, 4), store.length, store.slice(-1)[0])
    store.push(m.slice(4))
    wss.clients.forEach(w => ws !== w && w.send(m))
  })
})
