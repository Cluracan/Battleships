function cleanContent(...args) {
  for (const contentDiv of [...args]) {
    while (contentDiv.firstChild) {
      contentDiv.removeChild(contentDiv.firstChild);
    }
  }
}

export { cleanContent };
