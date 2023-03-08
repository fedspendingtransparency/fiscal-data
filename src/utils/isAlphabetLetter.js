const isAlphabetLetter = (string) => {
  const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  if (!alphabet.includes(string)) {
    return false;
  }
  else if (alphabet.includes(string)) {
    return true;
  }
}

module.exports = { isAlphabetLetter };
