/**
 * this is empty function for filling empty interface function for conversion
 * @returns
 */
export const _FILL_INTERFACE_METHODS = (...any: any[] | undefined): any => {
  throw "you cannot execute this function. the node containing this function was originated from figma remote api, wichi I/O access cannot be permitted.";
};

export const __FIND_PARENT_REFERENCE = (): any => {
  throw "find parent not implemented";
};

export const __TO_STRING__CALL = (id: string, name: string) => {
  return () => {
    return `rem/${name}:${id}`;
  };
};
