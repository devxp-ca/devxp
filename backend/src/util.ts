export const arr = <T>(data: T | T[]) => (Array.isArray(data) ? data : [data]);
