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