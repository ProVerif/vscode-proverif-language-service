export const joinOptionalLists = <T>(...lists: (T[] | undefined)[]): T[] => {
    return lists.reduce((previous: T[], current) => current ? previous.concat(current) : previous, []);
};
export const nonNullable = <TValue>(value: TValue): value is NonNullable<TValue> => {
    return value !== null && value !== undefined;
}