export const joinOptionalLists = <T>(...lists: (T[] | undefined)[]): T[] => {
    return lists.reduce((previous: T[], current) => current ? previous.concat(current) : previous, []);
};