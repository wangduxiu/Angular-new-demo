const finder = (lowercaseSearchText, item, key) => typeof item[key] !== 'object' && item[key] && item[key].toString().toLowerCase().indexOf(lowercaseSearchText) > -1;

export const filterBy = (array: any[], searchText?: string, keyName?: string | string[]) => {
  if (!array || !searchText || !Array.isArray(array)) {
    return array;
  }

  const lowercaseSearchText = searchText.toLowerCase();

  if (typeof array[0] === 'string') {
    return array.filter((item) => item.toLowerCase().indexOf(lowercaseSearchText) > -1);
  }

  const keys = [];
  if (typeof keyName === 'string' && keyName !== '') {
    // keyname is a string: add to keys, which will be an array with 1 string
    keys.push(keyName);
  } else if (Array.isArray(keyName)) {
    // keyname is an array of strings.  Add them to the keys-array (copy it)
    keys.push(...keyName);
  }


  if (keys.length === 0) {
    // Use all keys of each item
    return array.filter((item: any) => Object.keys(item).find(finder.bind(this, lowercaseSearchText, item)));
  } else {
    // Use predefined keys
    return array.filter((item: any) => keys.find((finder.bind(this, lowercaseSearchText, item))));
  }
};

export const limitTo = (array: any[], itemsCount: number, startIndex: number = 0) => {
  if (!Array.isArray(array)) {
    return array;
  }
  return array.slice(startIndex, startIndex + itemsCount);
};
