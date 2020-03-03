export enum NavigatorPosition {
  Hidden,
  Main,
  Side,
}

export enum NavigatorType {
  DragBrunch = 'drag-brunch',
}

function capitalize(s: string): string {
  if (typeof s !== 'string') {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getNavigatorTitle(navType: NavigatorType): string {
  switch (navType) {
    case NavigatorType.DragBrunch:
      return 'Drag Brunch';
    default:
      return capitalize(navType);
  }
}
