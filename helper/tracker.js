const sendTracker = ({ eventCategory, eventAction, eventLabel, dimension1 }) => {
  window && window.ga && window.ga('send', {
    hitType: 'event',
    eventCategory,
    eventAction,
    eventLabel,
    ...dimension1 && {
      dimension1
    }
  })
}

export {
  sendTracker
}