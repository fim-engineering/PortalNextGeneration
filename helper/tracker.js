const sendTracker = ({ eventCategory, eventAction, eventLabel }) => {
  window && window.ga && window.ga('send', {
    hitType: 'event',
    eventCategory,
    eventAction,
    eventLabel'
  })
}

export {
  sendTracker
}