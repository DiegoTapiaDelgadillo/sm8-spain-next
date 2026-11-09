export interface LinkPropsCustom {
  href: string;
  text: string;
}

export interface LinkPropsArray {
  links: LinkPropsCustom[];
}

export interface NavbarLinkProps extends LinkPropsCustom {
  isActive?: boolean;
  onClick?: () => void;
}

export interface EnlaceProps extends LinkPropsCustom {
  /** Abre en pestaña nueva con `rel="noopener noreferrer"`. */
  external?: boolean;
  /** Nombre accesible cuando el texto visible no basta. */
  ariaLabel?: string;
}
