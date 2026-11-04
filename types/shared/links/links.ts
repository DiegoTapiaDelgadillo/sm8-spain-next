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
