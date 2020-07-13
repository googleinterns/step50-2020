var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function revisionToId(revision) {
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

function revisionFromId(revisionId) {
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