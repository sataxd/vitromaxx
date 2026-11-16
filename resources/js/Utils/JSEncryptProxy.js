const JSEncrypt = typeof window !== 'undefined' ? (window.JSEncrypt || class {
    setPublicKey() {}
    encrypt(text) { return text; }
    decrypt(text) { return text; }
}) : class {};

export default JSEncrypt;
