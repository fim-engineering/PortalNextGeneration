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

const sendPageview = ({ pathName }) => {
  window && window.ga && window.ga('send', {
    hitType: 'pageview',
    page: pathName
  })
}

export {
  sendTracker,
  sendPageview,
}