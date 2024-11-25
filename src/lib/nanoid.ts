const nanoid = (prefix: string = "") => {
    // 12 characters
    return prefix.concat(Math.random().toString(36).slice(2));
}

export default nanoid;