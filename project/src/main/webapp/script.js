// Used in document.jsp
function showElement(id) {
  let element = document.querySelector(id);
  if (element === null) {
    element = document.getElementById(id);
  }
  element.className += ' is-active';
}

function hideElement(id) {
  let element = document.querySelector(id);
  if (element === null) {
    element = document.getElementById(id);
  }
  element.className = element.className.replace('is-active', '');
}

function toggleElement(id) {
  let element = document.querySelector(id);
  if (element === null) {
    element = document.getElementById(id);
  }
  if (element.className.includes('is-active')) {
    hideElement(id);
  } else {
    showElement(id);
  }
}

function toggleElementReload(id) {
  let element = document.querySelector(id);
  if (element === null) {
    element = document.getElementById(id);
  }
  if (element.className.includes('is-active')) {
    hideElement(id);
    window.location.reload(true);
  } else {
    showElement(id);
  }
}