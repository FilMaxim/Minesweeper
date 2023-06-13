function commit(name, title) {
  localStorage.setItem(name, JSON.stringify(title));
}

export default commit;
