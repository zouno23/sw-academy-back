function generateCode() {
  // Définir les caractères possibles
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Générer un code aléatoire de 6 caractères
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  // Retourner le code
  return code;
}

module.exports = { generateCode };
