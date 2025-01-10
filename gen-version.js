// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs")

fs.readFile('./package.json', 'utf-8', (err, data) => {
    if (err) {
        return
    }
    const packageJson = JSON.parse(data)
    fs.writeFile('./VERSION', `version=v${packageJson.version}`, () => {
        console.log("VERSION generated!")
    })
})
