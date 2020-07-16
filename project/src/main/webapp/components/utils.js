export function convertMillisToTimestamp(millis) {
  let date = new Date(millis);
  const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  date = date.toLocaleString('en-US', dateOptions);
  return date;
}

// Source: Firepad firebase-adapter.js
export function revisionToId(revision) {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if (revision === 0) {
    return 'A0';
  }

  var str = '';
  while (revision > 0) {
    var digit = (revision % characters.length);
    str = characters[digit] + str;
    revision -= digit;
    revision /= characters.length;
  }

  // Prefix with length (starting at 'A' for length 1) to ensure the id's sort lexicographically.
  var prefix = characters[str.length + 9];
  return prefix + str;
}

export function revisionFromId(revisionId) {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if (revisionId.length > 0 && revisionId[0] === characters[revisionId.length + 8]) {
    var revision = 0;
    for(var i = 1; i < revisionId.length; i++) {
      revision *= characters.length;
      revision += characters.indexOf(revisionId[i]);
    }
    return revision;  
  } else {
    console.log("Invalid revision ID");
    return -1; 
  }
}