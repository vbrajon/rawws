const patch$ = require('fs').createWriteStream(__dirname + '/patches.log', { flags: 'a+', encoding: 'utf-8' })
const patches = JSON.parse('{' + (require('fs').readFileSync(__dirname + '/patches.log', { encoding: 'utf-8' })) + '}')
const wss = new (require('ws')).Server({ port: 1111 })
wss.on('connection', ws => {
  ws.on('message', m => {
    try {
      const json = JSON.parse(m)
      const type = typeof json
      // console.log('json', type, json)
      if (type === 'number') {
        // send the patches since timestamp
        const patch = Object.keys(patches)
          .filter(k => k > json)
          .map(k => patches[k])
          .flat()
        ws.send(JSON.stringify(patch))
      }
      if (type === 'object') {
        // store the patch
        const ts = Date.now()
        patch$.write(ts + ':' + m + ',\n')
        patches[ts] = json
        wss.clients.forEach(w => ws !== w && w.send(m))
      }
    } catch (e) {
      console.log('message', m)
    }
  })
})
