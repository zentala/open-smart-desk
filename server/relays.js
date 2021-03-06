const observer = require('node-observer')
const GPIO = require('onoff').Gpio

const config = require('./config')
const logger = require('./logger')

module.exports = () => {
  let relays = []
  config.relay.pins.forEach((pin, index) => {
    logger.info(`Initializing relay no.${index} on pin no.${pin}`)
    relays[index] = new GPIO(pin, 'out')
    relays[index].writeSync(1) // initialize disabled
  })

  observer.subscribe(this, 'motor', (who, direction) => {
    logger.info(direction == 'stop'
      ? `Stoping desk `
      : `Moving desk ${direction}`)

    const states = config.relay.directions[direction]
    states.forEach((state, index) => {
      logger.debug(`Setting relay no.${index} to ${state}`)
      relays[index].writeSync(state)
    })
  })

  observer.subscribe(this, 'relay', (who, data) => {
    logger.debug(`Setting relay no.${data.number} to ${data.state}`)
    relays[data.number].writeSync(data.state)
  })

}
