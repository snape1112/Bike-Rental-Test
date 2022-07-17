export function stringToColor(string: string) {
  let hash = 0;
  let i;

  if(!string) return "#fff"

  /* eslint-disable no-bitwise */
  for (i = 0; i < string?.length; i += 1) {
    hash = string?.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function getChildren(name: string) {
  if(!name) return ""
  
  const nameSplitted = name.split(' ')
  
  let children = nameSplitted[0][0]
  
  if(nameSplitted.length > 1)  {
    children += nameSplitted[nameSplitted.length - 1][0]
  }

  return children
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: getChildren(name),
  };
}